import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../assets/images/logo.png";
import BG from "../../assets/images/bg.png";
import { Dropdown } from "react-native-element-dropdown";
import { base_url } from "../constant/api";
import axios from "axios";
import { Checkbox, TextInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [countries, setCountries] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);

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

  const handleNavigate = () => {
    const payload = {
      firstName,
      lastName,
      phone,
      email,
    };
    navigation.navigate("verify", { payload });
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
        <ScrollView style={{ marginTop: "10%" }}>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 24,
              fontWeight: "600",
              textTransform: "capitalize",
              color: "#1b1b1b",
            }}
          >
            Welcome to Sign Up... 👋🏻
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", color: "#1B1B1BCC" }}>
            Please enter your credential to sign up
          </Text>
          <View style={{ marginTop: 20, gap: 15 }}>
            <TextInput
              mode="outlined"
              label="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <TextInput
              mode="outlined"
              label="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <TextInput
              mode="outlined"
              label="Phone No"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <TextInput
              mode="outlined"
              label="Email Address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              activeOutlineColor="#2563EB"
              outlineColor="#E2E8F0"
              style={{ backgroundColor: "#FFF" }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 5,
                width: "90%",
              }}
            >
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
                color="#2563EB"
                uncheckedColor="#64748B"
              />
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: "#64748B",
                  fontSize: 12,
                }}
              >
                By creating an account means you agree to the Terms & Conditions
                and our Privacy Policy
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNavigate}
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
                Sign Up
              </Text>
            </TouchableOpacity>
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
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("login")}>
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#2563EB" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default RegisterScreen;
