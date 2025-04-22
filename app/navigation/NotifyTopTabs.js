import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import GeneralScreen from "../screens/GeneralScreen";
import RequestScreen from "../screens/RequestScreen";

const Tab = createMaterialTopTabNavigator();

const NotifyTopTabs = () => {
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
      <Tab.Screen name="General" component={GeneralScreen} />
      <Tab.Screen name="Request" component={RequestScreen} />
    </Tab.Navigator>
  );
};

export default NotifyTopTabs;
