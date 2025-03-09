"use client";
import React from "react";
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
      <h1 className="text-2xl font-bold mb-4">Account Verification</h1>

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
