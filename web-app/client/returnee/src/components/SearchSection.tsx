import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchSectionProps {
  onCategoryChange: (category: "lost" | "found") => void;
  onSearchChange: (query: string) => void; // Notify parent about search input
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onCategoryChange,
  onSearchChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearchChange(value); // Pass the search query to the parent
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
            placeholder="Search for items..."
            value={searchQuery}
            onChange={handleSearchChange} // Update search state
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white"
          onClick={() => onCategoryChange("lost")}
        >
          Lost Items
        </button>
        <button
          className="px-4 py-2 rounded bg-green-500 text-white"
          onClick={() => onCategoryChange("found")}
        >
          Found Items
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
