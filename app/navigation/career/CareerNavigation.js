import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Profile from "../../screens/Profile";
import Overview from "../../screens/career/Overview";
import JobListing from "../../screens/career/JobListing";
import CandidateListing from "../../screens/career/CandidateListing";
const Tab = createBottomTabNavigator();

const CareerNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "gray",

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case "Overview":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Jobs":
              iconName = focused ? "briefcase" : "briefcase-outline";
              break;

            case "Candidates":
              iconName = focused ? "people" : "people-outline";
              break;

            case "Profile":
              iconName = focused ? "person-circle" : "person-circle-outline";
              break;

            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={Overview} />

      <Tab.Screen name="Jobs" component={JobListing} />

      <Tab.Screen name="Candidates" component={CandidateListing} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default CareerNavigation;
