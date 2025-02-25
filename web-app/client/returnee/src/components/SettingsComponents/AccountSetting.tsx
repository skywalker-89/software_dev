"use client";
import React, { useState } from "react";
import PendingVerification from "../decorations/PendingVerification";
import VerifiedStatus from "../decorations/VerifiedStatus";
import UnclearPhoto from "../decorations/UnclearPhoto";
import VerificationForm from "../decorations/VerificationForm";

// ✅ Define User Interface
interface User {
  first_name: string;
  last_name: string;
  email: string;
  profilePicture: string;
  verified: string;
}

interface AccountSettingProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const AccountSetting: React.FC<AccountSettingProps> = ({ user, setUser }) => {
  const [password, setPassword] = useState("");

  // ✅ Handle verification status update
  const handleVerificationStatusChange = (
    status: "pending" | "unclear" | "verified" | "not_verified"
  ) => {
    setUser((prevUser) => ({
      ...prevUser,
      verified: status, // ✅ Corrected field
    }));
    localStorage.setItem("user", JSON.stringify({ ...user, verified: status }));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      {/* User Email Field */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={user?.email || ""} // ✅ Use optional chaining and default to an empty string
          onChange={(e) =>
            setUser((prevUser) => ({
              ...prevUser,
              email: e.target.value,
            }))
          }
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* User Password Field */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* 🔹 Verification Status Handling */}
      {user.verified === "verified" && <VerifiedStatus />}
      {user.verified === "pending" && <PendingVerification />}
      {user.verified === "unclear" && (
        <>
          <VerificationForm onSubmit={handleVerificationStatusChange} />
          <UnclearPhoto />
        </>
      )}
      {user.verified === "not_verified" && (
        <VerificationForm onSubmit={handleVerificationStatusChange} />
      )}
    </div>
  );
};

export default AccountSetting;
