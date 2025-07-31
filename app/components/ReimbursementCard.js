import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const ReimbursementCard = ({
  title,
  date,
  statusColor,
  statusText,
  amount,
}) => {
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "#2563EB1F",
        borderRadius: 16,
        backgroundColor: "white",
        height: "auto",
        padding: 16,
      }}
      onPress={() => {}}
    >
      {/* Leave Details Title */}
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
              height: 35,
              width: 3,
              borderRadius: 30,
            }}
          />
          <View>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 16,
                color: "#1b1b1b",
              }}
            >
              {title}
            </Text>
            <Text style={{ color: "#64748B", fontFamily: "Inter-SemiBold" }}>
              {date}
            </Text>
          </View>
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
              backgroundColor: statusColor,
              borderRadius: 30,
              paddingVertical: 5,
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-SemiBold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              {statusText}
            </Text>
          </View>
        </View>
      </View>
      {/* Amount */}
      <Text
        style={{
          color: "#13950F",
          fontFamily: "Inter-SemiBold",
          fontSize: 18,
          marginTop: 10,
        }}
      >
        {amount}
      </Text>
    </TouchableOpacity>
  );
};

export default ReimbursementCard;
