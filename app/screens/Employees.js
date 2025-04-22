import { View, ScrollView } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import NotifyHeader from "../components/NotifyHeader";
import UserEmpCard from "../components/UserEmpCard";

const Employees = () => {
  const navigation = useNavigation();

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <NotifyHeader title="Employees" navigate={() => navigation.goBack()} />
      <ScrollView
        style={{ flex: 1, marginVertical: 20 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      >
        <UserEmpCard
          name="Rama raja"
          code="EMP-1034"
          initial="RR"
          role="Back-End Developer"
          profileBg="#13950F14"
          profileText="#13950F"
        />
        <UserEmpCard
          name="Sujitha"
          code="EMP-1035"
          initial="SS"
          role="Front-End Developer"
          profileBg="#DD17011F"
          profileText="#DD1701"
        />
        <UserEmpCard
          name="Karthik"
          code="EMP-1036"
          initial="NK"
          role="Front-End Developer"
          profileBg="#2563EB1F"
          profileText="#2563EB"
        />
        <UserEmpCard
          name="Idayathulla"
          code="EMP-1037"
          initial="IG"
          role="UI UX Designer"
          profileBg="#FFF9ED"
          profileText="#F09E07"
        />
      </ScrollView>
    </View>
  );
};

export default Employees;
