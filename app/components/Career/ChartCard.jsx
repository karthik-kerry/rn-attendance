import React from "react";
import { View, Text } from "react-native";

const ChartCard = ({ title, legend, rightExtra, children }) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        flexWrap: "wrap",
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#000", flex: 1 }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {legend}
        {rightExtra}
      </View>
    </View>
    {children}
  </View>
);

export default ChartCard;
