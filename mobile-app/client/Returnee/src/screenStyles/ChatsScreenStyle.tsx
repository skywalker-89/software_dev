import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
    marginTop: 50,
  },
  chatCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7ED321",
  },
  lastMessage: {
    fontSize: 14,
    color: "#555",
  },
  time: {
    fontSize: 12,
    color: "#AAA",
  },
});
