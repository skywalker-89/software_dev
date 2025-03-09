"use client";
import React, { useState, useRef, useCallback } from "react";
import { IdentificationIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Webcam from "react-webcam";
import { useEffect } from "react";

interface VerificationFormProps {
  onSubmit: (status: "pending" | "unclear") => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onSubmit }) => {
  const [images, setImages] = useState<File[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    id: "",
  });

  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
    }
  }, [user]);

  // Handle Image Upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => setImages([...images, ...acceptedFiles]),
  });

  const handleOpenCamera = () => setIsScanning(true);

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsScanning(false);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!user || images.length === 0 || !capturedImage) {
      alert("Please upload both ID and face image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("user_id", user.id);
    formData.append("id_card", images[0]);
    formData.append(
      "face_picture",
      await fetch(capturedImage).then((res) => res.blob())
    );

    try {
      const response = await fetch(
        "http://localhost:1111/verification/submit",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        onSubmit("pending");
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ID Card / Passport Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          ID Verification
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <IdentificationIcon className="w-16 h-16 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">
            <span className="text-blue-500 font-medium">
              Select ID Card or Passport here
            </span>
          </p>
        </div>
      </div>

      {/* Display Selected ID Card Image */}
      {images.length > 0 && (
        <div className="mt-4 flex justify-center mb-6">
          <div
            className="relative w-80 h-52 border border-gray-300 shadow-lg rounded-lg overflow-hidden"
            onClick={() => setZoomedImage(URL.createObjectURL(images[0]))}
          >
            <Image
              src={URL.createObjectURL(images[0])}
              alt="Selected ID"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      )}

      {/* Face Scan Button - Forced to Match Email/Password Width */}
      <div className="w-full">
        <button
          onClick={handleOpenCamera}
          className="bg-blue-500 text-white py-2 w-full rounded-lg hover:bg-blue-600 focus:outline-none text-lg"
        >
          Scan Your Face Here
        </button>
      </div>

      {/* Webcam Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 md:w-[500px] relative">
            <h2 className="text-xl font-bold mb-4 text-center">Face Scan</h2>
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-[300px] md:h-[350px] rounded-lg"
              />
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsScanning(false)}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Captured Face Image */}
      {capturedImage && (
        <div className="mt-4 flex justify-center">
          <div
            className="relative w-64 h-64 rounded-full overflow-hidden border border-gray-300"
            onClick={() => setZoomedImage(capturedImage)}
          >
            <Image
              src={capturedImage}
              alt="Captured Face"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
      )}

      {/* Verify Button - Forced to Match Email/Password Width */}
      <div className="w-full mt-4">
        <button
          onClick={handleSubmit}
          disabled={images.length === 0 || !capturedImage}
          className={`py-2 w-full rounded-lg focus:outline-none text-lg ${
            images.length === 0 || !capturedImage
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
              Uploading...
            </span>
          ) : (
            "Verify"
          )}
        </button>
      </div>
      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-black rounded-full p-2"
            onClick={() => setZoomedImage(null)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="relative w-[90vw] h-[70vh]">
            <Image
              src={zoomedImage}
              alt="Zoomed Image"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationForm;
