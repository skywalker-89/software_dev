import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AccountScreenStyle from "../screenStyles/AccountScreenStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user"); // Clear user data
    await AsyncStorage.removeItem("token");
    navigation.replace("Login"); // Redirect to login screen
  };

  return (
    <View style={AccountScreenStyle.container}>
      {/* Display User Information */}
      <View style={AccountScreenStyle.profileSection}>
        <Text style={AccountScreenStyle.name}>
          {user ? `${user.first_name} ${user.last_name}` : "Guest"}
        </Text>
        <Text style={AccountScreenStyle.email}>
          {user ? user.email : "guest@example.com"}
        </Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={AccountScreenStyle.button}>
        <Text style={AccountScreenStyle.buttonText}>View My Claims</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AccountScreenStyle.button}>
        <Text style={AccountScreenStyle.buttonText}>Posted Items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[AccountScreenStyle.button, AccountScreenStyle.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={AccountScreenStyle.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
