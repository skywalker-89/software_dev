import React from "react";

interface ChatListProps {
  chats: { id: string; name: string }[];
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="w-full md:w-1/3 h-full bg-gray-100 border-r flex flex-col">
      {/* Header */}
      <h2 className="text-lg font-bold p-4 text-gray-800 border-b sticky top-0 bg-gray-100 z-10">
        Chats List
      </h2>

      {/* Scrollable List */}
      <ul className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-4 cursor-pointer hover:bg-gray-200 transition duration-200 border-b border-gray-300"
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex-1 text-gray-700 font-medium">{chat.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
