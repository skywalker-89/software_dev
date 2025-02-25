const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// 🔹 Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

module.exports = transporter;
