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

// Custom Red Icon for locations of lkost item
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
});

// Custom Blue Icon for current location
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom Green Icon for current location
// const greenIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

const locations = [
  {
    id: 1,
    name: "Lost hand bang",
    lat: 13.7492,
    lng: 100.7758,
  },
  {
    id: 2,
    name: "A pair eye glasses",
    lat: 13.7306,
    lng: 100.7823,
  },
];

const MapSection = () => {
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  // Fetch the current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error fetching location: ", error);
          setCurrentPosition([13.729252961011817, 100.775821879559]); // Default fallback position
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setCurrentPosition([13.729252961011817, 100.775821879559]); // Default fallback position
    }
  }, []);

  return (
    <>
      {currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={13}
          // style={{ height: "1080px", width: "100%" }}
          className="rounded-lg h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Render markers with red icon */}
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={redIcon} // Use red icon for locations
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}

          {/* Current location marker with green icon */}
          <Marker position={currentPosition} icon={blueIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-PrimaryColor border-solid"></div>
          <p className="ml-4 text-PrimaryColor font-medium text-lg">
            Loading map...
          </p>
        </div>
      )}
    </>
  );
};

export default MapSection;
