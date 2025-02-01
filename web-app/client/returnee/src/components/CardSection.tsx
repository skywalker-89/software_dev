"use client";

import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

interface Item {
  id: string;
  title: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[];
}

interface ApiResponseItem {
  id: number;
  title?: string;
  status: "lost" | "found" | "claimed"; // ✅ Include "claimed"
  description: string;
  last_seen_location?: string;
  found_location?: string;
  created_at: string;
  image_urls?: string | string[]; // ✅ Handle TEXT[] from PostgreSQL
}

interface CardSectionProps {
  category: "lost" | "found";
  searchQuery: string;
}

const CardSection: React.FC<CardSectionProps> = ({ category, searchQuery }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:1111/items/${category}-items`
        );
        if (!response.ok) throw new Error("Failed to fetch items");

        const data: ApiResponseItem[] = await response.json();

        const formattedData: Item[] = data.map((item) => {
          let parsedImages: string[] = [];

          if (Array.isArray(item.image_urls)) {
            parsedImages = item.image_urls
              .map((element) => {
                if (typeof element === "string") {
                  // Check for JSON objects or arrays
                  if (
                    (element.startsWith("{") && element.endsWith("}")) ||
                    (element.startsWith("[") && element.endsWith("]"))
                  ) {
                    try {
                      const fixedJsonString = element.replace(/'/g, '"');
                      const parsed = JSON.parse(fixedJsonString);

                      // Handle arrays (e.g., ["url1", "url2"])
                      if (Array.isArray(parsed)) {
                        return parsed.filter((url) => typeof url === "string");
                      }
                      // Handle objects (e.g., {"url": "https://..."})
                      else if (typeof parsed === "object") {
                        return Object.values(parsed).filter(
                          (url) => typeof url === "string"
                        );
                      }
                      // Handle strings (e.g., "https://...")
                      else if (typeof parsed === "string") {
                        return parsed;
                      }
                    } catch (error) {
                      // Fallback: Extract all URLs using regex
                      console.error("❌ Error fetching items:", error);
                      const urlMatches = element.match(/https?:\/\/[^\s"]+/g);
                      return urlMatches || null;
                    }
                  } else {
                    // Treat as a direct URL
                    return element;
                  }
                }
                return null;
              })
              .flat()
              .filter((url): url is string => !!url && url.startsWith("http"));
          }

          return {
            id: String(item.id),
            title: item.title || "Unknown Item",
            status: item.status === "claimed" ? "found" : item.status,
            description: item.description,
            lastSeen:
              item.last_seen_location ||
              item.found_location ||
              "Unknown Location",
            time: new Date(item.created_at).toLocaleString(),
            images: parsedImages,
          };
        });

        setItems(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <p className="text-center text-gray-500">Loading items...</p>
      ) : filteredItems.length > 0 ? (
        filteredItems.map((item) => <ItemCard key={item.id} {...item} />)
      ) : (
        <p className="text-center text-gray-500">No items found.</p>
      )}
    </div>
  );
};

export default CardSection;
