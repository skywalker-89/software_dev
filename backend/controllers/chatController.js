const Message = require("../models/message");
const mongoose = require("mongoose"); // Import mongoose

// Send a new message
exports.sendMessage = async (req, res) => {
  let { senderId, receiverId, content } = req.body;

  try {
    // Convert senderId and receiverId to ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    senderId = new mongoose.Types.ObjectId(senderId);
    receiverId = new mongoose.Types.ObjectId(receiverId);

    const newMessage = await Message.create({ senderId, receiverId, content });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Fetch unread messages
exports.getUnreadMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({ receiverId: userId, isRead: false });
    await Message.updateMany(
      { receiverId: userId, isRead: false },
      { isRead: true }
    );
    res.json(messages);
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    res.status(500).json({ error: "Failed to fetch unread messages" });
  }
};

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  let { userId, receiverId } = req.params;

  try {
    // Convert userId and receiverId to ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid userId or receiverId" });
    }

    userId = new mongoose.Types.ObjectId(userId);
    receiverId = new mongoose.Types.ObjectId(receiverId);

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 }); // Sort messages in ascending order

    res.json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
