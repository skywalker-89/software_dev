"use client";

import React from "react";
import Link from "next/link";

const ConfirmationPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Time & Place Confirmed!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The pickup time and place have been successfully confirmed. Please
          make sure to arrive at the scheduled time.
        </p>
        <Link href="/" passHref>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ConfirmationPage;
