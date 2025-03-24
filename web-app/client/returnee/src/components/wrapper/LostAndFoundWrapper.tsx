import React, { useState } from "react";
import SearchSection from "../SearchSection";
import CardSection from "../CardSection";

const LostAndFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<"lost" | "found">("lost"); // Default to lost items
  const [selectedDate, setSelectedDate] = useState("");

  console.log(
    "🔍 onDateChange in LostAndFoundPage (setSelectedDate):",
    setSelectedDate
  );

  return (
    <div>
      {/* Search Section */}
      <SearchSection
        onSearchChange={setSearchQuery}
        onCategoryChange={setCategory}
        onDateChange={setSelectedDate}
      />

      {/* Card Section (Displays Filtered Items) */}
      <CardSection
        searchQuery={searchQuery}
        category={category}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default LostAndFoundPage;
