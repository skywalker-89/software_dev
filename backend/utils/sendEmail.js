const transporter = require("./emailConfig");

const sendEmail = async (
  recipientEmail,
  subject,
  text,
  html,
  attachments = []
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject,
      text,
      html, // HTML content
      attachments, // Attach images if provided
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; // Ensure errors are caught properly
  }
};

module.exports = sendEmail;
