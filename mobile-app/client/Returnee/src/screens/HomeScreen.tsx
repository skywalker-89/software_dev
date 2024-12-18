import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import HomeScreenStyle from "../screenStyles/HomeScreenStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";

// Define a type for the location state
interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Dummy Data: User's Lost Items
const items = [
  {
    id: "1",
    name: "Keys",
    location: "84 Kamarajar St",
    time: "12 min ago",
    status: "lost",
    latitude: 13.73975329116318,
    longitude: 100.54744847850435,
  },
  {
    id: "2",
    name: "Wallet",
    location: "Market St",
    time: "20 min ago",
    status: "lost",
    latitude: 13.738395844442293,
    longitude: 100.54638364152594,
  },
];

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(
    null
  );

  useEffect(() => {
    (async () => {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={HomeScreenStyle.container}>
      {/* Map */}
      <MapView
        style={HomeScreenStyle.map}
        region={
          currentLocation || {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        showsUserLocation={true} // Show user's location as a blue dot
      >
        {/* Markers */}
        {items.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            title={item.name}
            description={item.location}
            pinColor={item.status === "lost" ? "#FF5C5C" : "#7ED321"} // Red for lost, Green for found
          />
        ))}
      </MapView>

      {/* List Overlay */}
      <View style={HomeScreenStyle.listOverlay}>
        {/* Buttons */}
        <View style={HomeScreenStyle.buttonContainer}>
          <TouchableOpacity style={HomeScreenStyle.actionButton}>
            <Ionicons name="add" size={20} color="#000" />
            <Text style={HomeScreenStyle.buttonText}>Report a lost item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={HomeScreenStyle.actionButton}>
            <Ionicons name="add" size={20} color="#000" />
            <Text style={HomeScreenStyle.buttonText}>Found an item</Text>
          </TouchableOpacity>
        </View>

        {/* Lost Items List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={HomeScreenStyle.card}>
              <Text style={HomeScreenStyle.itemTitle}>{item.name}</Text>
              <Text style={HomeScreenStyle.itemDescription}>
                {item.location} - {item.time}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
