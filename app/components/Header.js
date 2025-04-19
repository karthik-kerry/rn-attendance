import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome, Fontisto } from "@expo/vector-icons";

const Header = ({ title, navigate }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#64748B1F",
            height: 38,
            width: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
          onPress={navigate}
        >
          <FontAwesome name="angle-left" size={24} color="#64748B" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#1b1b1b" }}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#2563EB14",
          height: 38,
          width: 38,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
        }}
        onPress={() => {}}
      >
        <View
          style={{
            position: "absolute",
            backgroundColor: "red",
            height: 5,
            width: 5,
            borderRadius: 20,
            top: 8,
            right: 12,
            zIndex: 1,
          }}
        />
        <Fontisto name="bell-alt" size={16} color="#2563EB" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
