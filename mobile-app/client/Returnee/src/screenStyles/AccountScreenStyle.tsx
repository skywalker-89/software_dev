import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7ED321",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    backgroundColor: "#7ED321",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF5C5C",
  },
});
