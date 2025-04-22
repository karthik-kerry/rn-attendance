import { View, Text } from "react-native";
import React from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NotifyHeader = ({ title, navigate }) => {
  const navigation = useNavigation();

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
      <TouchableOpacity onPress={() => {}}>
        <Feather name="more-vertical" size={24} color="#1b1b1b" />
      </TouchableOpacity>
    </View>
  );
};

export default NotifyHeader;
