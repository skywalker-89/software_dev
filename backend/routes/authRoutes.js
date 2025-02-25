const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout
router.post("/logout", authMiddleware.protect, authController.logout);

// Delete Account
router.delete("/del-acc", authMiddleware.protect, authController.deleteAccount);

// 🟢 Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🟢 Google Auth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleAuthCallback
);

// 🟦 Facebook Auth Route
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }) // Requesting email permission
);

// 🔹 GET User Data Route (NEW)
router.get("/me", authMiddleware.protect, authController.getUserData);

// 🟦 Facebook Auth Callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  authController.facebookAuthCallback
);

module.exports = router;
