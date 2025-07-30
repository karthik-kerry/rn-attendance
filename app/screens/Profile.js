import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProfileAlt from "../../assets/images/profile-alt.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { base_url } from "../constant/api";
import axios from "axios";
import Svg, { Path } from "react-native-svg";

const Profile = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [isNotify, setIsNotify] = useState(false);

  const onToggleSwitch = () => setIsNotify(!isNotify);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const endpoint = `${base_url}/core/logout/`;
      const headers = {
        Authorization: `Token ${userData?.token}`,
      };
      const res = await axios.post(endpoint, {}, { headers });
      await AsyncStorage.removeItem("userData");
      Alert.alert("Logout successful");
      navigation.navigate("login");
    } catch (error) {
      console.log("Error during logout:", error);
      Alert.alert("Error during logout:", error.response.data.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <View
        style={{ backgroundColor: "#2563EB", height: "20%", width: "100%" }}
      />
      {/* Profile Picture */}
      <View
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 120,
            width: 120,
            borderRadius: 60,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Image
            source={ProfileAlt}
            style={{ height: 120, width: 120 }}
            resizeMode="cover"
          />
        </View>
      </View>
      {/* User Details */}
      <View style={{ alignItems: "center", top: "8%", paddingHorizontal: 20 }}>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            fontSize: 20,
            color: "#1b1b1b",
          }}
        >
          {userData?.username}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
            Full Time
          </Text>
          <View
            style={{
              backgroundColor: "#64748B66",
              height: 4,
              width: 4,
              borderRadius: 10,
            }}
          />
          <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
            Developer
          </Text>
          <View
            style={{
              backgroundColor: "#64748B66",
              height: 4,
              width: 4,
              borderRadius: 10,
            }}
          />
          <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
            Joined Mar 2025
          </Text>
        </View>
        {/* User Info */}
        <View
          style={{
            height: "auto",
            width: "100%",
            borderRadius: 16,
            padding: 18,
            gap: 16,
            backgroundColor: "white",
            marginVertical: 10,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                Mobile No.
              </Text>
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
                {userData?.usermobile}
              </Text>
            </View>
            <View
              style={{
                height: 0.8,
                width: "100%",
                backgroundColor: "#E2E8F0",
                marginTop: 15,
              }}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                Email ID
              </Text>
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
                {userData?.useremail}
              </Text>
            </View>
            <View
              style={{
                height: 0.8,
                width: "100%",
                backgroundColor: "#E2E8F0",
                marginTop: 15,
              }}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                DOB
              </Text>
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
                10/06/2001
              </Text>
            </View>
            <View
              style={{
                height: 0.8,
                width: "100%",
                backgroundColor: "#E2E8F0",
                marginTop: 15,
              }}
            />
          </View>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                Blood Group
              </Text>
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#1b1b1b" }}>
                A1+
              </Text>
            </View>
          </View>
        </View>
        {/* Profile Options */}
        <View style={{ gap: 20, marginTop: 10 }}>
          <View
            style={{
              backgroundColor: "white",
              height: 54,
              width: "100%",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.25022 7C3.25022 5.20979 3.96138 3.4929 5.22725 2.22703C6.49312 0.961159 8.21001 0.25 10.0002 0.25C11.7904 0.25 13.5073 0.961159 14.7732 2.22703C16.0391 3.4929 16.7502 5.20979 16.7502 7V7.75C16.7502 9.873 17.5502 11.807 18.8682 13.27C18.9503 13.361 19.0089 13.4707 19.0388 13.5896C19.0686 13.7084 19.0689 13.8328 19.0396 13.9518C19.0103 14.0708 18.9523 14.1808 18.8707 14.2722C18.789 14.3636 18.6862 14.4335 18.5712 14.476C17.0272 15.046 15.4112 15.466 13.7402 15.719C13.7778 16.2331 13.7091 16.7495 13.5381 17.2359C13.3672 17.7222 13.0979 18.1681 12.7469 18.5457C12.396 18.9233 11.9709 19.2245 11.4983 19.4304C11.0257 19.6364 10.5157 19.7427 10.0002 19.7427C9.4847 19.7427 8.97472 19.6364 8.50213 19.4304C8.02954 19.2245 7.60448 18.9233 7.25351 18.5457C6.90254 18.1681 6.63319 17.7222 6.46229 17.2359C6.29138 16.7495 6.22259 16.2331 6.26022 15.719C4.61187 15.4692 2.99321 15.0524 1.42922 14.475C1.31435 14.4326 1.21161 14.3627 1.12998 14.2715C1.04834 14.1802 0.990294 14.0703 0.960898 13.9515C0.931503 13.8326 0.931657 13.7084 0.961346 13.5896C0.991035 13.4708 1.04936 13.3611 1.13122 13.27C2.49802 11.7567 3.2533 9.78919 3.25022 7.75V7ZM7.75222 15.9C7.73942 16.2032 7.7881 16.5058 7.8953 16.7897C8.00251 17.0736 8.16603 17.3329 8.37604 17.5519C8.58605 17.771 8.83819 17.9453 9.11731 18.0644C9.39643 18.1835 9.69676 18.2448 10.0002 18.2448C10.3037 18.2448 10.604 18.1835 10.8831 18.0644C11.1622 17.9453 11.4144 17.771 11.6244 17.5519C11.8344 17.3329 11.9979 17.0736 12.1051 16.7897C12.2123 16.5058 12.261 16.2032 12.2482 15.9C10.7526 16.0347 9.24786 16.0347 7.75222 15.9Z"
                  fill="#2563EB"
                />
              </Svg>
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  color: "#1b1b1b",
                }}
              >
                Notifications
              </Text>
            </View>
            <Switch
              color="#2563EB"
              value={isNotify}
              onValueChange={onToggleSwitch}
            />
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "white",
              height: 54,
              width: "100%",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.07793 0.25C8.16093 0.25 7.37893 0.913 7.22793 1.817L7.04993 2.889C7.02993 3.009 6.93494 3.149 6.75293 3.237C6.41028 3.40171 6.08067 3.59226 5.76693 3.807C5.60093 3.922 5.43293 3.933 5.31693 3.89L4.29993 3.508C3.88418 3.35224 3.42663 3.34906 3.00875 3.49904C2.59087 3.64901 2.23976 3.94241 2.01793 4.327L1.09593 5.924C0.874024 6.30836 0.795649 6.75897 0.874752 7.19569C0.953855 7.6324 1.18531 8.0269 1.52793 8.309L2.36793 9.001C2.46293 9.079 2.53793 9.23 2.52193 9.431C2.49344 9.81013 2.49344 10.1909 2.52193 10.57C2.53693 10.77 2.46293 10.922 2.36893 11L1.52793 11.692C1.18531 11.9741 0.953855 12.3686 0.874752 12.8053C0.795649 13.242 0.874024 13.6926 1.09593 14.077L2.01793 15.674C2.23992 16.0584 2.59109 16.3516 3.00896 16.5014C3.42683 16.6512 3.88429 16.6478 4.29993 16.492L5.31893 16.11C5.43393 16.067 5.60193 16.079 5.76893 16.192C6.08093 16.406 6.40993 16.597 6.75393 16.762C6.93593 16.85 7.03093 16.99 7.05093 17.112L7.22893 18.183C7.37993 19.087 8.16193 19.75 9.07893 19.75H10.9229C11.8389 19.75 12.6219 19.087 12.7729 18.183L12.9509 17.111C12.9709 16.991 13.0649 16.851 13.2479 16.762C13.5919 16.597 13.9209 16.406 14.2329 16.192C14.3999 16.078 14.5679 16.067 14.6829 16.11L15.7029 16.492C16.1184 16.6472 16.5755 16.6501 16.993 16.5002C17.4104 16.3502 17.7612 16.0571 17.9829 15.673L18.9059 14.076C19.1278 13.6916 19.2062 13.241 19.1271 12.8043C19.048 12.3676 18.8166 11.9731 18.4739 11.691L17.6339 10.999C17.5389 10.921 17.4639 10.77 17.4799 10.569C17.5084 10.1899 17.5084 9.80913 17.4799 9.43C17.4639 9.23 17.5389 9.078 17.6329 9L18.4729 8.308C19.1809 7.726 19.3639 6.718 18.9059 5.923L17.9839 4.326C17.7619 3.94159 17.4108 3.6484 16.9929 3.49861C16.575 3.34883 16.1176 3.35215 15.7019 3.508L14.6819 3.89C14.5679 3.933 14.3999 3.921 14.2329 3.807C13.9195 3.5923 13.5902 3.40175 13.2479 3.237C13.0649 3.15 12.9709 3.01 12.9509 2.889L12.7719 1.817C12.699 1.37906 12.473 0.981216 12.1343 0.694267C11.7955 0.407318 11.3659 0.249889 10.9219 0.25H9.07893H9.07793ZM9.99993 13.75C10.9945 13.75 11.9483 13.3549 12.6516 12.6517C13.3548 11.9484 13.7499 10.9946 13.7499 10C13.7499 9.00544 13.3548 8.05161 12.6516 7.34835C11.9483 6.64509 10.9945 6.25 9.99993 6.25C9.00537 6.25 8.05155 6.64509 7.34828 7.34835C6.64502 8.05161 6.24993 9.00544 6.24993 10C6.24993 10.9946 6.64502 11.9484 7.34828 12.6517C8.05155 13.3549 9.00537 13.75 9.99993 13.75Z"
                  fill="#2563EB"
                />
              </Svg>

              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  color: "#1b1b1b",
                }}
              >
                Settings
              </Text>
            </View>
            <Svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                opacity="0.6"
                d="M10 8.00002C10 8.28678 9.87996 8.5735 9.64037 8.79212L2.0972 15.6718C1.61736 16.1094 0.839375 16.1094 0.359727 15.6718C-0.119909 15.2343 -0.119909 14.5249 0.359727 14.0872L7.03434 8.00002L0.359963 1.91278C-0.119685 1.47514 -0.119685 0.765808 0.359963 0.328385C0.839611 -0.109461 1.61759 -0.109461 2.09743 0.328385L9.64062 7.20794C9.88023 7.42668 10 7.71338 10 8.00004V8.00002Z"
                fill="#64748B"
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "white",
              height: 54,
              width: "100%",
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Svg
                width="14"
                height="22"
                viewBox="0 0 14 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.37905 1.66859L7.06858 1.08881C10.2892 0.582717 11.8995 0.329671 12.9497 1.22779C14 2.12591 14 3.75596 14 7.01607V9.99959H8.08062L10.7809 6.62428L9.21913 5.37489L5.21913 10.3749L4.71938 10.9996L5.21913 11.6243L9.21913 16.6243L10.7809 15.3749L8.08062 11.9996H14V14.9831C14 18.2432 14 19.8733 12.9497 20.7714C11.8995 21.6695 10.2892 21.4165 7.06857 20.9104L3.37905 20.3306C1.76632 20.0771 0.95995 19.9504 0.479975 19.3891C0 18.8279 0 18.0116 0 16.3791V5.6201C0 3.98758 0 3.17132 0.479975 2.61003C0.95995 2.04874 1.76632 1.92202 3.37905 1.66859Z"
                  fill="#2563EB"
                />
              </Svg>
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  color: "#1b1b1b",
                }}
              >
                Logout
              </Text>
            </View>
            <Svg
              width="10"
              height="16"
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                opacity="0.6"
                d="M10 8.00002C10 8.28678 9.87996 8.5735 9.64037 8.79212L2.0972 15.6718C1.61736 16.1094 0.839375 16.1094 0.359727 15.6718C-0.119909 15.2343 -0.119909 14.5249 0.359727 14.0872L7.03434 8.00002L0.359963 1.91278C-0.119685 1.47514 -0.119685 0.765808 0.359963 0.328385C0.839611 -0.109461 1.61759 -0.109461 2.09743 0.328385L9.64062 7.20794C9.88023 7.42668 10 7.71338 10 8.00004V8.00002Z"
                fill="#64748B"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
