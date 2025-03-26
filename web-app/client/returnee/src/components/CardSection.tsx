"use client";

import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { useVisibleItems } from "../context/VisibleItemsContext";

interface Item {
  id: string;
  title: string;
  status: string;
  description: string;
  lastSeen: string;
  time: string;
  images: string | string[]; // ✅ Handle TEXT[] from PostgreSQL
  latitude: number;
  longitude: number;
}

interface CardSectionProps {
  searchQuery: string;
  mapReady: boolean; // ✅ Ensure map is ready before rendering
  selectedDate: string;
  category: string;
}

const CardSection: React.FC<CardSectionProps> = ({
  searchQuery,
  mapReady,
  category,
  selectedDate,
}) => {
  const { visibleItems } = useVisibleItems(); // ✅ Get filtered items from context
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  // console.log("📌 visibleItems in CardSection:", visibleItems);

  useEffect(() => {
    // Reset page when category changes
    setCurrentPage(1); // Reset to the first page
  }, [category]);

  const parseImageUrls = (imageUrls?: string | string[]): string[] => {
    // console.log("📌 Raw imageUrls from API:", imageUrls); // ✅ Log raw image data

    if (!imageUrls) return [];

    // ✅ If it's already an array of valid URLs, return it
    if (
      Array.isArray(imageUrls) &&
      imageUrls.every(
        (url) => typeof url === "string" && url.startsWith("http")
      )
    ) {
      // console.log("✅ Already a clean array:", imageUrls);
      return imageUrls;
    }

    // ✅ If it's an array with a single malformed JSON string
    if (
      Array.isArray(imageUrls) &&
      imageUrls.length === 1 &&
      typeof imageUrls[0] === "string"
    ) {
      try {
        console.warn(
          "⚠️ Detected JSON-like string inside array, attempting to fix:",
          imageUrls[0]
        );

        // ✅ Try to parse the single string inside the array
        const fixedString = imageUrls[0]
          .replace(/^{|}$/g, "") // ✅ Remove surrounding `{}` if present
          .replace(/\\"/g, '"') // ✅ Fix escaped quotes `\"` to `"`
          .trim();

        console.log("📌 Cleaned JSON string:", fixedString);

        // ✅ If it's a valid JSON array inside a string, parse it
        if (fixedString.startsWith("[") && fixedString.endsWith("]")) {
          const parsed = JSON.parse(fixedString);
          console.log("✅ Parsed JSON array:", parsed);

          if (Array.isArray(parsed)) {
            const validUrls = parsed
              .map((url) => url.trim().replace(/['"]+/g, ""))
              .filter(
                (url) => typeof url === "string" && url.startsWith("http")
              );

            console.log("✅ Extracted valid URLs:", validUrls);
            return validUrls;
          }
        }

        // ✅ If it's comma-separated URLs inside a string, split them manually
        const urlList = fixedString
          .split(",")
          .map((url) => url.trim().replace(/['"]+/g, ""));
        console.log("✅ Extracted comma-separated URLs:", urlList);
        return urlList.filter((url) => url.startsWith("http"));
      } catch (error) {
        console.error("❌ Failed to parse JSON-like string:", error);
      }
    }

    // ✅ If it's a single malformed JSON string, fix it
    if (typeof imageUrls === "string") {
      try {
        const cleanedString = imageUrls.trim();

        // ✅ Fix {URL, URL} format
        if (cleanedString.startsWith("{") && cleanedString.endsWith("}")) {
          console.warn(
            "⚠️ Malformed JSON detected, attempting to fix:",
            imageUrls
          );
          const fixedJson = cleanedString.replace(/^{|}$/g, "").split(",");
          return fixedJson
            .map((url) => url.trim().replace(/['"]+/g, ""))
            .filter((url) => url.startsWith("http"));
        }

        // ✅ Parse valid JSON strings
        const parsed = JSON.parse(cleanedString);
        if (Array.isArray(parsed)) {
          const validUrls = parsed.filter(
            (url) => typeof url === "string" && url.startsWith("http")
          );
          console.log("✅ Filtered valid URLs:", validUrls);
          return validUrls;
        }
      } catch (error) {
        console.log(error);
        console.warn(
          "⚠️ Failed to parse `image_urls`, using regex fallback:",
          imageUrls
        );
        const regexUrls = imageUrls.match(/https?:\/\/[^\s",]+/g) || [];
        console.log("✅ Extracted via regex:", regexUrls);
        return regexUrls;
      }
    }

    return [];
  };

  // ✅ Ensure items are updated when visibleItems changes
  useEffect(() => {
    console.log("This is the mapReady", mapReady);
    console.log("This is the category", category);
    console.log("This is the date", selectedDate);
    if (mapReady && visibleItems.length > 0) {
      setLoading(false);

      // ✅ Format items properly
      const formattedItems: Item[] = visibleItems.map((item) => ({
        id: item.id,
        title: item.title || "Unknown Item",
        status: item.status,
        description: item.description,
        lastSeen: item.last_seen_location,
        time: new Date(item.created_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }), // ✅ Format time to DD/MM/YEAR, Time HH:MM
        images: parseImageUrls(item.image_urls), // ✅ Use parseImageUrls here
        latitude: item.latitude,
        longitude: item.longitude,
      }));

      setItems(formattedItems);
    }
  }, [visibleItems, mapReady]);

  const filteredItems = items.filter((item) => {
    const itemDate = new Date(item.time); // Convert item timestamp to Date object
    const selectedDateTime = selectedDate ? new Date(selectedDate) : null; // Convert selected date

    return (
      item.status.toLowerCase() === category.toLowerCase() && // ✅ Match selected category
      // item.status.toLowerCase() !== "claimed" && // ✅ Exclude claimed items
      (!selectedDateTime || itemDate >= selectedDateTime) && // ✅ Filter by time (after selectedDate)
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto h-[calc(100vh-280px)]">
        {loading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => <ItemCard key={item.id} {...item} />)
        ) : (
          <p className="text-center text-gray-500">No items found.</p>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 mr-3 text-white rounded-lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`px-4 py-2 ${
              index + 1 === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-full mx-1`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-4 py-2 bg-blue-500 ml-3 text-white rounded-lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default CardSection;
