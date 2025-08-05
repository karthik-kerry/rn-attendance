import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import General from "../components/General";
import DayType from "../components/DayType";

const Tab = createMaterialTopTabNavigator();

const LegendsTabs = () => {
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
        sceneContainerStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Tab.Screen
        screenOptions={{ backgroundColor: "white" }}
        name="General"
        component={General}
      />
      <Tab.Screen name="Day Type" component={DayType} />
    </Tab.Navigator>
  );
};

export default LegendsTabs;
