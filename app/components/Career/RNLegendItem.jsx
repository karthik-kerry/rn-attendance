import React from "react";
import { View, Text } from "react-native";
import RNDot from "./RNDot";

const RNLegendItem = ({ color, label }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
    <RNDot color={color} />
    <Text style={{ fontSize: 11, color: "#19213D" }}>{label}</Text>
  </View>
);

export default RNLegendItem;
