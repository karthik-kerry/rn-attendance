import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Svg, { Path } from "react-native-svg";
import HolidaysTopTabs from "../navigation/HolidaysTopTabs";

const HolidayScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Holidays" navigate={() => navigation.goBack()} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginVertical: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#1b1b1b",
            fontSize: 16,
          }}
        >
          Holiday List
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#2563EB",
            height: 32,
            width: "auto",
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexDirection: "row",
            borderRadius: 47,
            backgroundColor: "#2563EB1F",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "#2563EB",
              fontFamily: "Inter-SemiBold",
              textTransform: "uppercase",
            }}
          >
            2025
          </Text>
          <Svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              opacity="0.8"
              d="M11 1.5L6 6.5L1 1.5"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <HolidaysTopTabs />
    </View>
  );
};

export default HolidayScreen;
