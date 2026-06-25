import React from "react";
import { View } from "react-native";

const RNDot = ({ color, size = 8 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

export default RNDot;
