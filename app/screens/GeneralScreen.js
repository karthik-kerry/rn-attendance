import { View, Text, ScrollView } from "react-native";
import React from "react";
import NotifyCard from "../components/NotifyCard";

const GeneralScreen = () => {
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
      <NotifyCard
        profileBg="#2563EB1F"
        profileText="#2563EB"
        userName="JK"
        content={
          <Text>
            You haven’t logged in yet today. Please log in as soon as possible
            or inform us if you're on leave or facing any issues.{" "}
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                color: "#2563EB",
                textTransform: "capitalize",
              }}
              onPress={() => {}}
            >
              Jaya kumar
            </Text>
          </Text>
        }
        time="11:30 AM"
      />
      <NotifyCard
        profileBg="#E4403B1F"
        profileText="#E4403B"
        userName="HR"
        content="Remember to take short breaks during work — it helps boost productivity and focus."
        time="11:30 AM"
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
      <NotifyCard
        profileBg="#E4403B1F"
        profileText="#E4403B"
        userName="HR"
        content="Reminder: Your shift starts in 30 minutes."
        time="11:30 AM"
      />
      <NotifyCard
        profileBg="#CEF7D7"
        profileText="#13950F"
        userName="RR"
        content={
          <Text>
            Your Sick leave request for April 15 has been approved.{" "}
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                color: "#2563EB",
                textTransform: "capitalize",
              }}
              onPress={() => {}}
            >
              Sick Leave
            </Text>
          </Text>
        }
        time="11:30 AM"
      />
      <NotifyCard
        profileBg="#E4403B1F"
        profileText="#E4403B"
        userName="HR"
        content={
          <Text>
            New company policy update – please review it under{" "}
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                color: "#2563EB",
                textTransform: "capitalize",
              }}
              onPress={() => {}}
            >
              “Documents.”
            </Text>
          </Text>
        }
        time="10:30 AM"
      />
    </ScrollView>
  );
};

export default GeneralScreen;
