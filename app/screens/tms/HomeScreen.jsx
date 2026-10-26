import React, { useEffect, useState } from "react";
import {
  View, Text, Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { base_url } from "@/app/constant/api";
import axiosInstance from "@/app/utils/axiosInstance";
import Svg, { Path } from "react-native-svg";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const endpoint = `${base_url}/core/user_details/${userData?.user_id}/`;
        const payload = {
          username: userData?.username,
          countrycode: "IN",
        };
        const res = await axiosInstance.post(endpoint, payload);
        setUserInfo(res.data);
        console.log(userInfo, "userInfo");
      } catch (error) {
        console.log("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [userData]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
        <View style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row", paddingHorizontal: 20, marginTop: 20 }}>
          {/* Profile details */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <View
              style={{
                height: 38,
                width: 38,
                borderRadius: 8,
                backgroundColor: "white",
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  userInfo?.profile_photo_url
                  && { uri: userInfo.profile_photo_url }
                }
                style={{ height: 38, width: 38 }}
                resizeMode="cover"
              />
            </View>
            <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between", height: "100%" }}>
              <Text style={{ color: "#1B1B1B", fontWeight: 500 }}>{userInfo?.first_name} {userInfo?.last_name}</Text>
              <Text style={{ color: "#1B1B1B", fontSize: 12 }}>{userInfo?.username}</Text>
            </View>
          </View>
          {/* Search & Notification */}
          <View style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <TouchableOpacity onPress={() => {}} style={{ height: 38, width: 38, borderRadius: 8, backgroundColor: "#2563EB14", alignItems: "center", justifyContent: "center" }}>
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M8.25 1.49891C7.36358 1.49891 6.48583 1.67351 5.66689 2.01273C4.84794 2.35194 4.10382 2.84915 3.47703 3.47594C2.85023 4.10274 2.35303 4.84685 2.01381 5.6658C1.67459 6.48475 1.5 7.36249 1.5 8.24891C1.5 9.13534 1.67459 10.0131 2.01381 10.832C2.35303 11.651 2.85023 12.3951 3.47703 13.0219C4.10382 13.6487 4.84794 14.1459 5.66689 14.4851C6.48583 14.8243 7.36358 14.9989 8.25 14.9989C10.0402 14.9989 11.7571 14.2878 13.023 13.0219C14.2888 11.756 15 10.0391 15 8.24891C15 6.4587 14.2888 4.74181 13.023 3.47594C11.7571 2.21007 10.0402 1.49891 8.25 1.49891ZM4.98824e-08 8.24891C0.000174971 6.92401 0.31944 5.61864 0.930789 4.44321C1.54214 3.26779 2.42759 2.25689 3.51224 1.49603C4.59689 0.735175 5.84883 0.246737 7.16216 0.0720366C8.4755 -0.102664 9.81159 0.041512 11.0574 0.492368C12.3033 0.943225 13.4222 1.6875 14.3195 2.66223C15.2169 3.63697 15.8663 4.81349 16.2128 6.09227C16.5594 7.37106 16.5928 8.71449 16.3103 10.0089C16.0278 11.3034 15.4378 12.5107 14.59 13.5289L19.28 18.2189C19.3537 18.2876 19.4128 18.3704 19.4538 18.4624C19.4948 18.5544 19.5168 18.6537 19.5186 18.7544C19.5204 18.8551 19.5018 18.9551 19.4641 19.0485C19.4264 19.1419 19.3703 19.2267 19.299 19.298C19.2278 19.3692 19.143 19.4253 19.0496 19.463C18.9562 19.5008 18.8562 19.5193 18.7555 19.5175C18.6548 19.5157 18.5555 19.4937 18.4635 19.4527C18.3715 19.4117 18.2887 19.3526 18.22 19.2789L13.53 14.5889C12.3252 15.5924 10.8594 16.2318 9.30432 16.4322C7.74922 16.6326 6.16922 16.3856 4.74941 15.7203C3.3296 15.055 2.12878 13.9989 1.28763 12.6756C0.44648 11.3524 -0.000172339 9.81687 4.98824e-08 8.24891Z" fill-rule="evenodd" clip-rule="evenodd" fill="#2563EB" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#2563EB14",
                height: 38,
                width: 38,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
              }}
              onPress={() => navigation.navigate("notifications")}
            >
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "red",
                  height: 5,
                  width: 5,
                  borderRadius: 20,
                  top: 8,
                  right: 12,
                  zIndex: 1,
                }}
              />
              <Svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.25022 7C3.25022 5.20979 3.96138 3.4929 5.22725 2.22703C6.49312 0.961159 8.21001 0.25 10.0002 0.25C11.7904 0.25 13.5073 0.961159 14.7732 2.22703C16.0391 3.4929 16.7502 5.20979 16.7502 7V7.75C16.7502 9.873 17.5502 11.807 18.8682 13.27C18.9503 13.361 19.0089 13.4707 19.0388 13.5896C19.0686 13.7084 19.0689 13.8328 19.0396 13.9518C19.0103 14.0708 18.9523 14.1808 18.8707 14.2722C18.789 14.3636 18.6862 14.4335 18.5712 14.476C17.0272 15.046 15.4112 15.466 13.7402 15.719C13.7778 16.2331 13.7091 16.7495 13.5381 17.2359C13.3672 17.7222 13.0979 18.1681 12.7469 18.5457C12.396 18.9233 11.9709 19.2245 11.4983 19.4304C11.0257 19.6364 10.5157 19.7427 10.0002 19.7427C9.4847 19.7427 8.97472 19.6364 8.50213 19.4304C8.02954 19.2245 7.60448 18.9233 7.25351 18.5457C6.90254 18.1681 6.63319 17.7222 6.46229 17.2359C6.29138 16.7495 6.22259 16.2331 6.26022 15.719C4.61187 15.4692 2.99321 15.0524 1.42922 14.475C1.31435 14.4326 1.21161 14.3627 1.12998 14.2715C1.04834 14.1802 0.990294 14.0703 0.960898 13.9515C0.931503 13.8326 0.931657 13.7084 0.961346 13.5896C0.991035 13.4708 1.04936 13.3611 1.13122 13.27C2.49802 11.7567 3.2533 9.78919 3.25022 7.75V7ZM7.75222 15.9C7.73942 16.2032 7.7881 16.5058 7.8953 16.7897C8.00251 17.0736 8.16603 17.3329 8.37604 17.5519C8.58605 17.771 8.83819 17.9453 9.11731 18.0644C9.39643 18.1835 9.69676 18.2448 10.0002 18.2448C10.3037 18.2448 10.604 18.1835 10.8831 18.0644C11.1622 17.9453 11.4144 17.771 11.6244 17.5519C11.8344 17.3329 11.9979 17.0736 12.1051 16.7897C12.2123 16.5058 12.261 16.2032 12.2482 15.9C10.7526 16.0347 9.24786 16.0347 7.75222 15.9Z"
                  fill="#2563EB"
                />
              </Svg>
            </TouchableOpacity>
          </View>  
        </View>
      </ScrollView>
    </View>
  )
}

export default HomeScreen