const express = require("express");
const {
  sendMessage,
  getUnreadMessages,
  getChatHistory,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/send", sendMessage); // Send a message
router.get("/unread/:userId", getUnreadMessages); // Get unread messages
router.get("/conversations/:userId/:receiverId", getChatHistory); // Get chat history

module.exports = router;
