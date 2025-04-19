import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import LeaveDetailCard from "../components/LeaveDetailCard";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 60) / 3;

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderColor: "#2563EB",
              borderWidth: 1,
              backgroundColor: "#2563EB1F",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 47,
            }}
            onPress={() => {}}
          >
            <Text style={{ fontFamily: "Inter-Regular", color: "#2563EB" }}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderColor: "#64748B",
              borderWidth: 1,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 47,
            }}
            onPress={() => {}}
          >
            <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
              Approved
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderColor: "#64748B",
              borderWidth: 1,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 47,
            }}
            onPress={() => {}}
          >
            <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 6,
              paddingHorizontal: 18,
              borderColor: "#64748B",
              borderWidth: 1,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 47,
            }}
            onPress={() => {}}
          >
            <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
              Rejected
            </Text>
          </TouchableOpacity>
        </View>
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
