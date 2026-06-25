import React from "react";
import { View, Text, ScrollView } from "react-native";
import RNDot from "./RNDot";

const ChartTableRN = ({ rows, columns }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginTop: 8 }}
  >
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 80, padding: 4 }} />
        {columns.map((col, ci) => (
          <View
            key={ci}
            style={{ width: 48, padding: 4, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 9,
                color: "#555",
                fontWeight: "500",
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {col}
            </Text>
          </View>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={{
            flexDirection: "row",
            backgroundColor: ri % 2 === 0 ? "#FAFAFA" : "#fff",
            borderWidth: 0.5,
            borderColor: "#D9D9D9",
          }}
        >
          <View
            style={{
              width: 80,
              padding: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RNDot color={row.color} />
            <Text
              style={{ fontSize: 9, fontWeight: "500", color: "#555" }}
              numberOfLines={1}
            >
              {row.label}
            </Text>
          </View>
          {row.values.map((v, ci) => (
            <View
              key={ci}
              style={{
                width: 48,
                padding: 4,
                alignItems: "center",
                borderLeftWidth: 0.5,
                borderLeftColor: "#D9D9D9",
              }}
            >
              <Text
                style={{ fontSize: 10, color: "#1B1B1B", textAlign: "center" }}
              >
                {v}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  </ScrollView>
);

export default ChartTableRN;
