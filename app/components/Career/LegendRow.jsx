import React from "react";
import { View } from "react-native";
import RNLegendItem from "./RNLegendItem";

const LegendRow = ({ items, wrap = false }) => (
  <View
    style={{ flexDirection: "row", flexWrap: wrap ? "wrap" : "nowrap", gap: 6 }}
  >
    {items.map(([label, color]) => (
      <RNLegendItem key={label} color={color} label={label} />
    ))}
  </View>
);

export default LegendRow;
