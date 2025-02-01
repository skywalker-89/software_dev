"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Define TypeScript Interface for Items
interface Item {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls?: string[];
}

// ✅ Custom Icons for Different Item Types
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapSection = () => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);

  // ✅ Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLoading(false);
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

  // ✅ Fetch lost & found items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [lostResponse, foundResponse] = await Promise.all([
          fetch("http://localhost:1111/items/lost-items"),
          fetch("http://localhost:1111/items/found-items"),
        ]);

        if (!lostResponse.ok || !foundResponse.ok) {
          throw new Error("Failed to fetch items");
        }

        const lostData: Item[] = await lostResponse.json();
        const foundData: Item[] = await foundResponse.json();

        setLostItems(lostData);
        setFoundItems(foundData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="relative w-full h-full md:h-full">
      {" "}
      {/* ✅ FIXED HEIGHT IN MOBILE, FULL HEIGHT DESKTOP */}
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
          className="w-full h-full" // ✅ Ensures it fits in mobile & desktop mode
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* ✅ Render Lost Items with Red Markers */}
          {lostItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={redIcon}
            >
              <Popup>
                <strong>Lost Item</strong>
                <p>{item.description}</p>
                {item.image_urls && item.image_urls.length > 0 && (
                  <img
                    src={item.image_urls[0]}
                    alt="Item"
                    className="w-32 h-32"
                  />
                )}
              </Popup>
            </Marker>
          ))}

          {/* ✅ Render Found Items with Green Markers */}
          {foundItems.map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={greenIcon}
            >
              <Popup>
                <strong>Found Item</strong>
                <p>{item.description}</p>
                {item.image_urls && item.image_urls.length > 0 && (
                  <img
                    src={item.image_urls[0]}
                    alt="Item"
                    className="w-32 h-32"
                  />
                )}
              </Popup>
            </Marker>
          ))}

          {/* ✅ Current location marker */}
          {currentPosition && (
            <Marker position={currentPosition} icon={blueIcon}>
              <Popup>Your Current Location</Popup>
            </Marker>
          )}
        </MapContainer>
      )}
    </div>
  );
};

export default MapSection;
