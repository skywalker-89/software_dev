import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import LoginScreenStyle from "../screenStyles/LoginScreenStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For storing user data locally
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

// Define navigation prop type
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, "Login">;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState(""); // Accept both email and phone number
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Login
  const handleLogin = async () => {
    // Validate inputs
    if (!emailOrPhone || !password) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      // Make API call
      const response = await fetch("http://localhost:1111/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrPhone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data and token in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);

        Alert.alert("Success", "Login Successful!");
        navigation.replace("MainApp"); // Redirect to the main app
      } else {
        Alert.alert("Error", data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };

  return (
    <View style={LoginScreenStyle.container}>
      <Text style={LoginScreenStyle.title}>Sign in to your</Text>
      <Text style={LoginScreenStyle.subtitle}>Account</Text>

      {/* Email or Phone */}
      <TextInput
        style={LoginScreenStyle.input}
        placeholder="Email or Phone Number"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
      />

      {/* Password */}
      <View style={LoginScreenStyle.passwordContainer}>
        <TextInput
          style={LoginScreenStyle.passwordInput}
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

      <TouchableOpacity>
        <Text style={LoginScreenStyle.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={LoginScreenStyle.loginButton}
        onPress={handleLogin}
      >
        <Text style={LoginScreenStyle.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={LoginScreenStyle.orText}>Or login with</Text>

      {/* Social Login Buttons */}
      <View style={LoginScreenStyle.socialContainer}>
        <TouchableOpacity style={LoginScreenStyle.socialButton}>
          <Image
            source={require("../../assets/google_logo.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text> Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={LoginScreenStyle.socialButton}>
          <Image
            source={require("../../assets/facebook_logo.png")}
            style={{ width: 20, height: 20, marginRight: 5 }}
          />
          <Text> Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <Text style={LoginScreenStyle.registerText}>
        Don’t have an account?{" "}
        <Text
          style={LoginScreenStyle.registerLink}
          onPress={() => navigation.navigate("Register")}
        >
          Register
        </Text>
      </Text>
    </View>
  );
};

export default LoginScreen;
