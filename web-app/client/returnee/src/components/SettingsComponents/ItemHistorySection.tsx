"use client";
import React, { useState } from "react";
import ItemHistoryCard from "../../components/SettingsComponents/ItemHistoryCard";

interface Item {
  id: number;
  name: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[];
  claimStatus: "claimed" | "unclaimed";
}

const items: Item[] = [
  {
    id: 1,
    name: "Black Wallet",
    status: "lost",
    description: "A small leather wallet with a few cards inside.",
    lastSeen: "Central Park",
    time: "December 18, 2024, 3:30 PM",
    images: [
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
    ],
    claimStatus: "unclaimed",
  },
  {
    id: 2,
    name: "Car Keys",
    status: "found",
    description: "A set of keys with a red keychain.",
    lastSeen: "Library Parking Lot",
    time: "December 19, 2024, 11:00 AM",
    images: [
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
    ],
    claimStatus: "claimed",
  },
  {
    id: 3,
    name: "Blue iPhone",
    status: "found",
    description: "A blue iPhone 16.",
    lastSeen: "Coffee Shop",
    time: "December 20, 2024, 9:00 AM",
    images: [
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
    ],
    claimStatus: "unclaimed",
  },
];

const ItemHistorySection: React.FC = () => {
  const [filter, setFilter] = useState("all");

  const filteredItems = items.filter((item) =>
    filter === "all" ? true : item.status === filter
  );

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
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemHistoryCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ItemHistorySection;
