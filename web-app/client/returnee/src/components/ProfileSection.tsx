import React from "react";

const ProfileSection: React.FC = () => {
  return (
    <div>
      {/* Profile Information */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Profile</h2>
        <p className="text-gray-600">Manage your personal details and items</p>
      </div>

      {/* Returned Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Returned Items</h3>
        <ul className="space-y-2">
          {/* Example Item */}
          <li className="p-4 bg-gray-100 rounded-md shadow">
            <p className="text-gray-800">Item Name</p>
            <p className="text-sm text-gray-600">Returned on: 20 Dec 2024</p>
          </li>
        </ul>
      </div>

      {/* Lost Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Lost Items</h3>
        <ul className="space-y-2">
          {/* Example Item */}
          <li className="p-4 bg-gray-100 rounded-md shadow">
            <p className="text-gray-800">Item Name</p>
            <p className="text-sm text-gray-600">Status: Found</p>
          </li>
        </ul>
      </div>

      {/* Scheduled Items */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700">Scheduled Items</h3>
        <ul className="space-y-2">
          {/* Example Item */}
          <li className="p-4 bg-gray-100 rounded-md shadow">
            <p className="text-gray-800">Item Name</p>
            <p className="text-sm text-gray-600">Pick-up: 22 Dec 2024</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSection;
