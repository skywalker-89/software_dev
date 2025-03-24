"use client";

import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList";
import Chat from "../../components/Chat";
import Navbar from "../../components/Navbar";

interface Message {
  sender: string;
  content: string;
  avatar: string;
  timestamp: string;
  time: string; // ✅ Ensure time exists
  isMine: boolean;
  images: string[]; // ✅ Add `images` field
  isRead?: boolean; // ✅ Add `isRead` field
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
  chatTitle: string;
  unreadCount: number; // ✅ New field for unread messages
  participantsNUMIDs: string[];
  chatKey: string; // ✅ Add `chatKey` field
}

interface User {
  id: string; // ✅ Now using `numericId` instead of `_id`
  name: string;
}

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔹 Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id) {
        setUser(parsedUser);
      } else {
        console.error("User numeric ID not found in localStorage");
      }
    } else {
      console.error("User data not found in localStorage");
    }
  }, []);

  // 🔹 Fetch chats only when `user` is set
  useEffect(() => {
    if (!user || !user.id) return; // Ensure `user` is available
    console.log("This is the user", user.id);

    const fetchChats = async () => {
      setLoading(true);
      try {
        // 🔹 Fetch chats where `chatKey` contains the user's numeric ID
        const response = await fetch(
          `http://${process.env.id}:1111/chat/chats/${user.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch chats");

        const data = await response.json();

        console.log("This is the data", data);
        setChats(
          data.map(
            (chat: {
              _id: string;
              chatTitle: string;
              participantsNUMIDs: string[];
              participants: { id: string; name: string }[];
              messages?: Message[];
              chatKey: string;
            }) => {
              const unreadCount = chat.messages
                ? chat.messages.filter(
                    (msg) => !msg.isRead && msg.sender !== user?.id
                  ).length
                : 0;
              return {
                id: chat._id,
                chatTitle: chat.chatTitle || "Untitled Chat", // Display other participant(s) name
                participantsNUMIDs: chat.participantsNUMIDs, // ✅ Include `participantsNUMIDs`
                unreadCount, // ✅ Add unreadCount here
                chatKey: chat.chatKey, // ✅ Correctly mapped here as well

                messages:
                  chat.messages?.map((msg) => ({
                    sender: msg.sender,
                    content: msg.content,
                    avatar: msg.avatar,
                    timestamp: msg.timestamp,
                    time: new Date(
                      msg.timestamp || Date.now()
                    ).toLocaleString(), // ✅ Ensure time exists

                    isMine: msg.isMine ?? false, // ✅ Ensure `isMine` is always boolean
                    isRead: msg.isRead ?? false, // ✅ Ensure `isRead` exists
                  })) || [],
              };
            }
          )
        );
      } catch (error) {
        console.error("❌ Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Add fixed positioning */}
      <Navbar />
      <div className="flex-1 h-full flex overflow-hidden ">
        {/* Chat List should take up 1/3 width on desktop, full width on mobile */}
        <div
          className={`${
            selectedChatId ? "hidden md:flex" : "flex"
          } w-full md:w-1/3 h-full border-r bg-white`}
        >
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Loading chats...
            </div>
          ) : (
            <ChatList
              userId={user?.id || ""}
              chats={chats}
              onSelectChat={setSelectedChatId}
            />
          )}
        </div>

        {/* Chat area should take full space when selected */}
        <div
          className={`flex-1 h-full ${
            selectedChatId ? "flex" : "hidden"
          } md:flex`}
        >
          {selectedChatId ? (
            <Chat
              chatId={selectedChatId}
              userId={user?.id || ""}
              chats={chats}
              onBack={() => setSelectedChatId(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
