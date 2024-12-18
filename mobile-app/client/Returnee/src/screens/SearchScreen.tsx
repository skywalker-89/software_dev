import React from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import SearchScreenStyle from "../screenStyles/SearchScreenStyle";

export default function SearchScreen() {
  const data = [
    { id: "1", name: "Keys", location: "84 Kamarajar St" },
    { id: "2", name: "Bag", location: "247 86th St" },
  ];

  return (
    <View style={SearchScreenStyle.container}>
      <TextInput
        placeholder="Search items..."
        style={SearchScreenStyle.searchBar}
        placeholderTextColor="#C4C4C4"
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={SearchScreenStyle.card}>
            <Text style={SearchScreenStyle.itemName}>{item.name}</Text>
            <Text style={SearchScreenStyle.itemLocation}>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}
