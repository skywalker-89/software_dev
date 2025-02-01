import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ItemCardProps {
  id: string;
  title: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[]; // Array of image URLs
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  title,
  status,
  description,
  lastSeen,
  time,
  images = [], // ✅ Ensure images default to an empty array
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div
      className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative"
      onClick={() => router.push(`/item/${id}`)}
    >
      {/* ✅ Image Carousel */}
      <div className="relative group w-full h-40">
        {images.length > 0 ? (
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={images[currentImage]}
              alt={`${title} - ${currentImage + 1}`}
              width={400}
              height={160}
              className="w-full h-40 object-cover rounded-t-lg transition-transform duration-500 ease-in-out"
              onError={(e) => {
                e.currentTarget.src = "/fallback-image.png"; // ✅ Set a fallback image
              }}
            />
          </div>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-t-lg">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        {images.length > 1 && (
          <>
            {/* ✅ Image Counter (Shows "1/2", "3/4", "1/10", etc.) */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
              {currentImage + 1} / {images.length}
            </div>

            {/* ✅ Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md pointer-events-auto"
            >
              ❮
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md pointer-events-auto"
            >
              ❯
            </button>
          </>
        )}
      </div>

      {/* ✅ Status Bar */}
      <div
        className={`h-8 w-full flex items-center justify-center text-white text-sm font-bold ${
          status === "lost" ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {status === "lost" ? "Lost Item" : "Found Item"}
      </div>

      {/* ✅ Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
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
    </div>
  );
};

export default ItemCard;
