import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const LeaveDetailCard = ({
  title,
  statusBgColor,
  statusText,
  leaveType,
  appliedDays,
  approvedBy,
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
              backgroundColor: statusBgColor,
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
      {/* Divider */}
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 15,
        }}
      />
      {/* Details */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: "#1B1B1B" }}>
            {leaveType}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Leave Type
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: "#1B1B1B" }}>
            {appliedDays}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Applied Days
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Text style={{ fontFamily: "Inter-Bold", color: "#1B1B1B" }}>
            {approvedBy}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#64748B",
            }}
          >
            Approved By
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LeaveDetailCard;
