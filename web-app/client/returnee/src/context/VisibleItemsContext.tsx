"use client"; // ✅ Ensure this is here

import React, { createContext, useState, useContext } from "react";

interface Item {
  id: string;
  title: string;
  status: string;
  description: string;
  last_seen_location: string;
  found_location?: string;
  created_at: string;
  image_urls?: string | string[];
  latitude: number;
  longitude: number;
}

interface VisibleItemsContextType {
  visibleItems: Item[];
  setVisibleItems: (items: Item[]) => void;
}

// ✅ Initialize context with undefined and handle it inside `useVisibleItems`
const VisibleItemsContext = createContext<VisibleItemsContextType | undefined>(
  undefined
);

export const VisibleItemsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);

  return (
    <VisibleItemsContext.Provider value={{ visibleItems, setVisibleItems }}>
      {children}
    </VisibleItemsContext.Provider>
  );
};

// ✅ Ensure `useVisibleItems()` safely retrieves the context
export const useVisibleItems = (): VisibleItemsContextType => {
  const context = useContext(VisibleItemsContext);
  if (!context) {
    throw new Error("useVisibleItems must be used within VisibleItemsProvider");
  }
  return context;
};
