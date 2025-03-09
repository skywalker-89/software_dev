const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const upload = require("../config/multerConfig"); // Multer for image uploads

// 📧 Route for sending a regular email (claim/return request)
router.post("/send-email", emailController.sendEmail);

// 📷 Route for sending email with images (return request)
router.post(
  "/send-email-pic",
  upload.array("images", 10),
  emailController.sendEmailPic
);

// 📧 Route for confirming time and place
router.get("/confirm-schedule", emailController.confirmSchedule);

// 📧 Route for confirming time and place
router.get("/re-schedule", emailController.ReSchedule);

module.exports = router;
