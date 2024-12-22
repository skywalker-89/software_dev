import React from "react";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
    }[];
  }[];
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, chats, onBack }) => {
  const chat = chats.find((c) => c.id === chatId);

  if (!chat) {
    return (
      <div className="flex-1 h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Select a chat to view the conversation</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white shadow-sm">
        <button
          onClick={onBack}
          className="md:hidden flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </button>
        <h2 className="text-2xl font-semibold ml-4 text-gray-800">
          {chat.name}
        </h2>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chat.messages.map((message, index) => (
          <div key={index} className="flex items-start space-x-4">
            <Image
              src={message.avatar}
              alt={`${message.sender}'s avatar`}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  {message.sender}
                </h3>
                <span className="text-xs text-gray-400">{message.time}</span>
              </div>
              <p className="mt-1 text-sm text-gray-800 bg-gray-100 p-3 rounded-lg">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box - Fixed */}
      <div className="sticky bottom-0 bg-white p-4 border-t shadow-md">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Type your message..."
          rows={2}
        />
        <button className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
