"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter
// import toast, { Toaster } from "react-hot-toast";

interface VerifiedFirstProps {
  onClose: () => void;
}

const VerifiedFirst: React.FC<VerifiedFirstProps> = ({ onClose }) => {
  const router = useRouter(); // Initialize router

  const handleVerify = () => {
    onClose();
    router.push("/account"); // Navigate to the account page
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      {/* <Toaster position="bottom-right" /> */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verification Required
        </h2>
        <p className="text-gray-700 text-center mb-6">
          You need to verify your account before making a request. Please
          complete the verification process to continue.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              handleVerify();
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedFirst;
