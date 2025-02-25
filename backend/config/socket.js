const { Server } = require("socket.io");
const Message = require("../models/Message"); // Import Message model

let onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // When a user goes online, store their socket ID
    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // Handle sending messages
    socket.on("send-message", async ({ senderId, receiverId, content }) => {
      try {
        const newMessage = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // If recipient is online, send message instantly
        if (onlineUsers.has(receiverId)) {
          io.to(onlineUsers.get(receiverId)).emit(
            "receive-message",
            newMessage
          );
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle disconnections
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
