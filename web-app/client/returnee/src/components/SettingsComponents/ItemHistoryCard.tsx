import React, { useState } from "react";
import Image from "next/image";

interface ItemHistoryCardProps {
  title: string;
  status: string;
  id: string;
  description: string;
  last_seen_location: string;
  created_at: string;
  images_urls: string | string[];
}

const ItemHistoryCard: React.FC<ItemHistoryCardProps> = ({
  id,
  title,
  status,
  description,
  last_seen_location,
  created_at,
  images_urls,
}) => {
  const [currentImage, setCurrentImage] = useState(0);

  const formattedDate = new Date(created_at).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // useEffect(() => {
  //   // console.log("This is the images", last_seen_location);
  // });

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images_urls.length);
  };

  const handlePrev = () => {
    setCurrentImage(
      (prev) => (prev - 1 + images_urls.length) % images_urls.length
    );
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Carousel Section */}
      <div className="relative group">
        <Image
          src={images_urls[currentImage]}
          alt={`${name} - ${currentImage + 1}`}
          width={400}
          height={160}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
          {currentImage + 1}/{images_urls.length}
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
          status === "lost"
            ? "bg-red-500"
            : status === "found"
            ? "bg-green-500"
            : "bg-yellow-600"
        }`}
      >
        {status === "lost"
          ? "Lost Item"
          : status === "found"
          ? "Found Item"
          : "Claimed Item"}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <a href={`http://${process.env.id}:3000/item/${id}`}>
          <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-bold">Last Seen:</span> {last_seen_location}
            </p>
            <p>
              <span className="font-bold">Time:</span> {formattedDate}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ItemHistoryCard;
