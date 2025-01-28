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

module.exports = router;
