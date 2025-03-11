"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface SendPicRequestProps {
  onClose: () => void;
  onSendRequest: (formData: FormData, type: "return") => Promise<void>;
  recipientEmail: string;
  firstName: string;
  lastName: string;
  senderEmail: string;
  user_id: string; // ✅ Add user_id to props
  poster_id: string; // ✅ Add poster_id to props
  item_id: string; // ✅ Add item_id to props
  title: string;
}

const SendPicRequest: React.FC<SendPicRequestProps> = ({
  onClose,
  onSendRequest,
  recipientEmail,
  firstName,
  lastName,
  senderEmail,
  user_id, // ✅ Destructure user_id from props
  poster_id, // ✅ Destructure poster_id from props
  item_id, // ✅ Destructure item_id from props
  title,
}) => {
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    if (files.length + images.length > 10) {
      toast.error("You can upload up to 10 images only.");
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    console.log("🟡 handleSubmit() FUNCTION CALLED!");

    if (!location || !dateTime) {
      toast.error("Please enter a location and select a date & time.");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("recipientEmail", recipientEmail);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("location", location);
      formData.append("dateTime", dateTime);
      formData.append("senderEmail", senderEmail);
      formData.append("type", "return");
      formData.append("user_id", user_id);
      formData.append("poster_id", poster_id);
      formData.append("id", item_id);
      formData.append("title", title);

      images.forEach((image) => formData.append("images", image));

      console.log("📧 Sending request via parent function with images");

      console.log(formData);
      await onSendRequest(formData, "return");

      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to send request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <Toaster position="bottom-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Pictures & Select Time
        </h2>

        {/* 📍 Location Input */}
        <div className="mb-6">
          <label className="block font-medium text-lg mb-2">
            Pickup Location
          </label>
          <input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-md text-lg focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>

        {/* ⏰ Date & Time Picker */}
        <div className="mb-6">
          <label className="block font-medium text-lg mb-2">
            Select Date & Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full p-3 border rounded-md text-lg focus:outline-none focus:ring focus:ring-blue-300"
            disabled={loading}
          />
        </div>

        {/* 📷 Image Upload */}
        {/* Hidden File Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="file-upload"
        />

        {/* Custom Upload Button */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold border border-gray-300 hover:border-blue-400 transition flex items-center justify-center w-full sm:w-auto"
        >
          Select Images
        </label>

        {/* 🖼 Image Preview */}
        <div className="flex flex-wrap gap-3 mb-6 mt-6">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index}`}
                className="w-20 h-20 object-cover rounded-md shadow-md"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendPicRequest;
