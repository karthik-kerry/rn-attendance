import { View, StatusBar, ScrollView } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReportCard from "../components/ReportCard";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

const Reports = () => {
  const navigation = useNavigation();

  const master = false;

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Reports" navigate={() => navigation.goBack()} />
      <ScrollView
        style={{ marginVertical: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
      >
        {master && (
          <ReportCard
            name="Employees"
            icon={<FontAwesome name="users" size={24} color="#2563EB" />}
            onPress={() => navigation.navigate("employees")}
          />
        )}
        <ReportCard
          name="Leaves"
          icon={<Ionicons name="calendar" size={24} color="#2563EB" />}
          onPress={() => navigation.navigate("leave")}
        />
        <ReportCard
          name="Attendance"
          icon={<FontAwesome6 name="id-card" size={24} color="#2563EB" />}
          onPress={() => navigation.navigate("Attendance")}
        />
        <ReportCard
          name="Payslip"
          icon={
            <FontAwesome5
              name="file-invoice-dollar"
              size={24}
              color="#2563EB"
            />
          }
          onPress={() => {}}
        />
        <ReportCard
          name="Reimbursement"
          icon={
            <FontAwesome5 name="clipboard-list" size={24} color="#2563EB" />
          }
          onPress={() => {}}
        />
        <ReportCard
          name="Calender"
          icon={<FontAwesome5 name="calendar-alt" size={24} color="#2563EB" />}
          onPress={() => navigation.navigate("calendar")}
        />
        <ReportCard
          name="Holidays"
          icon={
            <FontAwesome5 name="umbrella-beach" size={24} color="#2563EB" />
          }
          onPress={() => {}}
        />
        <ReportCard
          name="Insurance"
          icon={<Entypo name="shield" size={24} color="#2563EB" />}
          onPress={() => {}}
        />
        <ReportCard
          name="Policies"
          icon={<MaterialIcons name="policy" size={24} color="#2563EB" />}
          onPress={() => {}}
        />
        <ReportCard
          name="Terms & Conditions"
          icon={<FontAwesome6 name="file-shield" size={24} color="#2563EB" />}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
};

export default Reports;
