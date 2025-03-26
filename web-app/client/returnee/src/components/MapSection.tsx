"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useVisibleItems } from "../context/VisibleItemsContext";
import CustomPopup from "./decorations/CustomPopup";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Define TypeScript Interface for Items
interface Item {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  image_urls?: string | string[];
  status: string;
  last_seen_location: string;
  found_location?: string;
  created_at: string;
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

// Component to Track Map Bounds
const MapEventHandler = ({
  setMapBounds,
}: {
  setMapBounds: (bounds: L.LatLngBounds) => void;
}) => {
  useMapEvents({
    moveend: (event) => {
      setMapBounds(event.target.getBounds());
    },
  });
  return null;
};

const MapSection: React.FC<{ setMapReady: (ready: boolean) => void }> = ({
  setMapReady,
}) => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const { setVisibleItems } = useVisibleItems(); // ✅ Ensure it's used correctly
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setLocalMapReady] = useState(false); // ✅ Define mapReady

  useEffect(() => {
    if (mapRef.current) {
      setMapBounds(mapRef.current.getBounds());
      setLocalMapReady(true);
      setMapReady(true); // ✅ Set map as ready
    }
  }, [mapRef.current]);

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

  // Fetch lost & found items
  useEffect(() => {
    console.log("This is the ip address", process.env.id);
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `http://${process.env.id}:1111/items/getall/all`
        );
        if (!response.ok) throw new Error("Failed to fetch items");

        const data: Item[] = await response.json();
        setItems(data);

        // Wait for map to be ready before setting visible items
        if (mapRef.current) {
          const initialBounds = mapRef.current.getBounds();
          const initialVisibleItems = data.filter((item) =>
            initialBounds.contains(L.latLng(item.latitude, item.longitude))
          );
          setVisibleItems(initialVisibleItems);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [mapReady]);
  // ✅ Update visible items when the map moves or zooms
  useEffect(() => {
    if (mapBounds && items.length > 0) {
      const visibleItems = items.filter((item) =>
        mapBounds.contains(L.latLng(item.latitude, item.longitude))
      );

      console.log("These are the current items", visibleItems);

      setVisibleItems(visibleItems); // ✅ This will now work properly
    }
  }, [mapBounds, items, setVisibleItems]); // ✅ Removed `setVisibleItems` from dependencies

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
          whenReady={() => {
            if (mapRef.current) {
              setMapBounds(mapRef.current.getBounds());
              setMapReady(true); // ✅ Mark map as loaded
            }
          }}
          ref={mapRef} // ✅ Correctly store map reference
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEventHandler setMapBounds={setMapBounds} />

          {/* Render Items as Markers */}
          {items
            .filter((item) => item.status !== "none")
            .map((item) => (
              <Marker
                key={item.id}
                position={[item.latitude, item.longitude]}
                icon={item.status == "lost" ? redIcon : greenIcon}
              >
                {/* Use CustomPopup component */}
                <CustomPopup item={item} />
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
