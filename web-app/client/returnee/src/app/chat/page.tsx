"use client";

import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList";
import Chat from "../../components/Chat";
import Navbar from "../../components/Navbar";

const ChatPage = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const chats = [
    {
      id: "1",
      name: "Alex Hunt",
      messages: [
        {
          sender: "You",
          content: "Hello Alex!",
          avatar: "https://via.placeholder.com/40",
          time: "09:00",
        },
        {
          sender: "Alex Hunt",
          content: "How are you?",
          avatar: "https://via.placeholder.com/40",
          time: "09:01",
        },
      ],
    },
    {
      id: "2",
      name: "John Doe",
      messages: [
        {
          sender: "You",
          content: "Hi John!",
          avatar: "https://via.placeholder.com/40",
          time: "09:05",
        },
        {
          sender: "John Doe",
          content: "Let's catch up soon.",
          avatar: "https://via.placeholder.com/40",
          time: "09:06",
        },
      ],
    },
  ];

  // Prevent body scroll when page loads
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row h-full">
        {/* ChatList Scroll Fix */}
        {selectedChatId === null || window.innerWidth >= 768 ? (
          <ChatList chats={chats} onSelectChat={setSelectedChatId} />
        ) : null}

        {selectedChatId !== null && (
          <div className="flex-1">
            <Chat
              chatId={selectedChatId}
              chats={chats}
              onBack={() => setSelectedChatId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
