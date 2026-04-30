import { useEffect } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRefreshTokenExpired } from "../utils/axiosInstance";

const useSessionGuard = (navigation) => {
  const checkSession = async () => {
    try {
      if (!navigation) return;

      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!refreshToken || (await isRefreshTokenExpired())) {
        await AsyncStorage.clear();

        navigation.resetRoot({
          index: 0,
          routes: [{ name: "login" }],
        });
      }
    } catch (error) {
      console.log("Session check error:", error);
    }
  };

  useEffect(() => {
    checkSession();

    const interval = setInterval(checkSession, 5 * 60 * 1000);

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkSession();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [navigation]);
};
export default useSessionGuard;
