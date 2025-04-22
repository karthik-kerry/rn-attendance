import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import RequestCard from "../components/RequestCard";

const RequestScreen = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: "Inter-Regular",
          textTransform: "uppercase",
          color: "#64748B",
          marginVertical: 10,
        }}
      >
        Today
      </Text>
      <RequestCard
        initial="RR"
        name="Rama raja"
        content="has not logged in yet today. Please review their attendance
                status."
        profileBg="#2563EB1F"
        profileText="#2563EB"
        time="11:30 AM"
        btnText1="Attendance"
        btnPrimary1="#13950F"
        btnSecondary1="#13950F14"
        btnOnPress1={() => {}}
        btnText2="Send Notification"
        btnPrimary2="#2563EB"
        btnSecondary2="#2563EB1F"
        btnOnPress2={() => {}}
        isApproved={false}
        isNotificationSend={false}
      />
      <RequestCard
        initial="RR"
        name="Rama raja"
        content="has requested sick leave for [15-04-2025]."
        profileBg="#2563EB1F"
        profileText="#2563EB"
        time="10:30 AM"
        btnText1="Denied"
        btnPrimary1="#DD1701"
        btnSecondary1="#DD17011F"
        btnOnPress1={() => {}}
        btnText2="Approve"
        btnPrimary2="#13950F"
        btnSecondary2="#13950F14"
        btnOnPress2={() => {}}
        isApproved={false}
        isNotificationSend={false}
      />
      <Text
        style={{
          fontFamily: "Inter-Regular",
          textTransform: "uppercase",
          color: "#64748B",
          marginVertical: 10,
        }}
      >
        yesterday
      </Text>
      <RequestCard
        initial="RR"
        name="Rama raja"
        content="has not logged in yet today. Please review their attendance status."
        profileBg="#2563EB1F"
        profileText="#2563EB"
        time="11:30 AM"
        isApproved={false}
        isNotificationSend={true}
      />
      <RequestCard
        initial="RR"
        name="Rama raja"
        content="has requested sick leave for [15-04-2025]."
        profileBg="#2563EB1F"
        profileText="#2563EB"
        time="10:30 AM"
        isApproved={true}
        isNotificationSend={false}
      />
    </ScrollView>
  );
};

export default RequestScreen;
