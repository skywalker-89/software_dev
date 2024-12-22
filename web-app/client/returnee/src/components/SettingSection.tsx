import React from "react";

const SettingsSection: React.FC = () => {
  return (
    <div>
      {/* Account Settings */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Account Settings
        </h2>
        <button className="w-full p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
          Edit Profile
        </button>
      </div>

      {/* Privacy and Policy */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">
          Privacy and Policy
        </h3>
        <p className="text-gray-600">
          Read our{" "}
          <a href="#" className="text-blue-500">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Action Buttons */}
      <div>
        <button className="w-full p-4 mb-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
          Delete Account
        </button>
        <button className="w-full p-4 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsSection;
