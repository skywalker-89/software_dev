const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  chatKey: { type: String, unique: true, required: true }, // Ensure chatKey is unique
  chatItemID: { type: String, unique: true, sparse: true }, // ✅ Ensure uniqueness and allow null values

  chatTitle: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Store user IDs
  participantsNUMIDs: [{ type: String, required: true }],
  messages: [
    {
      sender: { type: String, required: true }, // Store sender ID as a string
      content: { type: String, default: "" }, // ✅ Text can be optional
      images: [{ type: String }], // ✅ Array to store multiple image URLs
      timestamp: { type: Date, default: Date.now }, // Time message was sent
      isRead: { type: Boolean, default: false }, // ✅ New field to track read status
    },
  ],
});

module.exports = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
