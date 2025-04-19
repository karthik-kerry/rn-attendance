import { Text, TouchableOpacity } from "react-native";
import React from "react";

const ReportCard = ({ name, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        height: 66,
        width: "100%",
        borderRadius: 8,
        borderLeftWidth: 8,
        borderLeftColor: "#2563EB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
      }}
      onPress={onPress}
    >
      <Text
        style={{ fontFamily: "Inter-Bold", color: "#1b1b1b", fontSize: 16 }}
      >
        {name}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

export default ReportCard;
