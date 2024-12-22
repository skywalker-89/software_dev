"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import { PhotoIcon } from "@heroicons/react/24/outline";

// Dynamically load the map component (for Leaflet or any mapping library)
const MapSection = dynamic(() => import("../../components/MapSection"), {
  ssr: false,
});

const FoundItem = () => {
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [lastSeen, setLastSeen] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const handleSubmit = () => {
    const formData = {
      images,
      description,
      lastSeen,
      time: selectedDate,
    };
    console.log("Form Data Submitted: ", formData);
    alert("Lost item report submitted successfully!");
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <main className="w-full max-w-full max-h-full h-full mx-auto mt-0 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6">Post Found Item</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Select Images Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Images
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-center">
                  <PhotoIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-600">
                    <span className="text-blue-500 font-medium">
                      Choose the images here
                    </span>
                  </p>
                </div>
              </div>
              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Uploaded Images:</h3>
                  <ul className="grid grid-cols-2 gap-4">
                    {images.map((file, index) => (
                      <li key={index} className="relative group">
                        <div className="relative w-full h-32">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                          />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 hover:bg-red-500 focus:outline-none"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the found item..."
                className="w-full h-full max-h-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                rows={10}
                aria-label="Description"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Last Seen Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Where you found it?
              </label>
              <input
                type="text"
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
                placeholder="Where did you found this item?"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                aria-label="Last seen location"
              />
            </div>

            {/* Picking Location on Map */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Pick Location on the Map
              </label>
              <div className="w-full h-64 border rounded-lg overflow-hidden">
                <MapSection />
              </div>
            </div>

            {/* Time Selecting Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="datetime-local"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                aria-label="Select time"
                placeholder="Pick a time"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-PrimaryColor text-white py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Submit lost item report"
          >
            Submit
          </button>
        </div>
      </main>
    </div>
  );
};

export default FoundItem;
