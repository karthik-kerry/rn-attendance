import React from "react";
import { View, Text, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const AttendanceChart = ({
  present = 22,
  absent = 2,
  rest = 8,
  lop = 1,
  totalDays = 31,
}) => {
  const chartHeight = 150;
  const barWidth = 40;

  const data = [
    { label: "Present", value: present, color: "#13950F" },
    { label: "Absent", value: absent, color: "#E4403B" },
    { label: "Rest", value: rest, color: "#64748B" },
    { label: "LOP", value: lop, color: "#F09E07" },
  ];

  return (
    <View style={{ marginTop: 30, alignItems: "center" }}>
      {/* Chart Bars */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          height: chartHeight,
          width: screenWidth - 40,
        }}
      >
        {data.map((item, index) => {
          const filledHeight = (item.value / totalDays) * chartHeight;
          const emptyHeight = chartHeight - filledHeight;

          return (
            <View
              key={index}
              style={{ alignItems: "center", marginHorizontal: 6 }}
            >
              <View style={{ height: chartHeight, justifyContent: "flex-end" }}>
                {/* Grey empty portion */}
                <View
                  style={{
                    width: barWidth,
                    height: emptyHeight,
                    backgroundColor: "#64748B14",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                />
                {/* Colored filled portion */}
                <View
                  style={{
                    width: barWidth,
                    height: filledHeight,
                    backgroundColor: item.color,
                    borderRadius: 6,
                  }}
                />
              </View>
              {/* Value on top of the bar */}
              <Text style={{ marginTop: 6, fontSize: 13, fontWeight: "bold" }}>
                {item.value}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Labels in 2x2 grid */}
      <View
        style={{
          marginTop: 20,
          width: screenWidth - 40,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              width: (screenWidth - 150) / 2,
              paddingVertical: 6,
              marginLeft: 50,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <View
              style={{
                height: 30,
                width: 3,
                backgroundColor: item.color,
                borderRadius: 6,
                marginBottom: 4,
              }}
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 13, color: "#374151" }}>
                {item.label}
              </Text>
              <Text style={{ fontSize: 13, color: "#374151" }}>
                {item.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AttendanceChart;
