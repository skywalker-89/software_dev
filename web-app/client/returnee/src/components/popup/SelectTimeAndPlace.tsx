"use client";

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

interface SelectTimeAndPlaceProps {
  onClose: () => void;
  onSendRequest: (
    location: string,
    dateTime: string,
    type: "claim" | "return",
    senderEmail: string
  ) => Promise<void>;
  recipientEmail: string;
  firstName: string;
  lastName: string;
  senderEmail: string;
  type: "claim" | "return";
}

const SelectTimeAndPlace: React.FC<SelectTimeAndPlaceProps> = ({
  onClose,
  onSendRequest,
  type,
  senderEmail,
}) => {
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    console.log("🟡 handleSubmit() FUNCTION CALLED!");
    console.log("Sender Email:", senderEmail);

    if (!location || !dateTime) {
      toast.error("Please enter a location and select a date & time.");
      return;
    }

    setLoading(true);

    try {
      console.log("📧 Sending request via parent function");
      await onSendRequest(location, dateTime, type, senderEmail);
      // toast.success("✅ Request sent successfully!");
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
          Select Time & Place
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
            disabled={loading} // Disable when sending request
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
            disabled={loading} // Disable when sending request
          />
        </div>

        {/* Buttons - Separated in Mobile Mode */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log("🟢 Submit Button Clicked!");
              handleSubmit();
            }}
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

export default SelectTimeAndPlace;
