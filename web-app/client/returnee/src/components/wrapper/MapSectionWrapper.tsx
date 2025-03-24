"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import MapSection without SSR
const MapSection = dynamic(() => import("../MapSection"), { ssr: false });

export interface Item {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls?: string[];
  status: string;
}

interface MapSectionWrapperProps {
  setMapReady: (ready: boolean) => void; // ✅ Accept setMapReady prop
}

const MapSectionWrapper: React.FC<MapSectionWrapperProps> = ({
  setMapReady,
}) => {
  // const [visibleItems, setVisibleItems] = useState<Item[]>([]); // ✅ Explicitly typed

  return (
    <div className="h-full w-full">
      {/* Pass setVisibleItems correctly */}
      <MapSection setMapReady={setMapReady} />
    </div>
  );
};

export default MapSectionWrapper;
