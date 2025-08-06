import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";

const ChangePassword = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Change Password" navigate={() => navigation.goBack()} />
      <View
        style={{
          flex: 1,
          gap: 10,
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 30,
        }}
      >
        <View style={{ width: "100%", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={{ color: "#64748B", fontFamily: "Inter-regular" }}>
              Old Password
            </Text>
            <Text style={{ color: "#E4403B" }}>*</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 58,
              height: 44,
              paddingHorizontal: 11,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
              }}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOld}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowOld(!showOld)}>
              {showOld ? (
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
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={{ color: "#64748B", fontFamily: "Inter-regular" }}>
              New Password
            </Text>
            <Text style={{ color: "#E4403B" }}>*</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 58,
              height: 44,
              paddingHorizontal: 11,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
              }}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              {showNew ? (
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
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "100%", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={{ color: "#64748B", fontFamily: "Inter-regular" }}>
              Confirm Password
            </Text>
            <Text style={{ color: "#E4403B" }}>*</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: 58,
              height: 44,
              paddingHorizontal: 11,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                height: "100%",
              }}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? (
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
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            gap: 10,
            marginTop: 20,
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-SemiBold",
              fontSize: 18,
            }}
          >
            Password Policy
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                color: "#1B1B1B",
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Inter-Regular",
              }}
            >
              {"\u2022"} Password should contain minimum of 10 characters.
            </Text>
            <Text
              style={{
                color: "#1B1B1B",
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Inter-Regular",
              }}
            >
              {"\u2022"} Password should contain maximum of 50 characters.
            </Text>
            <Text
              style={{
                color: "#1B1B1B",
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "Inter-Regular",
              }}
            >
              {"\u2022"} Password should contain upper case, lower case, numbers
              and special characters &,&,(,),$,%,>,#,@
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {}}
          style={{
            borderWidth: 1.5,
            borderColor: "#64748B",
            height: 44,
            width: 169,
            borderRadius: 47,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#64748B",
              fontFamily: "Inter-Regular",
              fontSize: 16,
            }}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            height: 44,
            width: 169,
            borderRadius: 47,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2563EB",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Inter-Regular",
              fontSize: 16,
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000060",
          }}
        >
          <View
            style={{
              height: "auto",
              width: width - 40,
              marginHorizontal: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              elevation: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Svg
              width="202"
              height="151"
              viewBox="0 0 202 151"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M98.0894 118.719C123.267 118.719 143.677 98.3086 143.677 73.1314C143.677 47.9541 123.267 27.5439 98.0894 27.5439C72.9121 27.5439 52.502 47.9541 52.502 73.1314C52.502 98.3086 72.9121 118.719 98.0894 118.719Z"
                fill="#2AB426"
              />
              <Path
                d="M120.535 53.8899C121.11 54.3601 112.595 65.8179 101.52 79.4697L94.7985 87.6191L93.8756 88.7335L92.9005 87.7236C84.1939 78.7906 78.3257 72.1737 78.7436 71.7558C79.1615 71.3379 85.7959 77.2409 94.7114 85.8952L92.8308 86.0867L99.4129 77.8503C110.488 64.1114 119.943 53.4198 120.535 53.8899Z"
                fill="white"
              />
              <Path
                d="M162.848 66.7442C161.49 61.9556 155.273 62.4258 155.273 62.4258L155.43 65.7516C159.035 65.1248 161.264 69.3387 161.264 69.3387L162.848 66.7442Z"
                fill="#2563EB"
              />
              <Path
                d="M7.5747 77.0586C6.21648 72.27 0 72.7402 0 72.7402L0.156764 76.0661C3.76127 75.4392 5.9901 79.6532 5.9901 79.6532L7.5747 77.0586Z"
                fill="#2563EB"
              />
              <Path
                d="M30.7856 76.8083C29.4448 72.0197 23.2109 72.4724 23.2109 72.4724L23.3851 75.8157C26.9896 75.1888 29.2184 79.4028 29.2184 79.4028L30.7856 76.8083Z"
                fill="#D0CBCB"
              />
              <Path
                d="M103.52 10.55C110.746 12.744 115.239 4.42057 115.239 4.42057L110.851 1.91309C108.691 7.01512 101.482 6.42307 101.482 6.42307L103.52 10.55Z"
                fill="#D0CBCB"
              />
              <Path
                d="M112.76 138.55C119.986 140.744 124.479 132.421 124.479 132.421L120.091 129.913C117.932 135.015 110.723 134.423 110.723 134.423L112.76 138.55Z"
                fill="#D0CBCB"
              />
              <Path
                d="M63.4526 19.5186C60.0919 19.8842 59.6914 24.0982 59.6914 24.0982L61.9377 24.3594C61.9377 21.8867 65.0198 20.8768 65.0198 20.8768L63.4526 19.5186Z"
                fill="#2AB426"
              />
              <Path
                d="M201.958 50.3755C202.446 47.0322 198.476 45.5869 198.476 45.5869L197.657 47.6939C200.06 48.3033 200.287 51.5422 200.287 51.5422L201.958 50.3755Z"
                fill="#D0CBCB"
              />
              <Path
                d="M40.6858 85.1841C41.1734 81.8408 37.2032 80.3955 37.2032 80.3955L36.3848 82.5025C38.7878 83.1119 39.0141 86.3508 39.0141 86.3508L40.6858 85.1841Z"
                fill="#E0E0E0"
              />
              <Path
                d="M83.301 5.51614C83.7886 2.17282 79.8184 0.727539 79.8184 0.727539L79 2.85194C81.403 3.46139 81.6294 6.68281 81.6294 6.68281L83.301 5.51614Z"
                fill="#2AB426"
              />
              <Path
                d="M92.303 103.516C92.7906 100.173 88.8204 98.7275 88.8204 98.7275L88.002 100.852C90.405 101.461 90.6313 104.683 90.6313 104.683L92.303 103.516Z"
                fill="#2AB426"
              />
              <Path
                d="M8.03588 34.9216C7.44384 40.1455 14.3742 41.4341 14.3742 41.4341L15.628 37.9515C11.4663 37.5684 10.8742 32.7275 10.8742 32.7275L8.03588 34.9216Z"
                fill="#2563EB"
              />
              <Path
                d="M154.596 10.4463C157.974 10.6379 159.054 6.54579 159.054 6.54579L156.877 5.91895C156.476 8.35678 153.272 8.86173 153.272 8.86173L154.596 10.4463Z"
                fill="#2AB426"
              />
              <Path
                d="M1.32341 50.7305C4.70155 50.9221 5.78116 46.83 5.78116 46.83L3.60452 46.2031C3.20402 48.641 0 49.1459 0 49.1459L1.32341 50.7305Z"
                fill="#2AB426"
              />
              <Path
                d="M163.836 138.446C167.214 138.638 168.294 134.546 168.294 134.546L166.117 133.919C165.717 136.357 162.513 136.862 162.513 136.862L163.836 138.446Z"
                fill="#2AB426"
              />
              <Path
                d="M173.034 24.2034C172.129 24.4573 171.185 24.5458 170.248 24.4646C169.311 24.5477 168.367 24.4592 167.462 24.2034C169.301 23.8319 171.195 23.8319 173.034 24.2034Z"
                fill="#E0E0E0"
              />
              <Path
                d="M174.572 85.3011C173.667 85.555 172.723 85.6434 171.786 85.5623C170.849 85.6454 169.905 85.5569 169 85.3011C170.839 84.9296 172.733 84.9296 174.572 85.3011Z"
                fill="#E0E0E0"
              />
              <Path
                d="M175.993 16.6299C176.342 18.4944 176.342 20.4073 175.993 22.2717C175.622 20.4095 175.622 18.4921 175.993 16.6299Z"
                fill="#E0E0E0"
              />
              <Path
                d="M177.532 77.7275C177.88 79.592 177.88 81.5049 177.532 83.3694C177.16 81.5071 177.16 79.5898 177.532 77.7275Z"
                fill="#E0E0E0"
              />
              <Path
                d="M185.234 144.63C185.582 146.494 185.582 148.407 185.234 150.272C184.862 148.409 184.862 146.492 185.234 144.63Z"
                fill="#E0E0E0"
              />
              <Path
                d="M179.128 24.0112C180.033 23.7573 180.977 23.6688 181.914 23.75C182.851 23.6669 183.795 23.7554 184.7 24.0112C182.861 24.3827 180.967 24.3827 179.128 24.0112Z"
                fill="#E0E0E0"
              />
              <Path
                d="M180.666 85.1088C181.571 84.8549 182.515 84.7664 183.452 84.8476C184.389 84.7645 185.333 84.853 186.238 85.1088C184.399 85.4803 182.505 85.4803 180.666 85.1088Z"
                fill="#E0E0E0"
              />
              <Path
                d="M176.186 31.6026C175.814 29.7345 175.814 27.8115 176.186 25.9434C176.534 27.8137 176.534 29.7323 176.186 31.6026Z"
                fill="#E0E0E0"
              />
              <Path
                d="M177.724 92.7003C177.352 90.8321 177.352 88.9091 177.724 87.041C178.072 88.9114 178.072 90.8299 177.724 92.7003Z"
                fill="#E0E0E0"
              />
              <Path
                d="M180.678 28.4339C180.574 28.521 180.034 28.0683 179.477 27.424C178.919 26.7797 178.589 26.1528 178.693 26.0657C178.797 25.9787 179.355 26.414 179.895 27.0757C180.434 27.7374 180.8 28.2424 180.678 28.4339Z"
                fill="#E0E0E0"
              />
              <Path
                d="M182.216 89.5316C182.112 89.6186 181.572 89.1659 181.015 88.5216C180.457 87.8773 180.127 87.2505 180.231 87.1634C180.336 87.0763 180.893 87.5117 181.433 88.1734C181.972 88.8351 182.338 89.34 182.216 89.5316Z"
                fill="#E0E0E0"
              />
              <Path
                d="M180.418 19.7275C180.523 19.8494 180.157 20.3892 179.582 20.9639C179.008 21.5385 178.468 21.9216 178.363 21.8171C178.259 21.7126 178.625 21.1554 179.199 20.5808C179.774 20.0062 180.314 19.7275 180.418 19.7275Z"
                fill="#E0E0E0"
              />
              <Path
                d="M181.956 80.8252C182.061 80.9471 181.695 81.4869 181.121 82.0615C180.546 82.6362 180.006 83.0192 179.902 82.9148C179.797 82.8103 180.163 82.2531 180.737 81.6784C181.312 81.1038 181.852 80.8252 181.956 80.8252Z"
                fill="#E0E0E0"
              />
              <Path
                d="M174.044 21.9383C173.94 22.0602 173.418 21.7816 172.878 21.3288C172.338 20.8761 171.99 20.4234 172.077 20.3189C172.164 20.2144 172.686 20.4756 173.226 20.9109C173.766 21.3462 174.132 21.8338 174.044 21.9383Z"
                fill="#E0E0E0"
              />
              <Path
                d="M175.583 83.036C175.478 83.1579 174.956 82.8792 174.416 82.4265C173.876 81.9738 173.528 81.521 173.615 81.4165C173.702 81.3121 174.224 81.5732 174.764 82.0086C175.304 82.4439 175.67 82.9315 175.583 83.036Z"
                fill="#E0E0E0"
              />
              <Path
                d="M173.783 25.735C173.904 25.822 173.574 26.3618 173.051 26.9365C172.529 27.5111 172.024 27.8768 171.919 27.7723C171.815 27.6678 172.128 27.128 172.651 26.5708C173.173 26.0136 173.678 25.6305 173.783 25.735Z"
                fill="#E0E0E0"
              />
              <Path
                d="M175.321 86.8326C175.443 86.9197 175.112 87.4595 174.589 88.0341C174.067 88.6088 173.562 88.9744 173.458 88.87C173.353 88.7655 173.666 88.2257 174.189 87.6684C174.711 87.1112 175.216 86.7281 175.321 86.8326Z"
                fill="#E0E0E0"
              />
              <Path
                d="M31.3319 28.6684C29.4931 29.0399 27.5986 29.0399 25.7598 28.6684C26.6652 28.4145 27.609 28.326 28.5458 28.4072C29.4827 28.3241 30.4269 28.4126 31.3319 28.6684Z"
                fill="#2AB426"
              />
              <Path
                d="M24.5722 122.301C22.7334 122.673 20.8388 122.673 19 122.301C19.9054 122.047 20.8492 121.959 21.7861 122.04C22.7229 121.957 23.6671 122.045 24.5722 122.301Z"
                fill="#2AB426"
              />
              <Path
                d="M34.2914 21.0947C34.6629 22.9628 34.6629 24.8859 34.2914 26.754C33.9198 24.8859 33.9198 22.9628 34.2914 21.0947Z"
                fill="#2AB426"
              />
              <Path
                d="M27.5316 114.728C27.9032 116.596 27.9032 118.519 27.5316 120.387C27.16 118.519 27.16 116.596 27.5316 114.728Z"
                fill="#2AB426"
              />
              <Path
                d="M37.4453 28.4964C39.2841 28.1249 41.1787 28.1249 43.0175 28.4964C41.1787 28.8679 39.2841 28.8679 37.4453 28.4964Z"
                fill="#2AB426"
              />
              <Path
                d="M30.6855 122.129C32.5244 121.758 34.4189 121.758 36.2577 122.129C34.4189 122.501 32.5244 122.501 30.6855 122.129Z"
                fill="#2AB426"
              />
              <Path
                d="M34.4837 36.0705C34.1122 34.2083 34.1122 32.291 34.4837 30.4287C34.8553 32.291 34.8553 34.2083 34.4837 36.0705Z"
                fill="#2AB426"
              />
              <Path
                d="M27.724 129.703C27.3524 127.841 27.3524 125.924 27.724 124.062C28.0955 125.924 28.0955 127.841 27.724 129.703Z"
                fill="#2AB426"
              />
              <Path
                d="M38.9939 32.7636C38.8721 32.8681 38.3322 32.4153 37.7924 31.7536C37.2526 31.0919 36.887 30.4999 37.0089 30.3954C37.1308 30.2909 37.6531 30.7611 38.2104 31.4054C38.7676 32.0497 39.0984 32.7636 38.9939 32.7636Z"
                fill="#2AB426"
              />
              <Path
                d="M32.2342 126.396C32.1123 126.501 31.5725 126.048 31.0327 125.386C30.4929 124.725 30.1272 124.133 30.2491 124.028C30.371 123.924 30.8934 124.394 31.4506 125.038C32.0078 125.682 32.3387 126.396 32.2342 126.396Z"
                fill="#2AB426"
              />
              <Path
                d="M38.7327 24.2282C38.8372 24.3327 38.4541 24.8899 37.8969 25.4645C37.3397 26.0391 36.7824 26.4048 36.6779 26.3003C36.5735 26.1958 36.9392 25.656 37.5138 25.0814C38.0884 24.5068 38.6282 24.0541 38.7327 24.2282Z"
                fill="#2AB426"
              />
              <Path
                d="M31.9729 117.861C32.0774 117.965 31.6943 118.523 31.1371 119.097C30.5799 119.672 30.0227 120.038 29.9182 119.933C29.8137 119.829 30.1794 119.289 30.754 118.714C31.3287 118.14 31.8685 117.687 31.9729 117.861Z"
                fill="#2AB426"
              />
              <Path
                d="M32.3402 26.4243C32.2531 26.5288 31.7307 26.2676 31.1909 25.8148C30.6511 25.3621 30.2854 24.9094 30.3899 24.7875C30.4944 24.6656 30.9994 24.9442 31.5392 25.3969C32.079 25.8497 32.4447 26.3024 32.3402 26.4243Z"
                fill="#2AB426"
              />
              <Path
                d="M25.5804 120.057C25.4934 120.162 24.971 119.9 24.4312 119.448C23.8914 118.995 23.5257 118.542 23.6301 118.42C23.7346 118.298 24.2396 118.577 24.7794 119.03C25.3192 119.482 25.6849 119.935 25.5804 120.057Z"
                fill="#2AB426"
              />
              <Path
                d="M32.0994 30.2031C32.2039 30.3076 31.873 30.8474 31.368 31.4221C30.8631 31.9967 30.3407 32.3624 30.2188 32.2579C30.0969 32.1534 30.4451 31.6136 30.9501 31.0564C31.4551 30.4992 31.9775 30.0987 32.0994 30.2031Z"
                fill="#2AB426"
              />
              <Path
                d="M25.3396 123.836C25.4441 123.94 25.1133 124.48 24.6083 125.055C24.1033 125.629 23.5809 125.995 23.459 125.891C23.3371 125.786 23.6854 125.246 24.1903 124.689C24.6953 124.132 25.2177 123.731 25.3396 123.836Z"
                fill="#2AB426"
              />
            </Svg>
            <View style={{ alignItems: "center", gap: 10 }}>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-SemiBold",
                  fontSize: 18,
                }}
              >
                Restart Your App
              </Text>
              <Text
                style={{
                  color: "#1B1B1B",
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                }}
              >
                Your password has been change successfully.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10%",
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  height: 44,
                  width: 153,
                  borderRadius: 47,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#64748B",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontFamily: "Inter-SemiBold", color: "#64748B" }}
                >
                  Skip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  height: 44,
                  width: 153,
                  borderRadius: 47,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter-SemiBold",
                  }}
                >
                  Restart Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangePassword;
