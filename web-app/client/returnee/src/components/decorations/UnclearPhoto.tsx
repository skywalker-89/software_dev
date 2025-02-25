import React from "react";

const UnclearPhoto: React.FC = () => {
  return (
    <div className="mt-4 text-center text-red-700">
      <p>
        ❌ Invalid picture. Please upload a new one as the previous submission
        was unclear.
      </p>
    </div>
  );
};

export default UnclearPhoto;
