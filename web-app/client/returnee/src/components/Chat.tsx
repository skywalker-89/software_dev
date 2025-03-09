import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowLeftIcon,
  PhotoIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon,
  QrCodeIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { io } from "socket.io-client";
import ImageGallery from "./decorations/ImageGallery";
import ReSchedule from "./popup/ReSchedule";
import QRScan from "./popup/QrScan";
import toast, { Toaster } from "react-hot-toast";

const socket = io("http://localhost:1111"); // Adjust based on backend

interface ChatProps {
  chatId: string | null;
  userId: string;
  chats: {
    id: string;
    chatTitle: string;
    participantsNUMIDs: string[];
    name: string;
    chatKey: string;
    messages: {
      sender: string;
      content: string;
      avatar: string;
      timestamp: string;
      reactions?: string[];
      isMine?: boolean;
      images: string[];
      isRead?: boolean;
    }[];
  }[];
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatId, chats, onBack, userId }) => {
  const chat = chats.find((c) => c.id === chatId);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // To store image previews
  const [loading, setLoading] = useState<boolean>(false); // Loading state to track image upload progress
  const [modalImage, setModalImage] = useState<string | null>(null); // State for lightbox image
  const [isScheduleModalOpen, setIsScheduleRequestModalOpen] = useState(false);
  const [isQRScanOpen, setIsQRScanOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(
    chat?.messages.map((msg) => ({
      ...msg,
      isMine: msg.sender === String(userId), // Ensure sent messages appear on the right
      time: msg.timestamp
        ? new Date(msg.timestamp).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }) // ✅ Convert stored timestamp correctly
        : new Date().toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }), // Default if missing
      isRead: msg.isRead ?? false, // ✅ Ensure `isRead` exists with a default value
    })) || []
  );

  const requestSchedule = () => {
    setIsScheduleRequestModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);

      // Create preview URLs for the selected images
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // Remove selected image
  const removeImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);

    // Reset file input value to allow re-selection of the same image
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Identify receiver ID
  const receiverId = chat
    ? chat.participantsNUMIDs.find((id) => id !== String(userId)) || ""
    : "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Join chat room
  useEffect(() => {
    if (chatId) {
      socket.emit("join-room", chatId, userId);
      console.log("This is the chatId", chatId);
      console.log("This is the userId", userId);
      console.log("This is the participantsNUMIDs:", chat?.participantsNUMIDs);
      console.log("This is the chatKey:", chat?.chatKey);

      // ✅ Mark messages as read when chat is opened
      fetch("http://localhost:1111/chat/mark-messages-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.chat) {
            setMessages(
              data.chat.messages.map(
                (msg: {
                  sender: string;
                  content: string;
                  avatar?: string;
                  timestamp: string;
                  isRead?: boolean;
                }) => ({
                  ...msg,
                  isMine: msg.sender === String(userId),
                  time: new Date(msg.timestamp).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }),
                  isRead: msg.isRead ?? false,
                })
              )
            );
          }
        })
        .catch((err) => console.error("Error marking messages as read:", err));
    }
  }, [chatId, userId]); // Ensure chatId and userId are included in the dependency

  // Receive messages in real-time
  useEffect(() => {
    interface NewMessage {
      sender: string;
      content: string;
      timestamp: string;
      images?: string[];
    }

    const handleNewMessage = (newMessage: NewMessage) => {
      // console.log("Received new message", newMessage);
      console.log("This is new message", newMessage.sender);
      console.log("This is the user id", userId);
      console.log("This is the images", newMessage);

      // Avoid adding the same message again (checking by timestamp and content)
      // Avoid adding the same message again (checking by timestamp and content)
      if (newMessage.sender !== userId) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) =>
              msg.timestamp === newMessage.timestamp &&
              msg.content === newMessage.content
          );

          if (!messageExists) {
            return [
              ...prevMessages,
              {
                sender: newMessage.sender,
                content: newMessage.content,
                avatar: "", // Replace with real avatar if needed
                time: new Date(
                  newMessage.timestamp || Date.now()
                ).toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                isMine: false, // Always false since it's from the other user
                timestamp: newMessage.timestamp || new Date().toISOString(),
                isRead: false, // Default to false
                images: newMessage.images || [], // Handle images
              },
            ];
          }

          return prevMessages; // Return current state if message already exists
        });
      }
    };

    socket.on("receive-message", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage); // Clean up the event listener
    };
  }, [chatId, userId]); // Dependencies to track updates correctly

  // Send message function
  const sendMessage = async () => {
    if (!message.trim() && images.length === 0) return; // Ensure message is not empty
    const timestamp = new Date().toISOString(); // ✅ Store timestamp as ISO string
    setLoading(true); // Set loading to true when uploading starts

    const formData = new FormData();
    formData.append("chatId", chatId!);
    formData.append("senderId", userId);
    formData.append("receiverId", receiverId);
    formData.append("content", message);

    images.forEach((image) => formData.append("images", image)); // Attach images

    try {
      const response = await fetch("http://localhost:1111/chat/send", {
        method: "POST",
        body: formData, // ✅ Must use FormData to send images + text
      });

      const data = await response.json();

      if (response.ok) {
        socket.emit("send-message", {
          chatId,
          senderId: userId,
          receiverId,
          content: message || "",
          images: data.images || [], // Send images if available
        });
        setMessages((prev) => [
          ...prev,
          {
            sender: userId,
            content: message,
            avatar: "", // Replace with real avatar if needed
            images: data.images || [],
            isMine: true,
            timestamp: new Date().toISOString(),
            isRead: false, // ✅ Default to false
            time: new Date(timestamp).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }), // ✅ Show correct message time
          },
        ]);

        setMessage("");
        setImages([]); // Clear images after sending
        setImagePreviews([]); // Clear image previews
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false); // Set loading to false after upload is complete
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log("This  is the images", images.length);

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
      <Toaster position="bottom-right" />
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-md sticky top-0 z-10">
        <button
          onClick={onBack}
          className="md:hidden flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold ml-2 text-gray-800">
          {chat.chatTitle || "Untitled Chat"}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={requestSchedule}
          >
            <CheckBadgeIcon className="h-5 w-5 text-gray-700" />
          </button>
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsQRScanOpen(true)}
          >
            <QrCodeIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const currentMessageDate = new Date(
            msg.timestamp
          ).toLocaleDateString();
          const previousMessageDate =
            index > 0
              ? new Date(messages[index - 1].timestamp).toLocaleDateString()
              : null;

          return (
            <React.Fragment key={index}>
              {/* Display date header if the date is different from the previous message */}
              {currentMessageDate !== previousMessageDate && (
                <div className="text-center text-xs text-gray-500 my-2">
                  {currentMessageDate}
                </div>
              )}

              <div
                className={`flex items-end space-x-3 ${
                  msg.isMine ? "justify-end" : "justify-start"
                }`}
              >
                {/* Show avatar for received messages */}
                {!msg.isMine && msg.avatar && (
                  <Image
                    src={msg.avatar}
                    alt="User avatar"
                    width={35}
                    height={35}
                    className="rounded-full object-cover"
                  />
                )}

                <div
                  className={`max-w-xs md:max-w-sm p-3 rounded-xl shadow-sm ${
                    msg.isMine
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-900 rounded-tl-none"
                  }`}
                >
                  {/* Display text message if present */}
                  {msg.content && (
                    <p className="text-sm break-words">{msg.content}</p>
                  )}

                  {/* Display Images if available */}
                  {msg.images && msg.images.length > 0 && (
                    <ImageGallery images={msg.images} />
                  )}

                  {/* Timestamp */}
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* ✅ Show "Seen" text below the last message if it is read */}
        {messages.length > 0 &&
          messages[messages.length - 1].isMine &&
          messages[messages.length - 1].isRead && (
            <div className="text-xs text-gray-500 text-right mt-1">Seen</div>
          )}
        <div ref={messagesEndRef} />
      </div>

      {isQRScanOpen && (
        <QRScan
          onClose={() => setIsQRScanOpen(false)}
          onScanSuccess={async (result) => {
            try {
              console.log("Scanned Result:", result);

              // Parse the result to ensure it's an object
              const parsedResult = JSON.parse(result);

              const { senderId, id } = parsedResult; // Extract relevant fields
              // console.log("This is the senderId", senderId);
              // console.log("This is the id", id);

              if (!senderId || !id) {
                throw new Error("Invalid QR data");
              }

              // Check if senderId matches receiverId and id matches itemId
              if (senderId === receiverId && id === chat?.chatKey) {
                // Make a PUT request to update the item status to 'claimed'
                const response = await fetch(
                  `http://localhost:1111/items/claim-item/${id}?time=${encodeURIComponent(
                    new Date().toISOString()
                  )}&userId=${encodeURIComponent(senderId)}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const data = await response.json();

                if (response.ok) {
                  toast.success("Item Claimed Successfully", {
                    duration: 5000,
                  });
                } else {
                  throw new Error(data.message || "Failed to claim item");
                }
              } else {
                toast.error("Wrong QR code : Unable to claim item", {
                  duration: 5000,
                });
              }
            } catch (error) {
              console.error("QR Code Scan Error:", error);
            }
          }}
        />
      )}

      {/* Schedule Request Modal */}
      {isScheduleModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsScheduleRequestModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ReSchedule
              participantsNUMIDs={chat?.participantsNUMIDs || []} // Pass participantsNUMIDs here
              chatId={chat?.chatKey} // Pass chatId if needed
              onClose={() => setIsScheduleRequestModalOpen(false)} // Pass close function
            />
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-3xl max-h-3xl">
            <Image
              src={modalImage}
              alt="Zoomed-in"
              width={800}
              height={800}
              className="rounded-lg object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Image Previews with Remove Button */}
      {imagePreviews.length > 0 && (
        <div className="p-3 bg-gray-100 flex space-x-4 overflow-x-auto">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative w-24 h-24 group">
              <Image
                src={preview}
                alt="Selected"
                width={96}
                height={96}
                className="rounded-lg object-cover shadow-lg transition-transform transform group-hover:scale-105"
              />
              {/* Hover effect and border for remove button */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="sticky bottom-0 bg-white p-3 border-t shadow-md flex items-center space-x-3">
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange} // ✅ Now the function is used
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
          >
            <PhotoIcon className="h-6 w-6 text-gray-600" />
          </label>
        </div>
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className={`p-3 rounded-lg transition ${
            message.trim() || images.length > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={loading || !(message.trim() || images.length > 0)} // Disable button when loading
          onClick={sendMessage}
        >
          {loading ? (
            <ArrowPathIcon className="animate-spin h-5 w-5 text-white" /> // Loading spinner
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;
