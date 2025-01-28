import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import RegisterScreenStyle from "../screenStyles/RegisterScreenStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define navigation prop type
type RootStackParamList = {
  Register: undefined;
  MainApp: undefined;
  Login: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Register"
>;
type RegisterScreenRouteProp = RouteProp<RootStackParamList, "Register">;

type Props = {
  navigation: RegisterScreenNavigationProp;
  route: RegisterScreenRouteProp;
};

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(""); // First Name
  const [lastName, setLastName] = useState(""); // Last Name
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone Number
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Registration
  const handleRegister = async () => {
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.3:1111/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user details in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        alert("Registration Successful!");
        navigation.replace("MainApp"); // Redirect to main app
      } else {
        alert(data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <View style={RegisterScreenStyle.container}>
      <Text style={RegisterScreenStyle.title}>Create Your</Text>
      <Text style={RegisterScreenStyle.subtitle}>Account</Text>

      {/* First Name */}
      <TextInput
        style={RegisterScreenStyle.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name */}
      <TextInput
        style={RegisterScreenStyle.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Phone Number */}
      <TextInput
        style={RegisterScreenStyle.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Email */}
      <TextInput
        style={RegisterScreenStyle.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password */}
      <View style={RegisterScreenStyle.passwordContainer}>
        <TextInput
          style={RegisterScreenStyle.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={RegisterScreenStyle.passwordContainer}>
        <TextInput
          style={RegisterScreenStyle.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={RegisterScreenStyle.registerButton}
        onPress={handleRegister}
      >
        <Text style={RegisterScreenStyle.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <Text style={RegisterScreenStyle.orText}>Or sign up with</Text>

      {/* Social Login Buttons */}
      <View style={RegisterScreenStyle.socialContainer}>
        <TouchableOpacity style={RegisterScreenStyle.socialButton}>
          <Image
            source={require("../../assets/google_logo.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text> Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={RegisterScreenStyle.socialButton}>
          <Image
            source={require("../../assets/facebook_logo.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text> Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <Text style={RegisterScreenStyle.loginText}>
        Already have an account?{" "}
        <Text
          style={RegisterScreenStyle.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

export default RegisterScreen;
