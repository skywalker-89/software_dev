"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Custom Red Marker Icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 🔹 Component for selecting a location on the map
const LocationMarker = ({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={redIcon} /> : null;
};

// ✅ Interface for passing selected location to parent component
interface SelectableMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const SelectableMap: React.FC<SelectableMapProps> = ({ onLocationSelect }) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // ✅ Fetch user’s current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLoading(false); // ✅ Hide loading when location is fetched
        },
        (error) => {
          console.error("Error fetching location: ", error);
          setCurrentPosition([13.729252961011817, 100.775821879559]); // Default fallback
          setLoading(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setCurrentPosition([13.729252961011817, 100.775821879559]);
      setLoading(false);
    }
  }, []);

  return (
    <div className="relative h-64 w-full">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-PrimaryColor border-solid"></div>
          <p className="ml-4 text-PrimaryColor font-medium text-lg">
            Loading map...
          </p>
        </div>
      ) : (
        <MapContainer
          center={currentPosition || [13.729252961011817, 100.775821879559]}
          zoom={13}
          className="rounded-lg h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker onSelect={onLocationSelect} />
        </MapContainer>
      )}
    </div>
  );
};

export default SelectableMap;
