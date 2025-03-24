"use client";

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchSection from "../components/SearchSection";
import CardSection from "../components/CardSection";
import MapSectionWrapper from "../components/wrapper/MapSectionWrapper";
// import DebugVisibleItems from "../components/DebugVisibleItems";

export default function HomePage() {
  const [category, setCategory] = useState<"lost" | "found">("found");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapReady, setMapReady] = useState(false); // ✅ Track when map is ready
  const [selectedDate, setSelectedDate] = useState("");

  // const handleSearchChange = (query: string) => {
  //   setSearchQuery(query);
  // };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Layout: Show Map on Top */}
        <div className="block md:hidden w-full h-96">
          <MapSectionWrapper setMapReady={setMapReady} />
        </div>

        <div className="flex flex-1 md:flex-row">
          {/* Left Section: Search + Results */}
          <div className="w-full md:w-3/6 flex flex-col border-r border-gray-300">
            {/* Search Section */}
            <SearchSection
              onCategoryChange={setCategory}
              onSearchChange={setSearchQuery}
              onDateChange={setSelectedDate}
            />

            {/* Results Section */}
            <div className="flex-1 overflow-auto">
              <CardSection
                mapReady={mapReady}
                searchQuery={searchQuery}
                category={category}
                selectedDate={selectedDate}
              />
            </div>
          </div>
          {/* Right Section: Map for Desktop */}
          <div className="hidden md:block md:w-3/6 h-full">
            <MapSectionWrapper setMapReady={setMapReady} />
          </div>
          {/* <div>
            <DebugVisibleItems />
          </div> */}
        </div>
      </div>
    </div>
  );
}
