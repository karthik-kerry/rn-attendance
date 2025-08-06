import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import VerifyScreen from "./screens/VerifyScreen";
import SetPassword from "./screens/SetPassword";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeNavigation from "./navigation/HomeNavigation";
import WorkDetails from "./screens/WorkDetails";
import AttendanceDetails from "./screens/AttendanceDetails";
import CalendarScreen from "./screens/CalendarScreen";
import LeaveScreen from "./screens/LeaveScreen";
import NotificationScreen from "./screens/NotificationScreen";
import Employees from "./screens/Employees";
import PayslipScreen from "./screens/PayslipScreen";
import ReimbursementScreen from "./screens/ReimbursementScreen";
import BreakScreen from "./screens/BreakScreen";
import HolidayScreen from "./screens/HolidayScreen";
import InsuranceScreen from "./screens/InsuranceScreen";
import PolicyScreen from "./screens/PolicyScreen";
import TermScreen from "./screens/TermScreen";
import SettingScreen from "./screens/SettingScreen";
import AboutApp from "./screens/AboutApp";
import EnablePinLock from "./screens/EnablePinLock";
import HelpScreen from "./screens/HelpScreen";
import ChangePassword from "./screens/ChangePassword";

const Stack = createNativeStackNavigator();

export default function Index() {
  const [userData, setUserData] = useState(null);

  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    };
    fetchUserData();
  }, []);

  if (!loaded) return null;

  return (
    // <NavigationContainer>
    <Stack.Navigator
      initialRouteName={userData ? "homeNav" : "login"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="verify" component={VerifyScreen} />
      <Stack.Screen name="setpass" component={SetPassword} />
      <Stack.Screen name="homeNav" component={HomeNavigation} />
      <Stack.Screen name="details" component={WorkDetails} />
      <Stack.Screen name="attendanceDetails" component={AttendanceDetails} />
      <Stack.Screen name="calendar" component={CalendarScreen} />
      <Stack.Screen name="leave" component={LeaveScreen} />
      <Stack.Screen name="notifications" component={NotificationScreen} />
      <Stack.Screen name="employees" component={Employees} />
      <Stack.Screen name="payslips" component={PayslipScreen} />
      <Stack.Screen name="reimbursement" component={ReimbursementScreen} />
      <Stack.Screen name="break" component={BreakScreen} />
      <Stack.Screen name="holiday" component={HolidayScreen} />
      <Stack.Screen name="insurance" component={InsuranceScreen} />
      <Stack.Screen name="policy" component={PolicyScreen} />
      <Stack.Screen name="term" component={TermScreen} />
      <Stack.Screen name="settings" component={SettingScreen} />
      <Stack.Screen name="about" component={AboutApp} />
      <Stack.Screen name="enablePinLock" component={EnablePinLock} />
      <Stack.Screen name="help" component={HelpScreen} />
      <Stack.Screen name="changePassword" component={ChangePassword} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}
