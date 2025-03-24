"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

interface ReScheduleProps {
  chatId: string; // chatId to fetch chat and participant details
  participantsNUMIDs: string[]; // Array of participant IDs
  onClose: () => void; // Function to close the modal
}
interface Item {
  title: string;
  // Add other properties of the item if needed
}
const ReSchedule: React.FC<ReScheduleProps> = ({
  chatId,
  participantsNUMIDs,
  onClose,
}) => {
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState<Item | null>(null);

  interface Participant {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    id: string;
  }

  const [participants, setParticipants] = useState<Participant[]>([]); // Store participants' data

  // Fetch participants' data when the component mounts
  useEffect(() => {
    const fetchParticipantsData = async () => {
      try {
        // Fetch user data for each participant ID
        const participantData = await Promise.all(
          participantsNUMIDs.map(async (id) => {
            const response = await fetch(
              `http://${process.env.id}:1111/auth/user/${id}`
            );
            const data = await response.json();
            if (response.ok) {
              return data.user;
            } else {
              throw new Error(`Error fetching data for participant ${id}`);
            }
          })
        );
        setParticipants(participantData);
      } catch (error) {
        console.error("Error fetching participants data:", error);
        toast.error("Failed to fetch participant details.");
      }
    };

    const fetchItemData = async () => {
      try {
        const response = await fetch(
          `http://${process.env.id}:1111/items/specified/${chatId}`
        );
        const data = await response.json();
        if (response.ok) {
          setItem(data);
        } else {
          throw new Error("Error fetching item data");
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
        toast.error("Failed to fetch item details.");
      }
    };

    fetchParticipantsData();
    fetchItemData();
  }, [participantsNUMIDs]);

  const handleSubmit = async () => {
    console.log("🟡 handleSubmit() FUNCTION CALLED!");
    console.log(participants);
    // console.log(item);

    if (!location || !dateTime) {
      toast.error("Please enter a location and select a date & time.");
      return;
    }

    setLoading(true);

    try {
      console.log("📧 Sending request via parent function");

      // Fetch sender and recipient emails from participants
      const senderEmail = participants[0].email; // Assuming the first participant is the sender
      const senderFirstName = participants[0].first_name;
      const senderLastName = participants[0].last_name;
      const senderPhone = participants[0].phone;
      const senderId = participants[0].id;
      const recipientEmail = participants[1].email; // Assuming the second participant is the recipient
      const title = item ? item.title : "";

      //   Make API request to send confirmation email
      const response = await fetch(
        `http://${process.env.id}:1111/email/re-schedule?recipientEmail=${recipientEmail}&senderEmail=${senderEmail}&location=${location}&dateTime=${dateTime}&title=${title}&id=${chatId}&senderFirstName=${senderFirstName}&senderLastName=${senderLastName}&senderPhone=${senderPhone}&senderId=${senderId}`,
        {
          method: "GET", // You could also use POST if needed
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Confirmation email sent successfully.");
        onClose();
        // ✅ Redirect from the client-side
        window.location.href = "/gmailConfirm";
      } else {
        toast.error(data.message || "Failed to send confirmation email.");
      }
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
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReSchedule;
