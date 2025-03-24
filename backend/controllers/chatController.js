const Message = require("../models/message");
const Chat = require("../models/Chat");
const mongoose = require("mongoose"); // Import mongoose
const User = require("../models/user"); // ✅ Import User model
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const dotenv = require("dotenv");

// Configure Multer for file handling
const storage = multer.memoryStorage(); // Store in memory before uploading to Cloudinary
const upload = multer({ storage: storage });

// ✅ Allow multiple file uploads
exports.uploadImages = upload.array("images", 5); // Limit to 5 images per message

exports.sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;

  console.log("This is the things i got", chatId, senderId, content);

  try {
    if (!chatId || !senderId) {
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    let imageUrls = []; // ✅ Store uploaded image URLs
    // ✅ Upload multiple images to Cloudinary if files are attached
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "chat_images" }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            })
            .end(file.buffer);
        });

        imageUrls.push(result); // ✅ Store each uploaded image URL
      }
    }

    // ✅ Create a new message object
    const newMessage = {
      sender: senderId,
      content: content || "", // ✅ Allow empty content if only images are sent
      timestamp: new Date(),
      isRead: false,
      images: imageUrls, // ✅ Store multiple image URLs
    };

    // Match either by _id or chatKey
    const updatedChat = await Chat.findOneAndUpdate(
      {
        $or: [{ _id: chatId }, { chatKey: chatId }],
      },
      { $push: { messages: newMessage } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ error: "❌ Chat not found" });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "❌ Failed to send message" });
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
  const { chatRoomId } = req.params;
  console.log("Fetching chat history for:", chatRoomId);

  try {
    if (!mongoose.Types.ObjectId.isValid(chatRoomId)) {
      return res.status(400).json({ error: "Invalid chatRoomId format" });
    }

    const chatRoom = await Chat.findById(chatRoomId).populate({
      path: "messages.sender",
      model: "User", // ✅ Ensure Mongoose uses the correct model
      select: "name email",
    });

    if (!chatRoom) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    res.status(200).json(chatRoom.messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.createChatRoom = async (req, res) => {
  console.log("Received request:", req.method === "GET" ? req.query : req.body);

  let { user_id, poster_id, id, title } =
    req.method === "GET" ? req.query : req.body;

  const userId = user_id;
  const posterId = poster_id;

  if (!user_id || !poster_id) {
    return res.status(400).json({ error: "Missing user_id or poster_id" });
  }

  // Convert numeric IDs to ObjectId (Create a new ObjectId)
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    console.log(
      `⚠️ User ID (${user_id}) is not a valid ObjectId. Generating a new one.`
    );
    user_id = new mongoose.Types.ObjectId();
  } else {
    user_id = new mongoose.Types.ObjectId(user_id);
  }

  if (!mongoose.Types.ObjectId.isValid(poster_id)) {
    console.log(
      `⚠️ Poster ID (${poster_id}) is not a valid ObjectId. Generating a new one.`
    );
    poster_id = new mongoose.Types.ObjectId();
  } else {
    poster_id = new mongoose.Types.ObjectId(poster_id);
  }

  // 🔹 Generate chatKey (Ensures consistent order)
  const chatKey = id.trim();
  console.log("This is the chatKey:", chatKey);

  const chatTitle = title || "Chat Room";

  try {
    // 🔍 Check if a chat room already exists with the same `chatKey`
    let chatRoom = await Chat.findOne({ chatKey });

    if (chatRoom) {
      console.log("✅ Chat already exists:", chatRoom._id);
    } else {
      // 🔹 Generate a **unique chatItemID** to prevent `null` duplicates
      const chatItemID = `${user_id}_${poster_id}_${id}`;

      chatRoom = await Chat.create({
        chatKey,
        chatItemID, // ✅ Ensure `chatItemID` is unique
        chatTitle,
        participants: [user_id, poster_id], // ✅ Store user IDs
        participantsNUMIDs: [userId, posterId],
        messages: [],
      });

      console.log("✅ New chat created:", chatRoom._id);
    }

    res.redirect(302, `http://${process.env.ID}:3000/chat`);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Failed to create chat room" });
  }
};

exports.getUserChats = async (req, res) => {
  const { user_id } = req.params; // ✅ Using req.params to get user_id

  console.log("Received userId:", user_id);

  if (!user_id) {
    console.log("❌ Missing userId");
    return res.status(400).json({ error: "Missing userId parameter" });
  }

  try {
    // 🔍 Search for chats where `user_id` is inside `participantsNUMIDs`
    console.log(
      `🔍 Searching for chats where user_id (${user_id}) is in participantsNUMIDs array...`
    );

    const chats = await Chat.find({ participantsNUMIDs: user_id });

    console.log(`✅ Found ${chats.length} chats for user ${user_id}`);
    res.status(200).json(chats);
  } catch (error) {
    console.error("❌ Error fetching user chats:", error);
    res.status(500).json({ error: "Failed to fetch user chats" });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    let updated = false;

    // ✅ Mark all messages as read where sender is NOT the current user
    chat.messages.forEach((msg) => {
      if (msg.sender !== userId && !msg.isRead) {
        msg.isRead = true;
        updated = true;
      }
    });

    if (updated) {
      await chat.save(); // ✅ Save only if messages were updated
    }

    res.status(200).json({ message: "Messages marked as read", chat });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

exports.getUnreadMessagesCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ participantsNUMIDs: userId });
    // Log the sender of unread messages for debugging (inside the filter loop)

    const unreadCounts = chats.map((chat) => {
      const unreadMessages = chat.messages.filter(
        (msg) => msg.sender !== userId && !msg.isRead
      );
      unreadMessages.forEach((msg) => {
        console.log("This is the message sender", msg.sender);
      });
      return { chatId: chat._id, unreadCount: unreadMessages.length };
    });

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    res.status(500).json({ error: "Failed to fetch unread messages count" });
  }
};
