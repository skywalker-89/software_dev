"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
// import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import { PhotoIcon } from "@heroicons/react/24/outline";
import SelectableMap from "../../components/SelectableMap";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

// Dynamically load the map component (for Leaflet or any mapping library)
// const MapSection = dynamic(() => import("../../components/MapSection"), {
//   ssr: false,
// });

const FoundItem = () => {
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [foundLocation, setFoundLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state for overlay

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

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    id: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setLoading(true); // ✅ Show loading overlay

    // Prepare FormData to sned images + other data
    const formData = new FormData();
    images.forEach((images) => {
      formData.append("images", images); // must match backend field name
    });

    formData.append("title", title);
    formData.append("description", description);
    formData.append("found_location", foundLocation);
    formData.append("latitude", selectedLocation.lat.toString());
    formData.append("longitude", selectedLocation.lng.toString());
    formData.append("founder_id", user.id); // change dynamically

    try {
      const response = await fetch(
        "http://localhost:1111/items/post-found-item",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit found item report.");
      }

      const result = await response.json();
      console.log("Success:", result);
      setLoading(false); // ✅ Hide loading overlay
      toast.success("Found item report submitted successfully.");

      setTitle("");
      setImages([]);
      setDescription("");
      setFoundLocation("");
      setSelectedDate("");
      setSelectedLocation({ lat: 0, lng: 0 });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit found item report.");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Toaster position="bottom-right" /> {/* ✅ Notification system */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-PrimaryColor border-solid"></div>
          <p className="ml-4 text-PrimaryColor font-medium text-lg">
            Reporting lost item...
          </p>
        </div>
      )}
      {/* Navbar */}
      <Navbar />
      {/* Content */}
      <main className="w-full max-w-full max-h-full h-full mx-auto mt-0 bg-white p-6">
        <h1 className="text-2xl font-bold mb-6">Post Found Item</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for the found item..."
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                aria-label="Title"
              />
            </div>
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
                value={foundLocation}
                onChange={(e) => setFoundLocation(e.target.value)}
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
                <SelectableMap onLocationSelect={handleLocationSelect} />
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
