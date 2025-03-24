"use client";
import React, { useState, useEffect } from "react";
import ItemHistoryCard from "../../components/SettingsComponents/ItemHistoryCard";

interface Item {
  id: string;
  title: string;
  user_id: number;
  status: string;
  description: string;
  last_seen_location: string;
  created_at: string;
  image_urls: string | string[]; // ✅ Handle TEXT[] from PostgreSQL
  claimStatus: "claimed" | "unclaimed";
}

const ItemHistorySection: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser?.id;
  console.log(currentUser.id);

  useEffect(() => {
    // Fetch the items from the API
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `http://${process.env.id}:1111/items/getall/all`
        );
        const data = await response.json();
        // console.log("These are the Data", data);

        // Filter items based on the ownerId matching the current user's ID
        const filteredItems = data.filter(
          (item: Item) => item.user_id === Number(currentUserId)
        );

        console.log("these are the items", filteredItems);
        setItems(filteredItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentUserId]);

  // useEffect(() => {
  //   items.forEach((item) => {
  //     console.log(item.image_urls);
  //   });
  // });

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

        // console.log("📌 Cleaned JSON string:", fixedString);

        // ✅ If it's a valid JSON array inside a string, parse it
        if (fixedString.startsWith("[") && fixedString.endsWith("]")) {
          const parsed = JSON.parse(fixedString);
          // console.log("✅ Parsed JSON array:", parsed);

          if (Array.isArray(parsed)) {
            const validUrls = parsed
              .map((url) => url.trim().replace(/['"]+/g, ""))
              .filter(
                (url) => typeof url === "string" && url.startsWith("http")
              );

            // console.log("✅ Extracted valid URLs:", validUrls);
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

  const filteredItems = items.filter((item) =>
    filter === "all" ? true : item.status === filter
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Items History</h1>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`p-2 rounded-md ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`p-2 rounded-md ${
            filter === "lost" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("lost")}
        >
          Lost
        </button>
        <button
          className={`p-2 rounded-md ${
            filter === "found" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("found")}
        >
          Found
        </button>
        <button
          className={`p-2 rounded-md ${
            filter === "claimed" ? "bg-yellow-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("claimed")}
        >
          Claimed
        </button>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6  gap-4">
        {filteredItems.map((item) => (
          <ItemHistoryCard
            key={item.id}
            {...item}
            images_urls={parseImageUrls(item.image_urls)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemHistorySection;
