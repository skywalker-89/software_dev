"use client"; // ✅ Ensure this is a client component

import React, { useEffect } from "react";
import { useVisibleItems } from "../context/VisibleItemsContext";

const DebugVisibleItems = () => {
  const { visibleItems } = useVisibleItems();

  useEffect(() => {
    console.log("📌 Current visible items:", visibleItems);
  }, [visibleItems]); // ✅ Log every time `visibleItems` updates

  return (
    <div className="p-4 bg-gray-200">
      <h2 className="font-bold">Debug: Visible Items</h2>
      <pre>{JSON.stringify(visibleItems, null, 2)}</pre>
    </div>
  );
};

export default DebugVisibleItems;
