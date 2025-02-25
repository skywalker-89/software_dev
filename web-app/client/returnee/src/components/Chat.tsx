import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PaperClipIcon,
  CheckBadgeIcon,
  PhoneIcon,
  PaperAirplaneIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

interface ChatProps {
  chatId: string | null;
  chats: {
    id: string;
    name: string;
    messages: {
      sender: string;
      content: string;
      avatar: string;
      time: string;
      reactions?: string[];
      isMine?: boolean;
    }[];
  }[];
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, chats, onBack }) => {
  const chat = chats.find((c) => c.id === chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");

  // Auto-scroll when chat updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a chat to view the conversation</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-md sticky top-0 z-10">
        <button
          onClick={onBack}
          className="md:hidden flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold ml-2 text-gray-800">
          {chat.name}
        </h2>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <PhoneIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <CheckBadgeIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <QrCodeIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end space-x-3 ${
              message.isMine ? "justify-end" : "justify-start"
            }`}
          >
            {!message.isMine && (
              <Image
                src={message.avatar}
                alt={`${message.sender}'s avatar`}
                width={35}
                height={35}
                className="rounded-full object-cover"
              />
            )}
            <div
              className={`max-w-xs md:max-w-sm p-3 rounded-xl shadow-sm ${
                message.isMine
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-gray-200 text-gray-900 rounded-tl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex justify-between items-center mt-1 text-xs opacity-75">
                <span>{message.time}</span>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex space-x-1">
                    {message.reactions.map((reaction, i) => (
                      <span key={i} className="text-lg">
                        {reaction}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="sticky bottom-0 bg-white p-3 border-t shadow-md flex items-center space-x-3">
        <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          <PaperClipIcon className="h-6 w-6 text-gray-600" />
        </button>
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && message.trim()) {
              // Handle sending message
              setMessage("");
            }
          }}
        />
        <button
          className={`p-3 rounded-lg transition ${
            message.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!message.trim()}
          onClick={() => {
            if (message.trim()) {
              // Handle sending message
              setMessage("");
            }
          }}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
