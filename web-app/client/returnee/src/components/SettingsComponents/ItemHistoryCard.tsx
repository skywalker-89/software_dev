import React, { useState } from "react";
import Image from "next/image";

interface ItemHistoryCardProps {
  name: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[];
  claimStatus: "claimed" | "unclaimed";
}

const ItemHistoryCard: React.FC<ItemHistoryCardProps> = ({
  name,
  status,
  description,
  lastSeen,
  time,
  images,
  claimStatus,
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Carousel Section */}
      <div className="relative group">
        <Image
          src={images[currentImage]}
          alt={`${name} - ${currentImage + 1}`}
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
          {currentImage + 1}/{images.length}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ❯
        </button>
      </div>

      {/* Status Bar */}
      <div
        className={`h-8 w-full flex items-center justify-center text-white text-sm font-bold ${
          status === "lost" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {status === "lost" ? "Lost Item" : "Found Item"}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <span className="font-bold">Last Seen:</span> {lastSeen}
          </p>
          <p>
            <span className="font-bold">Time:</span> {time}
          </p>
        </div>
      </div>

      {/* Claim Status Banner */}
      <div
        className={`h-8 w-full flex items-center justify-center text-white text-sm font-bold ${
          claimStatus === "claimed" ? "bg-blue-500" : "bg-yellow-500"
        }`}
      >
        {claimStatus === "claimed" ? "Claimed" : "Unclaimed"}
      </div>
    </div>
  );
};

export default ItemHistoryCard;
