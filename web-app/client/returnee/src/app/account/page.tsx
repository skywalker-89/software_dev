import React from "react";
import Navbar from "../../components/Navbar";

const SettingList = () => {
  const settings = [
    "Edit Profile",
    "Account Setting",
    "Items History",
    "Privacy & Policy",
    "Logout",
    "Delete Account",
  ];

  return (
    <div className="w-64 border-r border-gray-300 p-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-400 mx-auto"></div>
        <h4 className="mt-2 text-lg font-semibold">Name Lastname</h4>
        <p className="text-sm text-gray-600">email@example.com</p>
      </div>
      {settings.map((item, index) => (
        <div
          key={index}
          className={`p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100 ${
            item === "Logout" || item === "Delete Account" ? "text-red-500" : ""
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const AccountPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <SettingList />
        <div className="flex-1 p-6 text-center">
          <h1 className="text-2xl font-bold">Blank</h1>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
