"use client";
import React, { useState, useRef, useCallback } from "react";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Webcam from "react-webcam";

interface VerificationFormProps {
  onSubmit: (status: "pending" | "unclear") => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onSubmit }) => {
  const [images, setImages] = useState<File[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Handle Image Upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => setImages([...images, ...acceptedFiles]),
  });

  // const removeImage = (index: number) => {
  //   setImages(images.filter((_, i) => i !== index));
  // };

  // Handle Webcam Capture
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
        <div className="mt-4">
          <div className="relative w-64 h-64">
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
          onClick={() => onSubmit("pending")}
          disabled={images.length === 0 || !capturedImage}
          className={`py-2 w-full rounded-lg focus:outline-none text-lg ${
            images.length === 0 || !capturedImage
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerificationForm;
