import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const NotifyCard = ({ profileBg, profileText, userName, content, time }) => {
  return (
    <>
      <TouchableOpacity onPress={() => {}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: profileBg,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              {userName}
            </Text>
          </View>
          <Text
            style={{
              color: "#64748B",
              fontFamily: "Inter-Regular",
              width: "80%",
              lineHeight: 20,
            }}
          >
            {content}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#64748B",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {time}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 5,
        }}
      />
    </>
  );
};

export default NotifyCard;
