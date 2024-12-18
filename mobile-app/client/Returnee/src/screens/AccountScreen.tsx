import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AccountScreenStyle from "../screenStyles/AccountScreenStyle";

export default function AccountScreen() {
  return (
    <View style={AccountScreenStyle.container}>
      <View style={AccountScreenStyle.profileSection}>
        <Text style={AccountScreenStyle.name}>John Doe</Text>
        <Text style={AccountScreenStyle.email}>johndoe@example.com</Text>
      </View>
      <TouchableOpacity style={AccountScreenStyle.button}>
        <Text style={AccountScreenStyle.buttonText}>View My Claims</Text>
      </TouchableOpacity>
      <TouchableOpacity style={AccountScreenStyle.button}>
        <Text style={AccountScreenStyle.buttonText}>Posted Items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[AccountScreenStyle.button, AccountScreenStyle.logoutButton]}
      >
        <Text style={AccountScreenStyle.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
