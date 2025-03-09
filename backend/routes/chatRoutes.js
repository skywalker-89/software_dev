const express = require("express");
const {
  sendMessage,
  getUnreadMessages,
  getChatHistory,
  createChatRoom,
  getUserChats,
  markMessagesAsRead,
  getUnreadMessagesCount,
} = require("../controllers/chatController");
const router = express.Router();
const upload = require("../config/multerConfig"); // ✅ Import multer config

router.get("/create-room", createChatRoom); // Add GET support
router.post("/create-room", createChatRoom);
router.post("/send", upload.array("images", 20), sendMessage); // ✅ Now it processes images
router.get("/unread/:userId", getUnreadMessages); // Get unread messages
router.get("/:chatRoomId/messages", getChatHistory); // Get chat history
router.get("/chats/:user_id", getUserChats); // Get all chats for a user
// ✅ Mark messages as read when the chat is opened
router.post("/mark-messages-read", markMessagesAsRead);

// ✅ Get unread message count for all chats of a user
router.get("/unread-count/:userId", getUnreadMessagesCount);

module.exports = router;
