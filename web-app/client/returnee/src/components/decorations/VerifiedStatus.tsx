import React from "react";

const VerifiedStatus: React.FC = () => {
  return (
    <div className="p-6 text-center bg-green-100 border border-green-400 rounded-lg">
      <h2 className="text-xl font-semibold text-green-700">Verified</h2>
      <p className="text-green-600 mt-2">
        Your account has been successfully verified.
      </p>
    </div>
  );
};

export default VerifiedStatus;
