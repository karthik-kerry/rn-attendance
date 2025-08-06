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
import { saveCsrfToken, getCsrfToken } from "../constant/csrfToken";
import Svg, { Path } from "react-native-svg";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [countries, setCountries] = useState([]);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${base_url}/core/get-csrf-token/`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.csrfToken) {
        await saveCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.log("Error fetching CSRF token:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await fetchCsrfToken();

      const csrfToken = await getCsrfToken();
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

      const res = await axios.post(endpoint, payload, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      await AsyncStorage.setItem("userData", JSON.stringify(res.data));
      navigation.navigate("homeNav");
      Alert.alert("Login response:", JSON.stringify(res.data.message));
    } catch (error) {
      console.log("Error logging in:", error);
      Alert.alert("Error", error?.response?.data?.message || "Login failed");
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
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
              right={
                <TextInput.Icon
                  onPress={() => setShowPassword(!showPassword)}
                  icon={() => (
                    <View
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: 20,
                        padding: 2,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {showPassword ? (
                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M2.03613 12.322C1.96712 12.1146 1.96712 11.8904 2.03613 11.683C3.42313 7.51 7.36013 4.5 12.0001 4.5C16.6381 4.5 20.5731 7.507 21.9631 11.678C22.0331 11.885 22.0331 12.109 21.9631 12.317C20.5771 16.49 16.6401 19.5 12.0001 19.5C7.36213 19.5 3.42613 16.493 2.03613 12.322Z"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12Z"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      ) : (
                        <Svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <Path
                            d="M3 3L21 21"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M10.584 10.5869C10.2087 10.9619 9.99775 11.4707 9.99756 12.0012C9.99737 12.5317 10.2079 13.0406 10.583 13.4159C10.958 13.7912 11.4667 14.0021 11.9973 14.0023C12.5278 14.0025 13.0367 13.7919 13.412 13.4169"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M9.363 5.36506C10.2204 5.11978 11.1082 4.9969 12 5.00006C16 5.00006 19.333 7.33306 22 12.0001C21.222 13.3611 20.388 14.5241 19.497 15.4881M17.357 17.3491C15.726 18.4491 13.942 19.0001 12 19.0001C8 19.0001 4.667 16.6671 2 12.0001C3.369 9.60506 4.913 7.82506 6.632 6.65906"
                            stroke="#64748B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      )}
                    </View>
                  )}
                />
              }
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
