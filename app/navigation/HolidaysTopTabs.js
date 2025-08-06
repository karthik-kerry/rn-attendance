import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AllHolidays from "../screens/AllHolidays";
import NationalHolidays from "../screens/NationalHolidays";
import Festivals from "../screens/Festivals";

const Tab = createMaterialTopTabNavigator();

const HolidaysTopTabs = () => {
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
      <Tab.Screen name="All Holidays" component={AllHolidays} />
      <Tab.Screen name="National Holidays" component={NationalHolidays} />
      <Tab.Screen name="Festivals" component={Festivals} />
    </Tab.Navigator>
  );
};

export default HolidaysTopTabs;
