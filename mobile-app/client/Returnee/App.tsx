import React from "react";
import { SafeAreaView, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import Screens
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ChatsScreen from "./src/screens/ChatScreen";
import AccountScreen from "./src/screens/AccountScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Define the type for Stack Navigator
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Register: undefined;
};

// Create Navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          height: Platform.OS === "ios" ? 80 : 70, // Adjust height based on OS
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0, // Remove the border at the top
          paddingBottom: Platform.OS === "ios" ? 20 : 10, // Adjust padding for iOS
          paddingTop: 5, // Padding at the top for spacing
        },
        tabBarActiveTintColor: "#7ED321",
        tabBarInactiveTintColor: "#C4C4C4",
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Search") {
            iconName = "search-outline";
          } else if (route.name === "Chats") {
            iconName = "chatbubble-outline";
          } else if (route.name === "Account") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          paddingBottom: 5, // Spacing below the label
          fontSize: 12, // Adjust font size
        },
        headerShown: false, // Hide the header for each screen
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: "Search" }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ tabBarLabel: "Chats" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarLabel: "Account" }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for login screen
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen} // Add RegisterScreen to stack navigator
          options={{ headerShown: false }} // Hide header for register screen
        />
        <Stack.Screen
          name="MainApp"
          component={BottomTabNavigator}
          options={{ headerShown: false }} // Hide header for tab navigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
