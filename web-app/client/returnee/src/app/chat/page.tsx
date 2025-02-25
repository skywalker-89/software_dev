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
      name: "Sophia Smith",
      messages: [
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
        {
          sender: "Sophia Smith",
          content: "Hey, did you check the new designs?",
          avatar: "https://via.placeholder.com/40",
          time: "10:00 AM",
          isMine: false,
        },
        {
          sender: "You",
          content: "Of course! They're looking great!",
          avatar: "https://via.placeholder.com/40",
          time: "10:02 AM",
          isMine: true,
        },
      ],
    },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Chat List should take up 1/3 width on desktop, full width on mobile */}
        <div
          className={`${
            selectedChatId ? "hidden md:flex" : "flex"
          } w-full md:w-1/3 h-full border-r bg-white`}
        >
          <ChatList chats={chats} onSelectChat={setSelectedChatId} />
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
