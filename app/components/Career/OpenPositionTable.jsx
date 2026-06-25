import React from "react";
import { View, Text, ScrollView } from "react-native";
import ChartCard from "./ChartCard";

const cellStyle = {
  flex: 1,
  padding: 7,
  fontSize: 11,
  textAlign: "center",
  borderWidth: 0.5,
  borderColor: "#E8EEFF",
};

const HEADERS = ["Department", "High Priority", "Low Priority"];

const OpenPositionTable = ({ data }) => (
  <ChartCard title="Open Position">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ minWidth: "100%" }}>
        <View style={{ flexDirection: "row", backgroundColor: "#EEF4FF" }}>
          {HEADERS.map((h) => (
            <Text
              key={h}
              style={[
                cellStyle,
                { fontWeight: "600", color: "#2563EB", borderColor: "#D0D9F0" },
              ]}
            >
              {h}
            </Text>
          ))}
        </View>
        {data.map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              backgroundColor: i % 2 === 0 ? "#fff" : "#F7F9FF",
            }}
          >
            <Text style={cellStyle}>{row.name}</Text>
            <Text style={cellStyle}>{row.active}</Text>
            <Text style={cellStyle}>{row.open}</Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", backgroundColor: "#F0F5FF" }}>
          <Text style={[cellStyle, { fontWeight: "700" }]}>TOTAL</Text>
          <Text style={[cellStyle, { fontWeight: "700" }]}>
            {data.reduce((s, r) => s + r.active, 0)}
          </Text>
          <Text style={[cellStyle, { fontWeight: "700" }]}>
            {data.reduce((s, r) => s + r.open, 0)}
          </Text>
        </View>
      </View>
    </ScrollView>
  </ChartCard>
);

export default OpenPositionTable;
