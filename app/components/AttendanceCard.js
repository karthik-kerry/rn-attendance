import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AttendanceCard = ({
  title,
  shift,
  shiftTextColor,
  shiftBgColor,
  icon,
  inTime,
  outTime,
  workHrs,
  inTimeColor,
  outTimeColor,
  workHrsColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={{
        height: "auto",
        width: "100%",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "white",
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
              backgroundColor: shiftBgColor,
              borderRadius: 30,
              paddingVertical: 5,
              paddingHorizontal: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: shiftTextColor,
                fontFamily: "Inter-SemiBold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              {shift}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#64748B1F",
              padding: 5,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 47,
            }}
          >
            <MaterialCommunityIcons name={icon} size={14} color="#64748B" />
          </View>
        </View>
      </View>
      {/* Divider */}
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 15,
        }}
      />
      {/* Time */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: inTimeColor }}>
            {inTime}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Check In
          </Text>
        </View>
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: outTimeColor }}>
            {outTime}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Check Out
          </Text>
        </View>
        <View
          style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: workHrsColor }}>
            {workHrs}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Working Hrs
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AttendanceCard;
