import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Logo from "../../assets/images/logo.png";
import BG from "../../assets/images/bg.png";
import { base_url } from "../constant/api";
import { StatusBar } from "expo-status-bar";

const VerifyScreen = () => {
  const route = useRoute();
  const { payload } = route.params;

  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [countries, setCountries] = useState([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = Array(6)
    .fill()
    .map(() => React.createRef());

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const fullOtp = otp.join("");
  console.log("Full OTP:", fullOtp);

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
    const data = {
      payload,
      fullOtp,
    };
    navigation.navigate("setpass", { data });
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
            Verification Code
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", color: "#1B1B1BCC" }}>
            We have sent the verification code to your mobile number
          </Text>
          <View style={{ marginTop: 20, gap: 20 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={{
                    width: 50,
                    height: 48,
                    borderWidth: 1,
                    borderColor: "#DDDDDD",
                    borderRadius: 8,
                    textAlign: "center",
                    fontSize: 18,
                  }}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#64748B", fontFamily: "Inter-Regular" }}>
                00:60
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={{ fontFamily: "Inter-SemiBold", color: "#2563EB" }}
                >
                  Re-send OTP
                </Text>
              </TouchableOpacity>
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
                Verify
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
        </View>
      </View>
    </View>
  );
};

export default VerifyScreen;
