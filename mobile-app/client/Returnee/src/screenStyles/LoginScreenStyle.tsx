import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginTop: 60,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7ED321",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#7ED321",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#C0F76E",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#555",
    marginBottom: 15,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  registerText: {
    textAlign: "center",
    color: "#555",
  },
  registerLink: {
    color: "#7ED321",
    fontWeight: "bold",
  },
});
