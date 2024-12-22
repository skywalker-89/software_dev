"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import CardSection from "../components/CardSection";
import MapSectionWrapper from "../components/wrapper/MapSectionWrapper";

export default function HomePage() {
  const [category, setCategory] = useState<"lost" | "found">("found");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (newCategory: "lost" | "found") => {
    setCategory(newCategory);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Layout: Show Map on Top */}
        <div className="block md:hidden w-full h-96">
          <MapSectionWrapper />
        </div>

        <div className="flex flex-1 md:flex-row">
          {/* Left Section: Search + Results */}
          <div className="w-full md:w-2/5 flex flex-col border-r border-gray-300">
            {/* Search Section */}
            <SearchSection
              onCategoryChange={handleCategoryChange}
              onSearchChange={handleSearchChange}
            />

            {/* Results Section */}
            <div className="flex-1 overflow-auto">
              <CardSection category={category} searchQuery={searchQuery} />
            </div>
          </div>

          {/* Right Section: Map for Desktop */}
          <div className="hidden md:block md:w-3/5 h-full">
            <MapSectionWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}
