import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ChatsScreen from "./src/screens/ChatScreen";
import AccountScreen from "./src/screens/AccountScreen";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: {
              height: 30, // Make the tab bar thinner (default is ~60)
              backgroundColor: "#FFFFFF",
              borderTopWidth: 0, // Remove top border if unnecessary
              paddingVertical: 5, // Reduce vertical padding
            },
            tabBarActiveTintColor: "#7ED321",
            tabBarInactiveTintColor: "#C4C4C4",
            tabBarIcon: ({ color, size }) => {
              // Define iconName with a fallback to avoid undefined
              let iconName: string = "";

              if (route.name === "Home") {
                iconName = "home-outline";
              } else if (route.name === "Search") {
                iconName = "search-outline";
              } else if (route.name === "Chats") {
                iconName = "chatbubble-outline";
              } else if (route.name === "Account") {
                iconName = "person-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {/* Add additional screens when ready */}
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Chats"
            component={ChatsScreen}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{ headerShown: false }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
