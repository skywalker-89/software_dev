const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // ✅ Store senderId as a string
  receiverId: { type: String, required: true }, // ✅ Store receiverId as a string
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});
// Check if the model already exists before defining it
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

module.exports = Message;
