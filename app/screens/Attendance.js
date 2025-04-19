import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import AttendanceCard from "../components/AttendanceCard";
import LeaveCard from "../components/LeaveCard";

const Attendance = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Attendance" navigate={() => navigation.goBack()} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#1b1b1b",
            fontSize: 16,
          }}
        >
          Attendance Monthly
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
              fontFamily: "Inter-Regular",
              textTransform: "uppercase",
            }}
          >
            APR
          </Text>
          <Ionicons name="calendar-clear" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <ScrollView
        // contentContainerStyle={{ gap: 20 }}
        style={{ flex: 1, marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <AttendanceCard
          title="Tue, Apr 1, 2025"
          shift="General"
          shiftTextColor="#13950F"
          shiftBgColor="#13950F1F"
          icon="office-building"
          inTime="10:00 AM"
          outTime="6:30 PM"
          workHrs="08:30:00"
          inTimeColor="#13950F"
          outTimeColor="#13950F"
          workHrsColor="#13950F"
          onPress={() =>
            navigation.navigate("attendanceDetails", {
              data: "Tue, Apr 1, 2025",
            })
          }
        />
        <AttendanceCard
          title="Wed, Apr 2, 2025"
          shift="General"
          shiftTextColor="#13950F"
          shiftBgColor="#13950F1F"
          icon="home"
          inTime="10:30 AM"
          outTime="6:30 PM"
          workHrs="08:00:00"
          inTimeColor="#DD1701"
          outTimeColor="#13950F"
          workHrsColor="#F09E07"
          onPress={() =>
            navigation.navigate("attendanceDetails", {
              data: "Wed, Apr 2, 2025",
            })
          }
        />
        <AttendanceCard
          title="Thu, Apr 3, 2025"
          shift="General"
          shiftTextColor="#13950F"
          shiftBgColor="#13950F1F"
          icon="office-building"
          inTime="10:30 AM"
          outTime="6:00 PM"
          workHrs="07:30:00"
          inTimeColor="#DD1701"
          outTimeColor="#DD1701"
          workHrsColor="#DD1701"
          onPress={() =>
            navigation.navigate("attendanceDetails", {
              data: "Thu, Apr 3, 2025",
            })
          }
        />
        <LeaveCard
          title="Fri, Apr 4, 2025"
          type="Leave"
          typeBgColor="#DD1701"
          typeTextColor="white"
          cardBgColor="#DD17011F"
          onPress={() => {}}
        />
        <AttendanceCard
          title="Sat, Apr 5, 2025"
          shift="General"
          shiftTextColor="#13950F"
          shiftBgColor="#13950F1F"
          icon="office-building"
          inTime="10:00 AM"
          outTime="3:00 PM"
          workHrs="05:00:00"
          inTimeColor="#13950F"
          outTimeColor="#13950F"
          workHrsColor="#13950F"
          onPress={() =>
            navigation.navigate("attendanceDetails", {
              data: "Sat, Apr 5, 2025",
            })
          }
        />
        <LeaveCard
          title="Sun, Apr 6, 2025"
          type="Holiday"
          typeBgColor="#13950F"
          typeTextColor="white"
          cardBgColor="#13950F1F"
          onPress={() => {}}
        />
        <AttendanceCard
          title="Mon, Apr 7, 2025"
          shift="first"
          shiftTextColor="#13950F"
          shiftBgColor="#13950F1F"
          icon="office-building"
          inTime="10:00 AM"
          outTime="3:00 PM"
          workHrs="05:00:00"
          inTimeColor="#13950F"
          outTimeColor="#13950F"
          workHrsColor="#13950F"
          onPress={() =>
            navigation.navigate("attendanceDetails", {
              data: "Mon, Apr 7, 2025",
            })
          }
        />
      </ScrollView>
    </View>
  );
};

export default Attendance;
