"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import MapSection without SSR
const MapSection = dynamic(() => import("../MapSection"), { ssr: false });

const MapSectionWrapper = () => {
  return (
    <div className="h-full w-full">
      {/* Dynamically loaded map */}
      <MapSection />
    </div>
  );
};

export default MapSectionWrapper;
