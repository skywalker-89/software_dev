import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import ChatsScreenStyle from "../screenStyles/ChatsScreenStyle";

export default function ChatsScreen() {
  const chats = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Found your keys!",
      time: "12:00 PM",
    },
    {
      id: "2",
      name: "Jane Smith",
      lastMessage: "Is this your bag?",
      time: "10:15 AM",
    },
  ];

  return (
    <View style={ChatsScreenStyle.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={ChatsScreenStyle.chatCard}>
            <View>
              <Text style={ChatsScreenStyle.chatName}>{item.name}</Text>
              <Text style={ChatsScreenStyle.lastMessage}>
                {item.lastMessage}
              </Text>
            </View>
            <Text style={ChatsScreenStyle.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
