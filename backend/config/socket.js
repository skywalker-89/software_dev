const { Server } = require("socket.io");
const Chat = require("../models/Chat");

let onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Track online users
    socket.on("user-online", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online.`);
    });

    // **Join chat room**
    socket.on("join-room", (chatId, userId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}, user: ${userId}`);
    });

    // **Handle Sending Messages**
    socket.on("send-message", async ({ chatId, senderId, content, images }) => {
      try {
        if (
          !chatId ||
          !senderId ||
          (content === undefined && (!images || images.length === 0))
        ) {
          console.error("❌ Missing fields in send-message event");
          return;
        }

        console.log(
          "ChatId:",
          chatId,
          "SenderId:",
          senderId,
          "Content:",
          content,
          "Images:",
          images
        );

        // Create a message object
        const newMessage = {
          sender: senderId,
          content: content || "", // Ensure content is always a string, even if empty
          timestamp: new Date(),
          images: images || [], // Include images if any
        };

        // // Match either by _id or chatKey
        // const updatedChat = await Chat.findOneAndUpdate(
        //   {
        //     $or: [{ _id: chatId }, { chatKey: chatId }],
        //   },
        //   { $push: { messages: newMessage } },
        //   { new: true }
        // );

        // if (!updatedChat) {
        //   console.error("❌ Chat not found");
        //   return;
        // }

        // Emit message to all users in the chat room
        io.to(chatId).emit("receive-message", newMessage);

        console.log(`📩 Message saved and sent to room ${chatId}:`, newMessage);
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    });

    // Handle user reading messages in real-time
    socket.on("mark-as-read", async (chatId, userId) => {
      try {
        // Find the chat and update the status of unread messages
        const updatedChat = await Chat.findOneAndUpdate(
          {
            $or: [{ _id: chatId }, { chatKey: chatId }],
          },
          {
            $set: {
              "messages.$[msg].isRead": true, // Set all messages to isRead: true
            },
          },
          {
            new: true,
            arrayFilters: [{ "msg.isRead": false }], // Only update unread messages
          }
        );

        if (!updatedChat) {
          console.error("❌ Chat not found");
          return;
        }

        // Emit to all users in the chat room that messages have been read
        io.to(chatId).emit("messages-read", { userId });

        console.log(
          `📩 Messages marked as read in room ${chatId} by user ${userId}`
        );
      } catch (error) {
        console.error("❌ Error marking messages as read:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      console.log("❌ User disconnected:", socket.id);
    });
  });
  return io;
};

// Export helper to access io instance

module.exports = initializeSocket;
