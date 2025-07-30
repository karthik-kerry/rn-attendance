import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import LeaveDetailCard from "../components/LeaveDetailCard";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 60) / 3;
  const [selected, setSelected] = useState("All");

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Leave Details" navigate={() => navigation.goBack()} />
      <Text
        style={{
          marginVertical: 20,
          fontFamily: "Inter-SemiBold",
          color: "#1b1b1b",
          fontSize: 16,
        }}
      >
        Leave Status
      </Text>
      <View style={{ gap: 20 }}>
        {/* Leave Status Cards */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: "#64748B14",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#64748B",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Total Leave
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#64748B",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              30
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#2563EB14",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#2563EB",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Available
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#2563EB",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              25
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#3CBFBD14",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#3CBFBD",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Applied
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#3CBFBD",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              05
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              backgroundColor: "#13950F14",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#13950F",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Approved
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#13950F",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              03
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#F09E0714",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#F09E07",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Pending
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#F09E07",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              01
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#DD170114",
              height: 76,
              width: cardWidth,
              borderTopWidth: 4,
              borderTopColor: "#DD1701",
              borderRadius: 6,
              paddingVertical: 6,
              paddingHorizontal: 10,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
              Rejected
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#DD1701",
                textAlign: "right",
                fontSize: 18,
              }}
            >
              01
            </Text>
          </View>
        </View>
        {/* Tabs */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: -40,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            {["All", "Approved", "Pending", "Rejected"].map((label) => {
              const isActive = selected === label;

              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => setSelected(label)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 18,
                    borderRadius: 47,
                    borderWidth: 1,
                    borderColor: isActive ? "#2563EB" : "#64748B",
                    backgroundColor: isActive ? "#2563EB1F" : "white",
                    marginRight: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      color: isActive ? "#2563EB" : "#64748B",
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        {/* Cards */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ height: "50%" }}
          contentContainerStyle={{ gap: 15 }}
        >
          <LeaveDetailCard
            title="Apr 1, 2025"
            statusBgColor="#F09E07"
            statusText="Pending"
            leaveType="Sick Leave"
            appliedDays="1 Day"
            approvedBy="Manager"
          />
          <LeaveDetailCard
            title="Mar 12 - Mar 15, 2025"
            statusBgColor="#13950F"
            statusText="Approved"
            leaveType="Casual Leave"
            appliedDays="4 Days"
            approvedBy="Manager"
          />
          <LeaveDetailCard
            title="Mar 05, 2025"
            statusBgColor="#DD1701"
            statusText="Rejected"
            leaveType="Casual Leave"
            appliedDays="1 Day"
            approvedBy="Manager"
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default LeaveScreen;
