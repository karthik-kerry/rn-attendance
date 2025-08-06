import { View, Text, StatusBar, Image, TouchableOpacity } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Bajaj from "../../assets/images/bajaj.png";
import Svg, { Path } from "react-native-svg";

const InsuranceScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Insurance" navigate={() => navigation.goBack()} />
      <View style={{ marginTop: 30 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#00000066",
            borderRadius: 12,
            padding: 16,
            gap: 12,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#2563EB",
                fontFamily: "Inter-Bold",
                fontSize: 16,
              }}
            >
              Health & Wellness Card
            </Text>
            <Image source={Bajaj} resizeMode="contain" />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 10,
              marginTop: 10,
            }}
          >
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Policy Number
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Valid Up To
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Name
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Gender
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Date Of Birth
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Age
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                ID Card No
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                Company Name
              </Text>
            </View>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 12,
                }}
              >
                :
              </Text>
            </View>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                OG-262-72727-28227
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                31-Oct-2025
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                Arun Kumar M
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                Male
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                22-12-1998
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                25
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                KI-23-2332323
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 12,
                }}
              >
                BAJAJ ALLIANZ LIFE INSURANCE CO LTD
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 12,
            backgroundColor: "#2563EB",
            height: 44,
            borderRadius: 47,
          }}
          onPress={() => {}}
        >
          <Svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M1.5 13V15C1.5 15.5304 1.71071 16.0391 2.08579 16.4142C2.46086 16.7893 2.96957 17 3.5 17H15.5C16.0304 17 16.5391 16.7893 16.9142 16.4142C17.2893 16.0391 17.5 15.5304 17.5 15V13M13.5 9L9.5 13M9.5 13L5.5 9M9.5 13V1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text
            style={{
              color: "#fff",
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
            }}
          >
            Download
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsuranceScreen;
