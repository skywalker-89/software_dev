"use client";

import React, { useEffect, useRef, useState } from "react";
import { Popup } from "react-leaflet";
// import { useRouter } from "next/router"; // Using Next.js routing

interface Item {
  id: string;
  title: string;
  image_urls?: string | string[];
}

const CustomPopup = ({ item }: { item: Item }) => {
  const [imageWidth, setImageWidth] = useState(0);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  //   const router = useRouter();

  const imgRef = useRef<HTMLImageElement>(null);

  // Effect to set client-side rendering flag
  useEffect(() => {
    setIsClient(true); // Set to true once the component is mounted on the client
  }, []);

  useEffect(() => {
    if (imgRef.current) {
      setImageWidth(imgRef.current.naturalWidth); // Get the natural width of the image
    }
  }, [item.image_urls]);

  //   const handlePopupClick = () => {
  //     if (isClient) {
  //       router.push(`/item/${item.id}`); // Navigate to the item page
  //     }
  //   };

  if (!isClient) {
    return null; // Don't render anything until the component is mounted on the client
  }

  return (
    <Popup
      className="relative w-64 h-72 overflow-hidden"
      maxWidth={imageWidth ? imageWidth : 400}
    >
      <div className="cursor-pointer">
        <strong>{item.title}</strong>
        <p> </p>
        {item.image_urls && item.image_urls.length > 0 && (
          <div className="flex justify-center items-center w-full h-full">
            <a href={`http://${process.env.id}:3000/item/${item.id}`}>
              <img
                ref={imgRef}
                src={item.image_urls[0]}
                alt="Item"
                className="h-auto max-h-48 object-contain border-2 border-gray-400 rounded-lg"
              />
            </a>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default CustomPopup;
