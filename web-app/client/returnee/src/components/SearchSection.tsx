import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchSectionProps {
  onCategoryChange: (category: "lost" | "found") => void;
  onSearchChange: (query: string) => void; // Notify parent about search input
  onDateChange: (date: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onCategoryChange,
  onSearchChange,
  onDateChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearchChange(value); // Pass the search query to the parent
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onDateChange === "function") {
      // ✅ Prevents "is not a function" error
      const value = event.target.value;
      setSelectedDate(value);
      onDateChange(value); // Notify parent
    } else {
      console.error("❌ onDateChange is not a function", onDateChange);
    }
  };

  return (
    <div className="p-4 border-b border-gray-300">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Describe the item here...."
            value={searchQuery}
            onChange={handleSearchChange} // Update search state
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-green-400"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap">
        {/* filter lost or found */}
        <button
          className="px-4 py-2 w-fit rounded bg-red-500 text-white flex-shrink-0"
          onClick={() => onCategoryChange("lost")}
        >
          Lost Items
        </button>
        <button
          className="px-4 py-2  w-fit rounded bg-green-500 text-white flex-shrink-0"
          onClick={() => onCategoryChange("found")}
        >
          Found Items
        </button>
        {/* this is the time filter  */}
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-fit p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-400 flex-shrink-0"
          aria-label="Select time"
          placeholder="Pick a time"
        />
      </div>
    </div>
  );
};

export default SearchSection;
