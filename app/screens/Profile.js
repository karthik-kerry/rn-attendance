import { View, Text, StatusBar, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ProfileAlt from "../../assets/images/profile-alt.jpg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "react-native-paper";
import {
  Entypo,
  FontAwesome,
  Fontisto,
  SimpleLineIcons,
} from "@expo/vector-icons";

const Profile = () => {
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
              <Fontisto name="bell-alt" size={18} color="#2563EB" />
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
              <FontAwesome name="gear" size={18} color="#2563EB" />
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
            <Entypo name="chevron-thin-right" size={24} color="#64748B99" />
          </TouchableOpacity>
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
              <SimpleLineIcons name="logout" size={18} color="#2563EB" />
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
            <Entypo name="chevron-thin-right" size={24} color="#64748B99" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;
