import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20, // Added paddingBottom to avoid overlap with tab bar
    marginTop: 50,
  },
  searchBar: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#7ED321",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Adds slight elevation for better visibility
  },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8, // Increased vertical margin for spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7ED321",
    marginBottom: 5, // Increased spacing between item name and location
  },
  itemLocation: {
    fontSize: 14,
    color: "#555",
  },
});
