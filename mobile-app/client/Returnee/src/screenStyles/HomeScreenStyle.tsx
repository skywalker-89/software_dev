import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(245, 245, 245, 0.0001)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6FFB3",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 4,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7ED321",
  },
  itemDescription: {
    fontSize: 14,
    color: "#555",
  },
});
