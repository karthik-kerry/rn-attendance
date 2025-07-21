import { View, Text, TouchableOpacity, ScrollView, Share } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import CustomModal from "../components/CustomModal";
import Svg, { Path } from "react-native-svg";

const WorkDetails = () => {
  const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();

  const [isCheckIn, setIsCheckIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const createGoogleMapsLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const shareJobDetails = async (data) => {
    try {
      const message = `
          Share Details:
          - Name: ${data.cmpName}
          - Branch: ${data.code}
          - Location: ${data.address}
          - Distance: ${data.distance}
          - Address: ${data.address}
          - Google Maps Link: ${createGoogleMapsLink(
            data.latitude,
            data.longitude
          )}
        `;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing job details:", error);
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Header title="Shift Details" navigate={() => navigation.goBack()} />
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          height: "auto",
          width: "100%",
          borderRadius: 16,
          padding: 16,
          backgroundColor: "white",
          elevation: 1,
          marginVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              color: "#2563EB",
              fontSize: 16,
            }}
          >
            {data.code}
          </Text>
          <View
            style={{
              backgroundColor: "#64748B1F",
              height: 26,
              paddingHorizontal: 15,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Regular",
                color: "#64748B",
                fontSize: 11,
              }}
            >
              {data.distance}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: "left", marginVertical: 10 }}>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              color: "#1b1b1b",
              fontSize: 16,
            }}
          >
            {data.cmpName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Svg
              width="14"
              height="17"
              viewBox="0 0 14 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.2517 16.1316L6.30788 16.1637L6.33035 16.1766C6.41946 16.2248 6.51917 16.25 6.62047 16.25C6.72177 16.25 6.82147 16.2248 6.91058 16.1766L6.93305 16.1645L6.99003 16.1316C7.30391 15.9455 7.61019 15.7469 7.90812 15.5362C8.67941 14.9916 9.40006 14.3787 10.0613 13.7048C11.6214 12.1078 13.2417 9.7082 13.2417 6.62087C13.2417 4.8649 12.5442 3.18086 11.3025 1.93921C10.0609 0.697554 8.37683 0 6.62087 0C4.8649 0 3.18086 0.697554 1.93921 1.93921C0.697554 3.18086 0 4.8649 0 6.62087C0 9.70739 1.62111 12.1078 3.18042 13.7048C3.84142 14.3787 4.5618 14.9916 5.33281 15.5362C5.631 15.7469 5.93755 15.9455 6.2517 16.1316ZM6.62087 9.02845C7.2594 9.02845 7.87178 8.7748 8.32329 8.32329C8.7748 7.87178 9.02845 7.2594 9.02845 6.62087C9.02845 5.98234 8.7748 5.36996 8.32329 4.91845C7.87178 4.46693 7.2594 4.21328 6.62087 4.21328C5.98234 4.21328 5.36996 4.46693 4.91845 4.91845C4.46693 5.36996 4.21328 5.98234 4.21328 6.62087C4.21328 7.2594 4.46693 7.87178 4.91845 8.32329C5.36996 8.7748 5.98234 9.02845 6.62087 9.02845Z"
                fill="#64748B"
              />
            </Svg>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                color: "#1B1B1B99",
                width: "83%",
              }}
            >
              {data.address}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#2563EB1F",
              height: 36,
              width: 36,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => shareJobDetails(data)}
          >
            <Svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.2693 2.57143C12.2692 1.97372 12.481 1.39468 12.8682 0.933838C13.2553 0.472998 13.7937 0.159159 14.3907 0.0462763C14.9877 -0.0666062 15.6061 0.0285209 16.1395 0.315303C16.6729 0.602085 17.088 1.0626 17.3135 1.61769C17.539 2.17277 17.5607 2.78773 17.3749 3.35685C17.1892 3.92597 16.8075 4.41368 16.2956 4.73614C15.7837 5.0586 15.1736 5.19566 14.57 5.12375C13.9665 5.05185 13.4073 4.77547 12.9885 4.34213L5.64722 8.35237C5.75938 8.77671 5.75938 9.2222 5.64722 9.64654L12.9885 13.6568C13.4272 13.2033 14.0191 12.9227 14.6533 12.8676C15.2874 12.8125 15.9202 12.9866 16.433 13.3574C16.9459 13.7282 17.3036 14.2701 17.439 14.8816C17.5745 15.4931 17.4785 16.1322 17.1689 16.6791C16.8594 17.226 16.3575 17.6431 15.7576 17.8522C15.1576 18.0613 14.5006 18.0481 13.9098 17.8151C13.3189 17.5821 12.8349 17.1452 12.5483 16.5864C12.2617 16.0275 12.1922 15.3851 12.353 14.7795L5.01169 10.7702C4.65151 11.143 4.18591 11.4011 3.67502 11.5111C3.16413 11.6211 2.63142 11.578 2.14569 11.3874C1.65996 11.1968 1.24352 10.8674 0.950165 10.4417C0.656806 10.016 0.5 9.51363 0.5 8.99945C0.5 8.48528 0.656806 7.98291 0.950165 7.55723C1.24352 7.13156 1.65996 6.80213 2.14569 6.61149C2.63142 6.42086 3.16413 6.37777 3.67502 6.48781C4.18591 6.59784 4.65151 6.85593 5.01169 7.22875L12.353 3.21851C12.2973 3.00719 12.2691 2.78974 12.2693 2.57143Z"
                fill="#2563EB"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        {isCheckIn ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                width: "48%",
                borderRadius: 47,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  color: "#2563EB",
                  textTransform: "capitalize",
                }}
              >
                Break
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                width: "48%",
                borderRadius: 47,
                backgroundColor: "#DD1701",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
              onPress={() => setIsCheckIn((prev) => !prev)}
            >
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 16,
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                Check Out
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              height: 40,
              width: "100%",
              borderRadius: 47,
              backgroundColor: "#2563EB",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
            onPress={() => setIsCheckIn((prev) => !prev)}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                color: "white",
                textTransform: "capitalize",
              }}
            >
              Check In
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            height: 1,
            width: "100%",
            alignSelf: "center",
            backgroundColor: "#E2E8F0",
            marginVertical: 20,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
          >
            <Svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.51964 0.0234612C6.5221 0.00900026 6.53606 -0.00144314 6.55084 0.000163123H11.4491C11.4639 -0.00144356 11.4779 0.00900046 11.4803 0.0234612L12.1782 2.12601C10.1182 1.43508 7.88187 1.43508 5.82187 2.12601L6.51964 0.0234612ZM9 19.9998C6.61338 20.0006 4.32345 19.0727 2.63547 17.4209C0.948279 15.7692 5.32894e-07 13.5293 5.32894e-07 11.1931C-0.000820649 8.85773 0.94746 6.6178 2.63547 4.96608C4.32349 3.31436 6.61254 2.38638 9 2.38638C11.3866 2.38638 13.6757 3.31429 15.3637 4.96608C17.0517 6.61786 18 8.85773 18 11.1939C17.9975 13.5287 17.0484 15.7667 15.3612 17.4178C13.6731 19.0688 11.3858 19.9975 8.99979 20L9 19.9998ZM9 3.72876C6.42863 3.72635 4.02877 4.99249 2.6174 7.09657C1.20607 9.19994 0.972072 11.8574 1.99671 14.1656C3.02053 16.4746 5.16416 18.1222 7.6979 18.5496C10.2325 18.9778 12.8163 18.127 14.5715 16.2873C14.5822 16.2784 14.592 16.2696 14.6027 16.2599C14.6183 16.2447 14.6322 16.227 14.6454 16.2093C15.9779 14.7745 16.6881 12.8896 16.6249 10.952C16.5617 9.01506 15.7308 7.17763 14.3072 5.82968C12.8844 4.48078 10.9812 3.72711 9 3.72876ZM2.18884 11.7208C2.31281 13.2617 2.9803 14.7135 4.07802 15.8253L4.27424 15.6333C4.42942 15.4815 4.68147 15.4807 4.83747 15.6333C4.99264 15.7852 4.99264 16.0318 4.83747 16.1845L4.66259 16.3556C5.8654 17.3269 7.37289 17.8652 8.93265 17.878V17.7101C8.93265 17.4948 9.11081 17.3205 9.33084 17.3205C9.55087 17.3205 9.72903 17.4948 9.72903 17.7101V17.841C11.2471 17.682 12.6659 17.0288 13.7586 15.986L13.6708 15.8993C13.5148 15.7474 13.5148 15.5008 13.6708 15.3481C13.826 15.1963 14.078 15.1963 14.234 15.3481L14.2981 15.41H14.2972C15.2463 14.274 15.7849 12.8632 15.8293 11.3962H15.7078C15.4877 11.3962 15.3096 11.2218 15.3096 11.0065C15.3096 10.7912 15.4877 10.6169 15.7078 10.6169H15.8071C15.679 9.15956 15.0641 7.78423 14.0583 6.70283L13.8728 6.8844C13.7176 7.03704 13.4656 7.03704 13.3096 6.8844C13.1544 6.73256 13.1544 6.48592 13.3096 6.33407L13.4894 6.15732C12.3506 5.1804 10.9104 4.60437 9.39816 4.5184V4.62766C9.39816 4.84297 9.22 5.0173 8.99997 5.0173C8.77994 5.0173 8.60178 4.84296 8.60178 4.62766V4.5184C7.05661 4.60597 5.58777 5.20611 4.43765 6.22077L4.60268 6.38226H4.6035C4.75867 6.5341 4.75867 6.78154 4.6035 6.93338C4.44751 7.08522 4.19545 7.08522 4.04028 6.93338L3.87689 6.77351C2.83254 7.92718 2.22993 9.39989 2.17162 10.9399H2.48034C2.69956 10.9399 2.87853 11.1143 2.87853 11.3296C2.87853 11.5449 2.69954 11.7192 2.48034 11.7192L2.18884 11.7208ZM9.16581 12.4407C9.72986 12.4407 10.2299 12.084 10.4031 11.5585H12.8883C13.1083 11.5585 13.2865 11.3842 13.2865 11.1689C13.2865 10.9536 13.1083 10.7793 12.8883 10.7793H10.4031C10.2742 10.3896 9.96138 10.0843 9.56318 9.95819V6.50605C9.56318 6.29074 9.38502 6.11642 9.16581 6.11642C8.94578 6.11642 8.76762 6.29075 8.76762 6.50605V9.95819C8.15843 10.1502 7.7824 10.7471 7.88175 11.3665C7.98109 11.9852 8.52541 12.4407 9.16581 12.4407ZM9.16581 10.6764C8.96138 10.6764 8.77828 10.7961 8.7003 10.9809C8.62231 11.1649 8.665 11.377 8.8095 11.5176C8.95318 11.659 9.16992 11.7008 9.35877 11.6244C9.54678 11.5481 9.66912 11.3682 9.66912 11.1689C9.66912 10.8966 9.44332 10.6764 9.16581 10.6764Z"
                fill="#2563EB"
              />
            </Svg>
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              10:00 AM
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Check In
            </Text>
          </View>
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
          >
            <Svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.51964 0.0234612C6.5221 0.00900026 6.53606 -0.00144314 6.55084 0.000163123H11.4491C11.4639 -0.00144356 11.4779 0.00900046 11.4803 0.0234612L12.1782 2.12601C10.1182 1.43508 7.88187 1.43508 5.82187 2.12601L6.51964 0.0234612ZM9 19.9998C6.61338 20.0006 4.32345 19.0727 2.63547 17.4209C0.948279 15.7692 5.32894e-07 13.5293 5.32894e-07 11.1931C-0.000820649 8.85773 0.94746 6.6178 2.63547 4.96608C4.32349 3.31436 6.61254 2.38638 9 2.38638C11.3866 2.38638 13.6757 3.31429 15.3637 4.96608C17.0517 6.61786 18 8.85773 18 11.1939C17.9975 13.5287 17.0484 15.7667 15.3612 17.4178C13.6731 19.0688 11.3858 19.9975 8.99979 20L9 19.9998ZM9 3.72876C6.42863 3.72635 4.02877 4.99249 2.6174 7.09657C1.20607 9.19994 0.972072 11.8574 1.99671 14.1656C3.02053 16.4746 5.16416 18.1222 7.6979 18.5496C10.2325 18.9778 12.8163 18.127 14.5715 16.2873C14.5822 16.2784 14.592 16.2696 14.6027 16.2599C14.6183 16.2447 14.6322 16.227 14.6454 16.2093C15.9779 14.7745 16.6881 12.8896 16.6249 10.952C16.5617 9.01506 15.7308 7.17763 14.3072 5.82968C12.8844 4.48078 10.9812 3.72711 9 3.72876ZM2.18884 11.7208C2.31281 13.2617 2.9803 14.7135 4.07802 15.8253L4.27424 15.6333C4.42942 15.4815 4.68147 15.4807 4.83747 15.6333C4.99264 15.7852 4.99264 16.0318 4.83747 16.1845L4.66259 16.3556C5.8654 17.3269 7.37289 17.8652 8.93265 17.878V17.7101C8.93265 17.4948 9.11081 17.3205 9.33084 17.3205C9.55087 17.3205 9.72903 17.4948 9.72903 17.7101V17.841C11.2471 17.682 12.6659 17.0288 13.7586 15.986L13.6708 15.8993C13.5148 15.7474 13.5148 15.5008 13.6708 15.3481C13.826 15.1963 14.078 15.1963 14.234 15.3481L14.2981 15.41H14.2972C15.2463 14.274 15.7849 12.8632 15.8293 11.3962H15.7078C15.4877 11.3962 15.3096 11.2218 15.3096 11.0065C15.3096 10.7912 15.4877 10.6169 15.7078 10.6169H15.8071C15.679 9.15956 15.0641 7.78423 14.0583 6.70283L13.8728 6.8844C13.7176 7.03704 13.4656 7.03704 13.3096 6.8844C13.1544 6.73256 13.1544 6.48592 13.3096 6.33407L13.4894 6.15732C12.3506 5.1804 10.9104 4.60437 9.39816 4.5184V4.62766C9.39816 4.84297 9.22 5.0173 8.99997 5.0173C8.77994 5.0173 8.60178 4.84296 8.60178 4.62766V4.5184C7.05661 4.60597 5.58777 5.20611 4.43765 6.22077L4.60268 6.38226H4.6035C4.75867 6.5341 4.75867 6.78154 4.6035 6.93338C4.44751 7.08522 4.19545 7.08522 4.04028 6.93338L3.87689 6.77351C2.83254 7.92718 2.22993 9.39989 2.17162 10.9399H2.48034C2.69956 10.9399 2.87853 11.1143 2.87853 11.3296C2.87853 11.5449 2.69954 11.7192 2.48034 11.7192L2.18884 11.7208ZM9.16581 12.4407C9.72986 12.4407 10.2299 12.084 10.4031 11.5585H12.8883C13.1083 11.5585 13.2865 11.3842 13.2865 11.1689C13.2865 10.9536 13.1083 10.7793 12.8883 10.7793H10.4031C10.2742 10.3896 9.96138 10.0843 9.56318 9.95819V6.50605C9.56318 6.29074 9.38502 6.11642 9.16581 6.11642C8.94578 6.11642 8.76762 6.29075 8.76762 6.50605V9.95819C8.15843 10.1502 7.7824 10.7471 7.88175 11.3665C7.98109 11.9852 8.52541 12.4407 9.16581 12.4407ZM9.16581 10.6764C8.96138 10.6764 8.77828 10.7961 8.7003 10.9809C8.62231 11.1649 8.665 11.377 8.8095 11.5176C8.95318 11.659 9.16992 11.7008 9.35877 11.6244C9.54678 11.5481 9.66912 11.3682 9.66912 11.1689C9.66912 10.8966 9.44332 10.6764 9.16581 10.6764Z"
                fill="#2563EB"
              />
            </Svg>
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              6:30 PM
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Check Out
            </Text>
          </View>
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
          >
            <Svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.51964 0.0234612C6.5221 0.00900026 6.53606 -0.00144314 6.55084 0.000163123H11.4491C11.4639 -0.00144356 11.4779 0.00900046 11.4803 0.0234612L12.1782 2.12601C10.1182 1.43508 7.88187 1.43508 5.82187 2.12601L6.51964 0.0234612ZM9 19.9998C6.61338 20.0006 4.32345 19.0727 2.63547 17.4209C0.948279 15.7692 5.32894e-07 13.5293 5.32894e-07 11.1931C-0.000820649 8.85773 0.94746 6.6178 2.63547 4.96608C4.32349 3.31436 6.61254 2.38638 9 2.38638C11.3866 2.38638 13.6757 3.31429 15.3637 4.96608C17.0517 6.61786 18 8.85773 18 11.1939C17.9975 13.5287 17.0484 15.7667 15.3612 17.4178C13.6731 19.0688 11.3858 19.9975 8.99979 20L9 19.9998ZM9 3.72876C6.42863 3.72635 4.02877 4.99249 2.6174 7.09657C1.20607 9.19994 0.972072 11.8574 1.99671 14.1656C3.02053 16.4746 5.16416 18.1222 7.6979 18.5496C10.2325 18.9778 12.8163 18.127 14.5715 16.2873C14.5822 16.2784 14.592 16.2696 14.6027 16.2599C14.6183 16.2447 14.6322 16.227 14.6454 16.2093C15.9779 14.7745 16.6881 12.8896 16.6249 10.952C16.5617 9.01506 15.7308 7.17763 14.3072 5.82968C12.8844 4.48078 10.9812 3.72711 9 3.72876ZM2.18884 11.7208C2.31281 13.2617 2.9803 14.7135 4.07802 15.8253L4.27424 15.6333C4.42942 15.4815 4.68147 15.4807 4.83747 15.6333C4.99264 15.7852 4.99264 16.0318 4.83747 16.1845L4.66259 16.3556C5.8654 17.3269 7.37289 17.8652 8.93265 17.878V17.7101C8.93265 17.4948 9.11081 17.3205 9.33084 17.3205C9.55087 17.3205 9.72903 17.4948 9.72903 17.7101V17.841C11.2471 17.682 12.6659 17.0288 13.7586 15.986L13.6708 15.8993C13.5148 15.7474 13.5148 15.5008 13.6708 15.3481C13.826 15.1963 14.078 15.1963 14.234 15.3481L14.2981 15.41H14.2972C15.2463 14.274 15.7849 12.8632 15.8293 11.3962H15.7078C15.4877 11.3962 15.3096 11.2218 15.3096 11.0065C15.3096 10.7912 15.4877 10.6169 15.7078 10.6169H15.8071C15.679 9.15956 15.0641 7.78423 14.0583 6.70283L13.8728 6.8844C13.7176 7.03704 13.4656 7.03704 13.3096 6.8844C13.1544 6.73256 13.1544 6.48592 13.3096 6.33407L13.4894 6.15732C12.3506 5.1804 10.9104 4.60437 9.39816 4.5184V4.62766C9.39816 4.84297 9.22 5.0173 8.99997 5.0173C8.77994 5.0173 8.60178 4.84296 8.60178 4.62766V4.5184C7.05661 4.60597 5.58777 5.20611 4.43765 6.22077L4.60268 6.38226H4.6035C4.75867 6.5341 4.75867 6.78154 4.6035 6.93338C4.44751 7.08522 4.19545 7.08522 4.04028 6.93338L3.87689 6.77351C2.83254 7.92718 2.22993 9.39989 2.17162 10.9399H2.48034C2.69956 10.9399 2.87853 11.1143 2.87853 11.3296C2.87853 11.5449 2.69954 11.7192 2.48034 11.7192L2.18884 11.7208ZM9.16581 12.4407C9.72986 12.4407 10.2299 12.084 10.4031 11.5585H12.8883C13.1083 11.5585 13.2865 11.3842 13.2865 11.1689C13.2865 10.9536 13.1083 10.7793 12.8883 10.7793H10.4031C10.2742 10.3896 9.96138 10.0843 9.56318 9.95819V6.50605C9.56318 6.29074 9.38502 6.11642 9.16581 6.11642C8.94578 6.11642 8.76762 6.29075 8.76762 6.50605V9.95819C8.15843 10.1502 7.7824 10.7471 7.88175 11.3665C7.98109 11.9852 8.52541 12.4407 9.16581 12.4407ZM9.16581 10.6764C8.96138 10.6764 8.77828 10.7961 8.7003 10.9809C8.62231 11.1649 8.665 11.377 8.8095 11.5176C8.95318 11.659 9.16992 11.7008 9.35877 11.6244C9.54678 11.5481 9.66912 11.3682 9.66912 11.1689C9.66912 10.8966 9.44332 10.6764 9.16581 10.6764Z"
                fill="#2563EB"
              />
            </Svg>
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              00:00:00
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#64748B",
              }}
            >
              Working Hrs
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Regular",
            color: "#1b1b1b",
            fontSize: 16,
          }}
        >
          Schedule
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#2563EB",
            height: 32,
            width: "auto",
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexDirection: "row",
            borderRadius: 47,
            backgroundColor: "#2563EB1F",
          }}
          onPress={() => {}}
        >
          <Text
            style={{
              color: "#2563EB",
              fontFamily: "Inter-Regular",
              textTransform: "uppercase",
            }}
          >
            Today
          </Text>
          <Svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 1.5C4.63261 1.5 4.75979 1.55268 4.85355 1.64645C4.94732 1.74021 5 1.86739 5 2V3H11V2C11 1.86739 11.0527 1.74021 11.1464 1.64645C11.2402 1.55268 11.3674 1.5 11.5 1.5C11.6326 1.5 11.7598 1.55268 11.8536 1.64645C11.9473 1.74021 12 1.86739 12 2V3H12.5C13.0304 3 13.5391 3.21071 13.9142 3.58579C14.2893 3.96086 14.5 4.46957 14.5 5V12.5C14.5 13.0304 14.2893 13.5391 13.9142 13.9142C13.5391 14.2893 13.0304 14.5 12.5 14.5H3.5C2.96957 14.5 2.46086 14.2893 2.08579 13.9142C1.71071 13.5391 1.5 13.0304 1.5 12.5V5C1.5 4.46957 1.71071 3.96086 2.08579 3.58579C2.46086 3.21071 2.96957 3 3.5 3H4V2C4 1.86739 4.05268 1.74021 4.14645 1.64645C4.24021 1.55268 4.36739 1.5 4.5 1.5ZM13.5 7.5C13.5 7.23478 13.3946 6.98043 13.2071 6.79289C13.0196 6.60536 12.7652 6.5 12.5 6.5H3.5C3.23478 6.5 2.98043 6.60536 2.79289 6.79289C2.60536 6.98043 2.5 7.23478 2.5 7.5V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5H12.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5V7.5Z"
              fill="#2563EB"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 20,
          marginVertical: 20,
          marginHorizontal: -20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#13950F",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              10:00
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#CEF7D7",
              height: 34,
              width: "75%",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#13950F", fontFamily: "Inter-Regular" }}>
              Check-In Time
            </Text>
            <Text style={{ color: "#13950F", fontFamily: "Inter-Regular" }}>
              (9:52)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#F09E07",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              11:00
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FFF9ED",
              height: 34,
              width: "75%",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              Tea Break
            </Text>
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              (11:00 - 11:15)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#64748B",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              12:00
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#F09E07",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              13:00
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FFF9ED",
              height: 34,
              width: "75%",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              Lunch Break
            </Text>
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              (13:00 - 14:00)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#64748B",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              14:00
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#64748B",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              15:00
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#F09E07",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              16:00
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FFF9ED",
              height: 34,
              width: "75%",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              Tea Break
            </Text>
            <Text style={{ color: "#F09E07", fontFamily: "Inter-Regular" }}>
              (16:00 - 16:15)
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#64748B",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              17:00
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#64748B",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              18:00
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View
            style={{
              borderBottomWidth: 1.5,
              borderColor: "#E2E2E2",
              borderStyle: "dashed",
              width: "120%",
              position: "absolute",
              marginHorizontal: -20,
            }}
          />
          <View
            style={{
              backgroundColor: "#DD1701",
              height: 34,
              width: 74,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Regular" }}>
              18:30
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#FFE8E6",
              height: 34,
              width: "75%",
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: "#DD1701", fontFamily: "Inter-Regular" }}>
              Check-Out Time
            </Text>
            <Text style={{ color: "#DD1701", fontFamily: "Inter-Regular" }}>
              (18:30)
            </Text>
          </View>
        </View>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          console.log(data);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default WorkDetails;
