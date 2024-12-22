import React from "react";
import ItemCard from "./ItemCard";

interface Item {
  id: number;
  name: string;
  status: "lost" | "found";
  description: string;
  lastSeen: string;
  time: string;
  images: string[];
}

interface CardSectionProps {
  category: "lost" | "found";
  searchQuery: string; // Search query from the search bar
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
  },
  {
    id: 3,
    name: "Airpods",
    status: "found",
    description: "An airpods",
    lastSeen: "Library Parking Lot",
    time: "December 19, 2024, 11:00 AM",
    images: [
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
    ],
  },
  {
    id: 4,
    name: "Blue Iphone",
    status: "found",
    description: "A blue iphone 16",
    lastSeen: "Library Parking Lot",
    time: "December 19, 2024, 11:00 AM",
    images: [
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
      "https://st.depositphotos.com/2274151/4841/i/450/depositphotos_48410095-stock-photo-sample-blue-square-grungy-stamp.jpg",
    ],
  },
];

const CardSection: React.FC<CardSectionProps> = ({ category, searchQuery }) => {
  const filteredItems = items.filter(
    (item) =>
      item.status === category &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredItems.map((item) => (
        <ItemCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default CardSection;
