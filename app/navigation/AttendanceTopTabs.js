import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AttendanceOverview from "../screens/AttendanceOverview";
import AttendanceDayWise from "../screens/AttendanceDayWise";

const Tab = createMaterialTopTabNavigator();

const AttendanceTopTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          borderBottomWidth: 2,
          borderBottomColor: "#E2E8F0",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#2563EB",
          height: 2,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "Inter-SemiBold",
        },
        tabBarContentContainerStyle: {
          width: "100%",
        },
      }}
    >
      <Tab.Screen name="Overview" component={AttendanceOverview} />
      <Tab.Screen name="Day Wise" component={AttendanceDayWise} />
    </Tab.Navigator>
  );
};

export default AttendanceTopTabs;
