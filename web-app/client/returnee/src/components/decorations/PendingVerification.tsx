import React from "react";

const PendingVerification: React.FC = () => {
  return (
    <div className="p-6 text-center bg-yellow-100 border border-yellow-400 rounded-lg">
      <h2 className="text-xl font-semibold text-yellow-700">
        Your verification is under review.
      </h2>
      <p className="text-yellow-600 mt-2">
        Please wait while we process your submission.
      </p>
    </div>
  );
};

export default PendingVerification;
