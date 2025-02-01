"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix Leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Custom icons for lost and found items
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -40],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -40],
});

// ✅ TypeScript interface for props
interface ItemMapSectionProps {
  latitude: number;
  longitude: number;
  description: string;
  imageUrl?: string;
  status: "lost" | "found"; // ✅ New status prop
}

const ItemMapSection: React.FC<ItemMapSectionProps> = ({
  latitude,
  longitude,
  description,
  imageUrl,
  status,
}) => {
  // ✅ Select the marker color based on status
  const itemIcon = status === "lost" ? redIcon : greenIcon;

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14} // ✅ Focus on the item's location
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* ✅ Mark the item's location */}
        <Marker position={[latitude, longitude]} icon={itemIcon}>
          <Popup>
            <strong>
              {status === "lost" ? "Lost Item Location" : "Found Item Location"}
            </strong>
            <p>{description}</p>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Item"
                className="w-32 h-32 rounded-md mt-2"
              />
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ItemMapSection;
