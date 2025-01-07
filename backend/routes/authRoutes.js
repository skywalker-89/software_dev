const express = require("express");
const router = express.Router();
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

module.exports = router;
