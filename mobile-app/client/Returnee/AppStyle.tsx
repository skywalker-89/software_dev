import { StyleSheet } from "react-native";

export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // SafeAreaView
  safeAreaView: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Set a background color for the whole app
  },

  // Tab Bar Styles
  tabBarStyle: {
    height: 50, // Adjust the height to make it thinner
    backgroundColor: "#FFFFFF", // White background
    borderTopWidth: 0, // Remove the top border
    elevation: 3, // Add a shadow
    paddingVertical: 5, // Reduce padding to make it compact
  },

  tabBarLabelStyle: {
    fontSize: 12, // Smaller font size for labels
    fontWeight: "500",
  },

  tabBarIconStyle: {
    marginBottom: 2, // Adjust icon spacing
  },
});
