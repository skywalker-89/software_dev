"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import ItemMapSection from "../../../components/ItemMapsection";

interface Item {
  id: string;
  title: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[];
  latitude: number;
  longitude: number;
}

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🔍 Image zoom modal

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:1111/items/${id}`);
        if (!response.ok) throw new Error("Failed to fetch item");
        const data = await response.json();

        let parsedImages: string[] = [];

        if (typeof data.image_urls === "string") {
          try {
            const fixedJsonString = data.image_urls.replace(/'/g, '"');
            const parsed = JSON.parse(fixedJsonString);
            parsedImages = Array.isArray(parsed)
              ? parsed.filter((url) => typeof url === "string")
              : Object.values(parsed).filter((url) => typeof url === "string");
          } catch (error) {
            console.error("Error parsing image_urls:", error);
          }
        } else if (Array.isArray(data.image_urls)) {
          parsedImages = data.image_urls;
        }

        parsedImages = parsedImages.filter((url) => url.startsWith("http"));

        setItem({
          id: String(data.id),
          title: data.title || "Unknown Item",
          status: data.status === "claimed" ? "found" : data.status,
          description: data.description,
          lastSeen:
            data.last_seen_location ||
            data.found_location ||
            "Unknown Location",
          time: new Date(data.created_at).toLocaleString(),
          latitude: data.latitude,
          longitude: data.longitude,
          images: parsedImages,
        });
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <p className="text-center text-gray-500">Loading...</p>;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + item.images.length) % item.images.length
    );
  };

  // 🟢 Function for Request Claim (for Lost Items)
  const requestClaim = () => {
    console.log("Request Claim function triggered");
  };

  // 🟢 Function for Return Item (for Found Items)
  const returnItem = () => {
    console.log("Return Item function triggered");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Left Side: Image & Info */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

          {/* Image Carousel (Clickable for Zoom) */}
          <div
            className="relative w-full h-64 md:h-[600px] md:w-[600px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open zoomed view on click
          >
            {item.images.length > 0 ? (
              <>
                <Image
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  width={500}
                  height={500}
                  className="rounded-lg w-full h-full object-contain bg-gray-100"
                />
                {/* Left Navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-80 hover:opacity-100 transition"
                >
                  ❮
                </button>
                {/* Right Navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border rounded-full w-10 h-10 flex items-center justify-center shadow-md opacity-80 hover:opacity-100 transition"
                >
                  ❯
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-md">
                  {currentImageIndex + 1} / {item.images.length}
                </div>
              </>
            ) : (
              <span className="text-gray-500">No Image Available</span>
            )}
          </div>

          {/* Last Seen & Time */}
          <div className="mt-4 text-gray-600 text-left">
            <p>
              <strong>Last Seen:</strong> {item.lastSeen}
            </p>
            <p>
              <strong>Time:</strong> {item.time}
            </p>
          </div>
        </div>

        {/* Right Side: Description & Map */}
        <div className="w-full lg:w-2/5 flex flex-col gap-4">
          {/* Description */}
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg min-h-[300px] flex items-start">
            <div>
              <h2 className="font-bold text-xl mb-3">Description</h2>
              <p className="text-gray-700 text-lg">{item.description}</p>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">Location on Map</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <ItemMapSection
                latitude={item.latitude}
                longitude={item.longitude}
                description={item.description}
                imageUrl={item.images?.[0] || ""}
                status={item.status} // ✅ Pass the status dynamically
              />
            </div>
          </div>

          {/* 🟢 Conditional Button (Request Claim or Return Item) */}
          {item.status === "lost" ? (
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
              onClick={returnItem} // 🔥 Calls requestClaim function
            >
              Return Item
            </button>
          ) : (
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition"
              onClick={requestClaim} // 🔥 Calls returnItem function
            >
              Request Claim
            </button>
          )}
        </div>
      </div>

      {/* 🔍 Fullscreen Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              ✕
            </button>

            <Image
              src={item.images[currentImageIndex]}
              alt={item.title}
              width={800}
              height={800}
              className="rounded-lg w-full h-auto object-contain"
            />

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ❮
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              ❯
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
