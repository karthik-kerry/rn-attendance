import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../assets/images/logo.png";
import BG from "../../assets/images/bg.png";
import { Dropdown } from "react-native-element-dropdown";
import { base_url } from "../constant/api";
import axios from "axios";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [countries, setCountries] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const endpoint = `${base_url}/core/country_code/`;
        const res = await axios.get(endpoint);
        setCountries(res.data);
      } catch (error) {
        console.log("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const handleLogin = async () => {
    try {
      const endpoint = `${base_url}/core/login/`;
      const payload = {
        username: userName,
        password: password,
        countryCode: selectedCountry,
      };
      if (!userName || !password) {
        Alert.alert("Please fill all fields");
        return;
      }
      const res = await axios.post(endpoint, payload);
      await AsyncStorage.setItem("userData", JSON.stringify(res.data));
      navigation.navigate("homeNav");
      console.log("Login response:", res.data);
    } catch (error) {
      console.log("Error logging in:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Image
        source={BG}
        style={{
          width: width,
          height: 148,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          position: "absolute",
          top: "8%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Image
          source={Logo}
          style={{ height: 56, width: 120 }}
          resizeMode="contain"
        />
      </View>
      <View style={{ margin: 20 }}>
        <View style={{ alignItems: "flex-end" }}>
          <Dropdown
            style={{
              height: 40,
              width: 150,
              paddingHorizontal: 10,
              marginTop: 10,
            }}
            // placeholderStyle={{ color: "#888" }}
            selectedTextStyle={{ color: "#000" }}
            data={countries}
            labelField="name"
            valueField="code"
            // placeholder="Select language"
            value={selectedCountry}
            onChange={(item) => {
              setSelectedCountry(item.code);
            }}
            renderItem={(item) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                }}
              >
                <Text style={{ fontSize: 18, marginRight: 8 }}>
                  {item.flag}
                </Text>
                <Text>{item.name}</Text>
                <Text style={{ marginLeft: "auto", color: "#999" }}>
                  {item.dial_code}
                </Text>
              </View>
            )}
            renderSelectedItem={(item) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 18, marginRight: 5 }}>
                  {item.flag}
                </Text>
                <Text>{item.name} </Text>
                <Text style={{ marginLeft: 4, color: "#888" }}>
                  {item.dial_code}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={{ marginTop: "10%" }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 24,
              fontWeight: "600",
              textTransform: "capitalize",
              color: "#1b1b1b",
            }}
          >
            Welcome to Login... 👋🏻
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", color: "#1B1B1BCC" }}>
            Please enter your credential to login
          </Text>
          <View style={{ marginTop: 20, gap: 15 }}>
            <TextInput
              mode="outlined"
              label="Email Or Mobile No"
              value={userName}
              onChangeText={(text) => setUserName(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <TouchableOpacity
              onPress={() => {}}
              style={{ alignItems: "flex-end" }}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#1B1B1B" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                width: "100%",
                height: 48,
                backgroundColor: "#2563EB",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  color: "white",
                  textTransform: "uppercase",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            marginTop: 20,
          }}
        >
          <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
            Don’t have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#2563EB" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
