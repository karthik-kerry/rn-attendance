import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const LeaveCard = ({
  title,
  type,
  typeBgColor,
  typeTextColor,
  cardBgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: "auto",
        width: "100%",
        borderRadius: 12,
        padding: 16,
        backgroundColor: cardBgColor,
        marginBottom: 20,
      }}
      onPress={onPress}
    >
      {/* Attendance Details Title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#2563EB",
              height: 20,
              width: 3,
              borderRadius: 30,
            }}
          />
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 16,
              color: "#1b1b1b",
            }}
          >
            {title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              backgroundColor: typeBgColor,
              borderRadius: 30,
              paddingVertical: 5,
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: typeTextColor,
                fontFamily: "Inter-SemiBold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              {type}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LeaveCard;
