import React from "react";

interface Message {
  sender: string;
  content: string;
  avatar: string;
  time: string;
  isMine: boolean; // ✅ Ensuring consistency with `ChatPage.tsx`
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
  chatTitle: string; // ✅ Add title to Chat
  unreadCount: number; // ✅ New field for unread messages
  chatKey: string; // ✅ Add chatKey to Chat
}

interface ChatListProps {
  userId: string;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, userId }) => {
  return (
    <div className="w-full h-full bg-gray-100 border-r flex flex-col">
      <h2 className="text-lg font-bold p-4 text-gray-800 border-b bg-gray-100 sticky top-0 z-10">
        Chats List
      </h2>

      {chats.length === 0 ? (
        <p className="text-center text-gray-500 p-4">No chats found</p>
      ) : (
        <ul className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {chats.map((chat) => (
            <li
              key={chat.chatTitle}
              className="flex items-center p-4 cursor-pointer hover:bg-gray-200 transition duration-200 border-b border-gray-300"
              onClick={() => {
                onSelectChat(chat.id);
                chat.unreadCount = 0;

                // ✅ Send request to backend to mark messages as read
                fetch(`http://${process.env.id}:1111/chat/mark-messages-read`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chatId: chat.id, userId }),
                })
                  .then(() => {
                    chat.unreadCount = 0; // ✅ Reset unread count locally
                  })
                  .catch((err) =>
                    console.error("Error marking messages as read:", err)
                  );
              }}
            >
              <div className="flex-1 text-gray-700 font-medium">
                {chat.chatTitle}
              </div>

              {/* ✅ Show red dot if unread messages exist */}
              {chat.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
