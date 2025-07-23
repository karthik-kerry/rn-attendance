import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomModal from "../components/CustomModal";
import LeaveModal from "../components/LeaveModal";
import { base_url } from "../constant/api";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import Svg, { Path } from "react-native-svg";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("office");
  const [time, setTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short" })
  );
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [shiftData, setShiftData] = useState(null);
  const [shiftDetails, setShiftDetails] = useState(null);
  const [officeAlert, setOfficeAlert] = useState(false);
  const [note, setNote] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [cmpBranchList, setCmpBranchList] = useState([]);
  const [cmpModalVisible, setCmpModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const dropdownData = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;
      const formattedTime =
        [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(" : ") + ` ${ampm}`;

      setTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      userData &&
      userData.branchid &&
      userData.branchid.branchid &&
      cmpBranchList &&
      cmpBranchList.length > 0
    ) {
      const found = cmpBranchList.find(
        (item) => item.branchid === userData.branchid.branchid
      );
      if (found) {
        setSelectedBranch(found);
      }
    }
  }, [userData, cmpBranchList]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.token) {
          setUserData(parsedData);
        } else {
          console.error("Token is missing in userData");
        }
      } else {
        console.error("No userData found in AsyncStorage");
      }
    };

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      let place = await Location.reverseGeocodeAsync(coords);

      if (place.length > 0) {
        const { city, district, region, country } = place[0];
        setAddress(`${district || city}, ${region}, ${country}`);
      }
    };

    fetchUserData();
    getLocation();
  }, []);

  useEffect(() => {
    const fetchNearbyJobs = async () => {
      if (!userData.token) {
        console.log("User token is missing");
        return;
      }
      try {
        const endPoint = `${base_url}/hrm/latitude_longitude/${userData?.user_id}/${userData?.branchid?.companyid}/`; //${userData?.user_id}
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };
        const payload = {
          user_latitude: 13.09997989105245, //location.coords.latitude,
          user_longitude: 80.29011704834728, //location.coords.longitude,
        };
        const res = await axios.post(endPoint, payload, { headers });
        setJobs(res.data);
      } catch (error) {
        console.log("Error fetching nearby jobs:", error.message);
      }
    };
    fetchNearbyJobs();
  }, [userData]);

  const createGoogleMapsLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const shareJobDetails = async (job) => {
    try {
      const message = `
        Share Details:
        - Name: ${job.name}
        - Branch: ${job.code}
        - Location: ${job.address}
        - Distance: ${job.geo_tolerance_radius_mtr} m
        - Address: ${job.address}
        - Google Maps Link: ${createGoogleMapsLink(job.latitude, job.longitude)}
      `;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing job details:", error);
    }
  };

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const endPoint = `${base_url}/hrm/attendance/${userData?.user_id}/${userData?.branchid?.companyid}/`;
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };
        const res = await axios.get(endPoint, { headers });
        setShiftData(res.data);
      } catch (error) {
        console.log("Error fetching shift details:", error);
      }
    };
    fetchShiftData();
  }, []);

  useEffect(() => {
    const fetchShiftDetails = async () => {
      try {
        const endpoint = `${base_url}/hrm/user_company_details/${userData?.user_id}/${userData?.branchid?.companyid}/`;
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };
        const res = await axios.get(endpoint, { headers });
        setShiftDetails(res.data);
      } catch (error) {
        console.log("Error fetching shift details:", error);
      }
    };
    fetchShiftDetails();
  }, [shiftDetails, userData]);

  useEffect(() => {
    const fetchCmpBranchDetails = async () => {
      try {
        const endpoint = `${base_url}/core/userbranch_cmp_branch_list/${userData?.user_id}/`;
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };
        const res = await axios.get(endpoint, { headers });
        setCmpBranchList(res.data);
      } catch (error) {
        console.log("Error fetching company branch details:", error);
      }
    };

    fetchCmpBranchDetails();
  }, [cmpBranchList, userData]);

  const checkIn = async (id) => {
    try {
      const endPoint = `${base_url}/hrm/hrm_user_attendance/12/76/`; //${userData?.user_id}
      const headers = {
        Authorization: `Token ${userData?.token}`,
      };
      const payload = {
        user_date_time: "2025-05-01T13:00:00Z",
        user_latitude: location.coords.latitude, //13.09997989105245,
        user_longitude: location.coords.longitude, //80.29011704834728,
        master_location: id,
        attendance_status: "present",
        reason: 98,
        reason_notes: "Heavy traffic on the way",
        device_via: "finger_print",
        work_place: "office",
        createvia: null,
      };
      const res = await axios.post(endPoint, payload, { headers });
      Alert.alert(res.data.message);
    } catch (error) {
      console.log("Error check in: ", error);
    }
  };

  const handleCheckIn = async (job) => {
    const distanceDifference =
      job.distance_meters - job.geo_tolerance_radius_mtr;

    if (job.checkin === false) {
      Alert.alert(
        "Check-In Alert",
        `Please move closer by ${Math.round(
          distanceDifference
        )} meters to check in.`
      );
    } else {
      try {
        await checkIn(job.id);
        setCheckInStatus((prevStatus) => ({
          ...prevStatus,
          [job.id]: !prevStatus[job.id],
        }));
      } catch (error) {
        console.error("Error during check-in:", error);
        Alert.alert("Error", "Failed to check in. Please try again.");
      }
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("userBranch").then((userBranch) => {
      console.log("userBranch", userBranch);
    });
  }, []);

  // console.log(
  //   "user coords",
  //   location.coords.latitude,
  //   location.coords.longitude
  // );
  // AsyncStorage.removeItem("userData");
  // console.log("jobs", jobs.datas[3].latitude, jobs.datas[3].longitude);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <View
        style={{ backgroundColor: "#2563EB", width: width, height: "26%" }}
      />
      {/* Section Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: "3%",
          width: width,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF29",
              height: 44,
              width: 44,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg
              width="18"
              height="21"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.54 20.351L8.61 20.391L8.638 20.407C8.74903 20.467 8.87327 20.4985 8.9995 20.4985C9.12573 20.4985 9.24997 20.467 9.361 20.407L9.389 20.392L9.46 20.351C9.85112 20.1191 10.2328 19.8716 10.604 19.609C11.5651 18.9305 12.463 18.1667 13.287 17.327C15.231 15.337 17.25 12.347 17.25 8.5C17.25 6.31196 16.3808 4.21354 14.8336 2.66637C13.2865 1.11919 11.188 0.25 9 0.25C6.81196 0.25 4.71354 1.11919 3.16637 2.66637C1.61919 4.21354 0.75 6.31196 0.75 8.5C0.75 12.346 2.77 15.337 4.713 17.327C5.53664 18.1667 6.43427 18.9304 7.395 19.609C7.76657 19.8716 8.14854 20.1191 8.54 20.351ZM9 11.5C9.79565 11.5 10.5587 11.1839 11.1213 10.6213C11.6839 10.0587 12 9.29565 12 8.5C12 7.70435 11.6839 6.94129 11.1213 6.37868C10.5587 5.81607 9.79565 5.5 9 5.5C8.20435 5.5 7.44129 5.81607 6.87868 6.37868C6.31607 6.94129 6 7.70435 6 8.5C6 9.29565 6.31607 10.0587 6.87868 10.6213C7.44129 11.1839 8.20435 11.5 9 11.5Z"
                fill="white"
              />
            </Svg>
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                color: "#FFFFFF99",
              }}
            >
              Location
            </Text>
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                color: "white",
                width: 250,
              }}
            >
              {address || "Fetching Location..."}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("notifications")}
          style={{
            backgroundColor: "#FFFFFF29",
            height: 44,
            width: 44,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              position: "absolute",
              backgroundColor: "red",
              height: 8,
              width: 8,
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
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.25022 7C3.25022 5.20979 3.96138 3.4929 5.22725 2.22703C6.49312 0.961159 8.21001 0.25 10.0002 0.25C11.7904 0.25 13.5073 0.961159 14.7732 2.22703C16.0391 3.4929 16.7502 5.20979 16.7502 7V7.75C16.7502 9.873 17.5502 11.807 18.8682 13.27C18.9503 13.361 19.0089 13.4707 19.0388 13.5896C19.0686 13.7084 19.0689 13.8328 19.0396 13.9518C19.0103 14.0708 18.9523 14.1808 18.8707 14.2722C18.789 14.3636 18.6862 14.4335 18.5712 14.476C17.0272 15.046 15.4112 15.466 13.7402 15.719C13.7778 16.2331 13.7091 16.7495 13.5381 17.2359C13.3672 17.7222 13.0979 18.1681 12.7469 18.5457C12.396 18.9233 11.9709 19.2245 11.4983 19.4304C11.0257 19.6364 10.5157 19.7427 10.0002 19.7427C9.4847 19.7427 8.97472 19.6364 8.50213 19.4304C8.02954 19.2245 7.60448 18.9233 7.25351 18.5457C6.90254 18.1681 6.63319 17.7222 6.46229 17.2359C6.29138 16.7495 6.22259 16.2331 6.26022 15.719C4.61187 15.4692 2.99321 15.0524 1.42922 14.475C1.31435 14.4326 1.21161 14.3627 1.12998 14.2715C1.04834 14.1802 0.990294 14.0703 0.960898 13.9515C0.931503 13.8326 0.931657 13.7084 0.961346 13.5896C0.991035 13.4708 1.04936 13.3611 1.13122 13.27C2.49802 11.7567 3.2533 9.78919 3.25022 7.75V7ZM7.75222 15.9C7.73942 16.2032 7.7881 16.5058 7.8953 16.7897C8.00251 17.0736 8.16603 17.3329 8.37604 17.5519C8.58605 17.771 8.83819 17.9453 9.11731 18.0644C9.39643 18.1835 9.69676 18.2448 10.0002 18.2448C10.3037 18.2448 10.604 18.1835 10.8831 18.0644C11.1622 17.9453 11.4144 17.771 11.6244 17.5519C11.8344 17.3329 11.9979 17.0736 12.1051 16.7897C12.2123 16.5058 12.261 16.2032 12.2482 15.9C10.7526 16.0347 9.24786 16.0347 7.75222 15.9Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      {/* Username */}
      <View style={{ position: "absolute", top: "13%", left: "5%" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() => setCmpModalVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              backgroundColor: "#FFFFFF29",
              borderRadius: 8,
              width: 58,
              height: 38,
            }}
          >
            <Svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 0.25C1.80109 0.25 1.61032 0.329018 1.46967 0.46967C1.32902 0.610322 1.25 0.801088 1.25 1C1.25 1.19891 1.32902 1.38968 1.46967 1.53033C1.61032 1.67098 1.80109 1.75 2 1.75V18.25H1.25C1.05109 18.25 0.860322 18.329 0.71967 18.4697C0.579018 18.6103 0.5 18.8011 0.5 19C0.5 19.1989 0.579018 19.3897 0.71967 19.5303C0.860322 19.671 1.05109 19.75 1.25 19.75H14V1.75C14.1989 1.75 14.3897 1.67098 14.5303 1.53033C14.671 1.38968 14.75 1.19891 14.75 1C14.75 0.801088 14.671 0.610322 14.5303 0.46967C14.3897 0.329018 14.1989 0.25 14 0.25H2ZM5.75 17.5V15.25C5.75 15.0511 5.82902 14.8603 5.96967 14.7197C6.11032 14.579 6.30109 14.5 6.5 14.5H9.5C9.69891 14.5 9.88968 14.579 10.0303 14.7197C10.171 14.8603 10.25 15.0511 10.25 15.25V17.5C10.25 17.6989 10.171 17.8897 10.0303 18.0303C9.88968 18.171 9.69891 18.25 9.5 18.25H6.5C6.30109 18.25 6.11032 18.171 5.96967 18.0303C5.82902 17.8897 5.75 17.6989 5.75 17.5ZM5 4.75C5 4.55109 5.07902 4.36032 5.21967 4.21967C5.36032 4.07902 5.55109 4 5.75 4H6.5C6.69891 4 6.88968 4.07902 7.03033 4.21967C7.17098 4.36032 7.25 4.55109 7.25 4.75C7.25 4.94891 7.17098 5.13968 7.03033 5.28033C6.88968 5.42098 6.69891 5.5 6.5 5.5H5.75C5.55109 5.5 5.36032 5.42098 5.21967 5.28033C5.07902 5.13968 5 4.94891 5 4.75ZM5.75 7C5.55109 7 5.36032 7.07902 5.21967 7.21967C5.07902 7.36032 5 7.55109 5 7.75C5 7.94891 5.07902 8.13968 5.21967 8.28033C5.36032 8.42098 5.55109 8.5 5.75 8.5H6.5C6.69891 8.5 6.88968 8.42098 7.03033 8.28033C7.17098 8.13968 7.25 7.94891 7.25 7.75C7.25 7.55109 7.17098 7.36032 7.03033 7.21967C6.88968 7.07902 6.69891 7 6.5 7H5.75ZM5 10.75C5 10.5511 5.07902 10.3603 5.21967 10.2197C5.36032 10.079 5.55109 10 5.75 10H6.5C6.69891 10 6.88968 10.079 7.03033 10.2197C7.17098 10.3603 7.25 10.5511 7.25 10.75C7.25 10.9489 7.17098 11.1397 7.03033 11.2803C6.88968 11.421 6.69891 11.5 6.5 11.5H5.75C5.55109 11.5 5.36032 11.421 5.21967 11.2803C5.07902 11.1397 5 10.9489 5 10.75ZM9.5 4C9.30109 4 9.11032 4.07902 8.96967 4.21967C8.82902 4.36032 8.75 4.55109 8.75 4.75C8.75 4.94891 8.82902 5.13968 8.96967 5.28033C9.11032 5.42098 9.30109 5.5 9.5 5.5H10.25C10.4489 5.5 10.6397 5.42098 10.7803 5.28033C10.921 5.13968 11 4.94891 11 4.75C11 4.55109 10.921 4.36032 10.7803 4.21967C10.6397 4.07902 10.4489 4 10.25 4H9.5ZM8.75 7.75C8.75 7.55109 8.82902 7.36032 8.96967 7.21967C9.11032 7.07902 9.30109 7 9.5 7H10.25C10.4489 7 10.6397 7.07902 10.7803 7.21967C10.921 7.36032 11 7.55109 11 7.75C11 7.94891 10.921 8.13968 10.7803 8.28033C10.6397 8.42098 10.4489 8.5 10.25 8.5H9.5C9.30109 8.5 9.11032 8.42098 8.96967 8.28033C8.82902 8.13968 8.75 7.94891 8.75 7.75ZM9.5 10C9.30109 10 9.11032 10.079 8.96967 10.2197C8.82902 10.3603 8.75 10.5511 8.75 10.75C8.75 10.9489 8.82902 11.1397 8.96967 11.2803C9.11032 11.421 9.30109 11.5 9.5 11.5H10.25C10.4489 11.5 10.6397 11.421 10.7803 11.2803C10.921 11.1397 11 10.9489 11 10.75C11 10.5511 10.921 10.3603 10.7803 10.2197C10.6397 10.079 10.4489 10 10.25 10H9.5ZM15.5 4.75V19.75H20.75C20.9489 19.75 21.1397 19.671 21.2803 19.5303C21.421 19.3897 21.5 19.1989 21.5 19C21.5 18.8011 21.421 18.6103 21.2803 18.4697C21.1397 18.329 20.9489 18.25 20.75 18.25H20V6.25C20.1989 6.25 20.3897 6.17098 20.5303 6.03033C20.671 5.88968 20.75 5.69891 20.75 5.5C20.75 5.30109 20.671 5.11032 20.5303 4.96967C20.3897 4.82902 20.1989 4.75 20 4.75H15.5ZM17 9.25C17 9.05109 17.079 8.86032 17.2197 8.71967C17.3603 8.57902 17.5511 8.5 17.75 8.5H17.758C17.9569 8.5 18.1477 8.57902 18.2883 8.71967C18.429 8.86032 18.508 9.05109 18.508 9.25V9.258C18.508 9.45691 18.429 9.64768 18.2883 9.78833C18.1477 9.92898 17.9569 10.008 17.758 10.008H17.75C17.5511 10.008 17.3603 9.92898 17.2197 9.78833C17.079 9.64768 17 9.45691 17 9.258V9.25ZM17.75 11.5C17.5511 11.5 17.3603 11.579 17.2197 11.7197C17.079 11.8603 17 12.0511 17 12.25V12.258C17 12.672 17.336 13.008 17.75 13.008H17.758C17.9569 13.008 18.1477 12.929 18.2883 12.7883C18.429 12.6477 18.508 12.4569 18.508 12.258V12.25C18.508 12.0511 18.429 11.8603 18.2883 11.7197C18.1477 11.579 17.9569 11.5 17.758 11.5H17.75ZM17 15.25C17 15.0511 17.079 14.8603 17.2197 14.7197C17.3603 14.579 17.5511 14.5 17.75 14.5H17.758C17.9569 14.5 18.1477 14.579 18.2883 14.7197C18.429 14.8603 18.508 15.0511 18.508 15.25V15.258C18.508 15.4569 18.429 15.6477 18.2883 15.7883C18.1477 15.929 17.9569 16.008 17.758 16.008H17.75C17.5511 16.008 17.3603 15.929 17.2197 15.7883C17.079 15.6477 17 15.4569 17 15.258V15.25Z"
                fill="white"
              />
            </Svg>
            <Svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M11 1.5L6 6.5L1 1.5"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <View>
            <Text
              style={{
                color: "white",
                fontFamily: "Inter-Regular",
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              Welcome, {userData?.username}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                color: "#FFFFFF99",
              }}
            >
              {selectedBranch?.cmp_shortname} - {selectedBranch?.branch_name}
            </Text>
          </View>
        </View>
      </View>
      {/* Duty Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          flex: 1,
          borderRadius: 20,
          width: "90%",
          height: activeTab === "home" ? "37%" : "32%",
          alignSelf: "center",
          position: "absolute",
          top: "20%",
          elevation: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#2563EB1F",
            borderRadius: 70,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 25,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("office")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor:
                activeTab === "office" ? "#2563EB" : "transparent",
              padding: 12,
              borderRadius: 70,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.25 1.5C2.11739 1.5 1.99021 1.55268 1.89645 1.64645C1.80268 1.74021 1.75 1.86739 1.75 2C1.75 2.13261 1.80268 2.25979 1.89645 2.35355C1.99021 2.44732 2.11739 2.5 2.25 2.5V13.5H1.75C1.61739 13.5 1.49021 13.5527 1.39645 13.6464C1.30268 13.7402 1.25 13.8674 1.25 14C1.25 14.1326 1.30268 14.2598 1.39645 14.3536C1.49021 14.4473 1.61739 14.5 1.75 14.5H10.25V2.5C10.3826 2.5 10.5098 2.44732 10.6036 2.35355C10.6973 2.25979 10.75 2.13261 10.75 2C10.75 1.86739 10.6973 1.74021 10.6036 1.64645C10.5098 1.55268 10.3826 1.5 10.25 1.5H2.25ZM4.75 13V11.5C4.75 11.3674 4.80268 11.2402 4.89645 11.1464C4.99021 11.0527 5.11739 11 5.25 11H7.25C7.38261 11 7.50979 11.0527 7.60355 11.1464C7.69732 11.2402 7.75 11.3674 7.75 11.5V13C7.75 13.1326 7.69732 13.2598 7.60355 13.3536C7.50979 13.4473 7.38261 13.5 7.25 13.5H5.25C5.11739 13.5 4.99021 13.4473 4.89645 13.3536C4.80268 13.2598 4.75 13.1326 4.75 13ZM4.25 4.5C4.25 4.36739 4.30268 4.24021 4.39645 4.14645C4.49021 4.05268 4.61739 4 4.75 4H5.25C5.38261 4 5.50979 4.05268 5.60355 4.14645C5.69732 4.24021 5.75 4.36739 5.75 4.5C5.75 4.63261 5.69732 4.75979 5.60355 4.85355C5.50979 4.94732 5.38261 5 5.25 5H4.75C4.61739 5 4.49021 4.94732 4.39645 4.85355C4.30268 4.75979 4.25 4.63261 4.25 4.5ZM4.75 6C4.61739 6 4.49021 6.05268 4.39645 6.14645C4.30268 6.24022 4.25 6.36739 4.25 6.5C4.25 6.63261 4.30268 6.75979 4.39645 6.85355C4.49021 6.94732 4.61739 7 4.75 7H5.25C5.38261 7 5.50979 6.94732 5.60355 6.85355C5.69732 6.75979 5.75 6.63261 5.75 6.5C5.75 6.36739 5.69732 6.24022 5.60355 6.14645C5.50979 6.05268 5.38261 6 5.25 6H4.75ZM4.25 8.5C4.25 8.36739 4.30268 8.24022 4.39645 8.14645C4.49021 8.05268 4.61739 8 4.75 8H5.25C5.38261 8 5.50979 8.05268 5.60355 8.14645C5.69732 8.24022 5.75 8.36739 5.75 8.5C5.75 8.63261 5.69732 8.75979 5.60355 8.85355C5.50979 8.94732 5.38261 9 5.25 9H4.75C4.61739 9 4.49021 8.94732 4.39645 8.85355C4.30268 8.75979 4.25 8.63261 4.25 8.5ZM7.25 4C7.11739 4 6.99022 4.05268 6.89645 4.14645C6.80268 4.24021 6.75 4.36739 6.75 4.5C6.75 4.63261 6.80268 4.75979 6.89645 4.85355C6.99022 4.94732 7.11739 5 7.25 5H7.75C7.88261 5 8.00979 4.94732 8.10355 4.85355C8.19732 4.75979 8.25 4.63261 8.25 4.5C8.25 4.36739 8.19732 4.24021 8.10355 4.14645C8.00979 4.05268 7.88261 4 7.75 4H7.25ZM6.75 6.5C6.75 6.36739 6.80268 6.24022 6.89645 6.14645C6.99022 6.05268 7.11739 6 7.25 6H7.75C7.88261 6 8.00979 6.05268 8.10355 6.14645C8.19732 6.24022 8.25 6.36739 8.25 6.5C8.25 6.63261 8.19732 6.75979 8.10355 6.85355C8.00979 6.94732 7.88261 7 7.75 7H7.25C7.11739 7 6.99022 6.94732 6.89645 6.85355C6.80268 6.75979 6.75 6.63261 6.75 6.5ZM7.25 8C7.11739 8 6.99022 8.05268 6.89645 8.14645C6.80268 8.24022 6.75 8.36739 6.75 8.5C6.75 8.63261 6.80268 8.75979 6.89645 8.85355C6.99022 8.94732 7.11739 9 7.25 9H7.75C7.88261 9 8.00979 8.94732 8.10355 8.85355C8.19732 8.75979 8.25 8.63261 8.25 8.5C8.25 8.36739 8.19732 8.24022 8.10355 8.14645C8.00979 8.05268 7.88261 8 7.75 8H7.25ZM11.25 4.5V14.5H14.75C14.8826 14.5 15.0098 14.4473 15.1036 14.3536C15.1973 14.2598 15.25 14.1326 15.25 14C15.25 13.8674 15.1973 13.7402 15.1036 13.6464C15.0098 13.5527 14.8826 13.5 14.75 13.5H14.25V5.5C14.3826 5.5 14.5098 5.44732 14.6036 5.35355C14.6973 5.25979 14.75 5.13261 14.75 5C14.75 4.86739 14.6973 4.74021 14.6036 4.64645C14.5098 4.55268 14.3826 4.5 14.25 4.5H11.25ZM12.25 7.5C12.25 7.36739 12.3027 7.24022 12.3964 7.14645C12.4902 7.05268 12.6174 7 12.75 7H12.7553C12.8879 7 13.0151 7.05268 13.1089 7.14645C13.2027 7.24022 13.2553 7.36739 13.2553 7.5V7.50533C13.2553 7.63794 13.2027 7.76512 13.1089 7.85889C13.0151 7.95266 12.8879 8.00533 12.7553 8.00533H12.75C12.6174 8.00533 12.4902 7.95266 12.3964 7.85889C12.3027 7.76512 12.25 7.63794 12.25 7.50533V7.5ZM12.75 9C12.6174 9 12.4902 9.05268 12.3964 9.14645C12.3027 9.24022 12.25 9.36739 12.25 9.5V9.50533C12.25 9.78133 12.474 10.0053 12.75 10.0053H12.7553C12.8879 10.0053 13.0151 9.95265 13.1089 9.85889C13.2027 9.76512 13.2553 9.63794 13.2553 9.50533V9.5C13.2553 9.36739 13.2027 9.24022 13.1089 9.14645C13.0151 9.05268 12.8879 9 12.7553 9H12.75ZM12.25 11.5C12.25 11.3674 12.3027 11.2402 12.3964 11.1464C12.4902 11.0527 12.6174 11 12.75 11H12.7553C12.8879 11 13.0151 11.0527 13.1089 11.1464C13.2027 11.2402 13.2553 11.3674 13.2553 11.5V11.5053C13.2553 11.6379 13.2027 11.7651 13.1089 11.8589C13.0151 11.9527 12.8879 12.0053 12.7553 12.0053H12.75C12.6174 12.0053 12.4902 11.9527 12.3964 11.8589C12.3027 11.7651 12.25 11.6379 12.25 11.5053V11.5Z"
                fill={activeTab === "office" ? "#fff" : "#2563EB"}
              />
            </Svg>
            <Text
              style={{
                marginLeft: 6,
                color: activeTab === "office" ? "#fff" : "#2563EB",
                fontWeight: "600",
              }}
            >
              Office
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (shiftData?.workfromeoffice === true) {
                setOfficeAlert(true);
              } else {
                setActiveTab("home");
              }
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: activeTab === "home" ? "#2563EB" : "transparent",
              padding: 12,
              borderRadius: 70,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M7.89679 2.56074C7.99054 2.46711 8.11762 2.41452 8.25012 2.41452C8.38263 2.41452 8.50971 2.46711 8.60346 2.56074L14.3968 8.35408C14.4429 8.40181 14.4981 8.43987 14.5591 8.46605C14.6202 8.49222 14.6858 8.50599 14.7522 8.50653C14.8186 8.50708 14.8844 8.49439 14.9458 8.46922C15.0073 8.44406 15.0631 8.4069 15.11 8.35993C15.1569 8.31297 15.194 8.25712 15.2191 8.19566C15.2442 8.1342 15.2569 8.06836 15.2562 8.00197C15.2556 7.93558 15.2418 7.86998 15.2156 7.80899C15.1894 7.748 15.1512 7.69284 15.1035 7.64674L9.31079 1.85341C9.1715 1.71412 9.00614 1.60363 8.82415 1.52824C8.64216 1.45286 8.44711 1.41406 8.25012 1.41406C8.05314 1.41406 7.85809 1.45286 7.6761 1.52824C7.49411 1.60363 7.32875 1.71412 7.18946 1.85341L1.39612 7.64674C1.34839 7.69289 1.31033 7.74808 1.28415 7.80909C1.25798 7.87011 1.24421 7.93572 1.24367 8.00211C1.24312 8.0685 1.25581 8.13434 1.28098 8.19577C1.30614 8.25721 1.3433 8.31302 1.39027 8.35994C1.43723 8.40686 1.49308 8.44396 1.55454 8.46908C1.616 8.49419 1.68184 8.50681 1.74823 8.5062C1.81462 8.50559 1.88022 8.49177 1.94121 8.46554C2.0022 8.4393 2.05736 8.40119 2.10346 8.35341L7.89679 2.56074Z"
                fill={activeTab === "home" ? "#fff" : "#2563EB"}
              />
              <Path
                d="M8.25 3.62109L13.6893 9.06043C13.7093 9.08043 13.7293 9.09909 13.75 9.11776V13.2498C13.75 13.9398 13.19 14.4998 12.5 14.4998H10.25C10.1174 14.4998 9.99022 14.4471 9.89645 14.3533C9.80268 14.2595 9.75 14.1324 9.75 13.9998V10.9998C9.75 10.8672 9.69732 10.74 9.60355 10.6462C9.50979 10.5524 9.38261 10.4998 9.25 10.4998H7.25C7.11739 10.4998 6.99022 10.5524 6.89645 10.6462C6.80268 10.74 6.75 10.8672 6.75 10.9998V13.9998C6.75 14.1324 6.69732 14.2595 6.60355 14.3533C6.50979 14.4471 6.38261 14.4998 6.25 14.4998H4C3.66848 14.4998 3.35054 14.3681 3.11612 14.1336C2.8817 13.8992 2.75 13.5813 2.75 13.2498V9.11776C2.77074 9.09921 2.79097 9.08009 2.81067 9.06043L8.25 3.62109Z"
                fill={activeTab === "home" ? "#fff" : "#2563EB"}
              />
            </Svg>
            <Text
              style={{
                marginLeft: 6,
                color: activeTab === "home" ? "#fff" : "#2563EB",
                fontWeight: "600",
              }}
            >
              Home
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 15,
            backgroundColor: "#13950F1F",
            borderRadius: 30,
            height: 27,
            width: "auto",
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 12,
              color: "#13950F",
              textTransform: "uppercase",
            }}
          >
            {shiftDetails?.shift_group?.name} - {shiftDetails?.user_shift?.name}{" "}
            Shift
          </Text>
        </View>
        {activeTab === "home" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            {isCheckedIn ? (
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  height: 44,
                  width: 148,
                  borderRadius: 47,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "#2563EB",
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text
                  style={{
                    color: "#2563EB",
                    fontFamily: "Inter-SemiBold",
                    fontSize: 16,
                  }}
                >
                  Break
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  fontFamily: "Inter-SemiBold",
                  fontSize: 18,
                  color: "#1B1B1B",
                }}
              >
                {time}
              </Text>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: isCheckedIn ? "#DD1701" : "#2563EB",
                height: 44,
                width: 148,
                borderRadius: 47,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setIsCheckedIn((prev) => !prev)}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter-Regular",
                  fontSize: 16,
                }}
              >
                {isCheckedIn ? "Check Out" : "Check In"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            height: 1,
            width: "90%",
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
            paddingHorizontal: 20,
          }}
        >
          {shiftDetails?.shift_group &&
          shiftDetails?.shift_group?.name === "Flexible" ? (
            <>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
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
                  {shiftData?.shift_start_time === null
                    ? "00:00:00"
                    : shiftData?.shift_start_time}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                    color: "#64748B",
                  }}
                >
                  Flexible HR's
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
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
            </>
          ) : (
            <>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
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
                  {shiftData?.shift_start_time}
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
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
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
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
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
            </>
          )}
        </View>
      </View>
      {/* Break Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          console.log(data);
          setModalVisible(false);
        }}
      />
      {/* Leave Modal */}
      <LeaveModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        onSubmit={(data) => {
          console.log(data);
          setLeaveModalVisible(false);
        }}
      />
      {/* work cards */}
      <ScrollView
        style={{
          marginTop: activeTab === "home" ? "65%" : "55%",
          marginBottom: 20,
        }}
      >
        {activeTab === "office" && (
          <>
            {jobs &&
              jobs.datas &&
              jobs.datas.map((job, i) => (
                <TouchableOpacity
                  disabled={job.checkin === false}
                  key={i}
                  onPress={() =>
                    navigation.navigate("details", {
                      data: {
                        code: job.code,
                        distance: `${job.geo_tolerance_radius_mtr} m`,
                        cmpName: job.name || "Unknown Location",
                        isCheckIn: isCheckIn,
                        setIsCheckIn: setIsCheckIn,
                        address: job.address,
                        latitude: job.latitude,
                        longitude: job.longitude,
                      },
                    })
                  }
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    height: "auto",
                    width: "90%",
                    borderRadius: 16,
                    padding: 16,
                    backgroundColor: "white",
                    elevation: 1,
                    marginBottom: 20,
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
                      {job.code}
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
                        {job.geo_tolerance_radius_mtr} m
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
                      {job.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "85%",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "start",
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
                            width: "94%",
                          }}
                        >
                          {job.address}
                        </Text>
                      </View>
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
                      onPress={() => shareJobDetails(job)}
                    >
                      <Svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <Path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12.2693 2.57143C12.2692 1.97372 12.481 1.39468 12.8682 0.933838C13.2553 0.472998 13.7937 0.159159 14.3907 0.0462763C14.9877 -0.0666062 15.6061 0.0285209 16.1395 0.315303C16.6729 0.602085 17.088 1.0626 17.3135 1.61769C17.539 2.17277 17.5607 2.78773 17.3749 3.35685C17.1892 3.92597 16.8075 4.41368 16.2956 4.73614C15.7837 5.0586 15.1736 5.19566 14.57 5.12375C13.9665 5.05185 13.4073 4.77547 12.9885 4.34213L5.64722 8.35237C5.75938 8.77671 5.75938 9.2222 5.64722 9.64654L12.9885 13.6568C13.4272 13.2033 14.0191 12.9227 14.6533 12.8676C15.2874 12.8125 15.9202 12.9866 16.433 13.3574C16.9459 13.7282 17.3036 14.2701 17.439 14.8816C17.5745 15.4931 17.4785 16.1322 17.1689 16.6791C16.8594 17.226 16.3575 17.6431 15.7576 17.8522C15.1576 18.0613 14.5006 18.0481 13.9098 17.8151C13.3189 17.5821 12.8349 17.1452 12.5483 16.5864C12.2617 16.0275 12.1922 15.3851 12.353 14.7795L5.01169 10.7702C4.65151 11.143 4.18591 11.4011 3.67502 11.5111C3.16413 11.6211 2.63142 11.578 2.14569 11.3874C1.65996 11.1968 1.24352 10.8674 0.950165 10.4417C0.656806 10.016 0.5 9.51363 0.5 8.99945C0.5 8.48528 0.656806 7.98291 0.950165 7.55723C1.24352 7.13156 1.65996 6.80213 2.14569 6.61149C2.63142 6.42086 3.16413 6.37777 3.67502 6.48781C4.18591 6.59784 4.65151 6.85593 5.01169 7.22875L12.353 3.21851C12.2973 3.00719 12.2691 2.78974 12.2693 2.57143Z"
                          fill="#2563EB"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>
                  {checkInStatus[job.id] ? (
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
                        onPress={() => handleCheckIn(job)}
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
                      disabled={job.checkin === false}
                      style={{
                        height: 40,
                        width: "100%",
                        borderRadius: 47,
                        backgroundColor: "#2563EB",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                        opacity: job.checkin === false ? 0.5 : 1,
                      }}
                      onPress={() => handleCheckIn(job)}
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
                </TouchableOpacity>
              ))}
          </>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
              color: "#1b1b1b",
            }}
          >
            Attendance for this Month
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#2563EB",
              height: 36,
              width: "auto",
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              flexDirection: "row",
              borderRadius: 47,
              backgroundColor: "#2563EB1F",
            }}
            onPress={() => setShowCalendar(true)}
          >
            <Text
              style={{
                color: "#2563EB",
                fontFamily: "Inter-Regular",
                textTransform: "uppercase",
              }}
            >
              {selectedMonth}
            </Text>
            <Svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.5 1.5C4.63261 1.5 4.75979 1.55268 4.85355 1.64645C4.94732 1.74021 5 1.86739 5 2V3H11V2C11 1.86739 11.0527 1.74021 11.1464 1.64645C11.2402 1.55268 11.3674 1.5 11.5 1.5C11.6326 1.5 11.7598 1.55268 11.8536 1.64645C11.9473 1.74021 12 1.86739 12 2V3H12.5C13.0304 3 13.5391 3.21071 13.9142 3.58579C14.2893 3.96086 14.5 4.46957 14.5 5V12.5C14.5 13.0304 14.2893 13.5391 13.9142 13.9142C13.5391 14.2893 13.0304 14.5 12.5 14.5H3.5C2.96957 14.5 2.46086 14.2893 2.08579 13.9142C1.71071 13.5391 1.5 13.0304 1.5 12.5V5C1.5 4.46957 1.71071 3.96086 2.08579 3.58579C2.46086 3.21071 2.96957 3 3.5 3H4V2C4 1.86739 4.05268 1.74021 4.14645 1.64645C4.24021 1.55268 4.36739 1.5 4.5 1.5ZM13.5 7.5C13.5 7.23478 13.3946 6.98043 13.2071 6.79289C13.0196 6.60536 12.7652 6.5 12.5 6.5H3.5C3.23478 6.5 2.98043 6.60536 2.79289 6.79289C2.60536 6.98043 2.5 7.23478 2.5 7.5V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5H12.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5V7.5Z"
                fill="#2563EB"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 15,
          }}
        >
          <View
            style={{
              height: 76,
              width: 114,
              backgroundColor: "#13950F14",
              borderTopColor: "#13950F",
              borderTopWidth: 3,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              Present
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#13950F",
                fontSize: 18,
                alignSelf: "flex-end",
              }}
            >
              13
            </Text>
          </View>
          <View
            style={{
              height: 76,
              width: 114,
              backgroundColor: "#DD170114",
              borderTopColor: "#DD1701",
              borderTopWidth: 3,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              Absent
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#DD1701",
                fontSize: 18,
                alignSelf: "flex-end",
              }}
            >
              02
            </Text>
          </View>
          <View
            style={{
              height: 76,
              width: 114,
              backgroundColor: "#F09E0714",
              borderTopColor: "#F09E07",
              borderTopWidth: 3,
              borderRadius: 6,
              padding: 10,
            }}
          >
            <Text style={{ fontFamily: "Inter-Bold", color: "#1b1b1b" }}>
              Late In
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: "#F09E07",
                fontSize: 18,
                alignSelf: "flex-end",
              }}
            >
              04
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: "92%",
            marginTop: 20,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
            backgroundColor: "#2563EB0F",
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: "#2563EB",
            borderRadius: 47,
            height: 44,
          }}
          onPress={() => setLeaveModalVisible(true)}
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
              d="M9 0.75C9.19891 0.75 9.38968 0.829018 9.53033 0.96967C9.67098 1.11032 9.75 1.30109 9.75 1.5V8.25H16.5C16.6989 8.25 16.8897 8.32902 17.0303 8.46967C17.171 8.61032 17.25 8.80109 17.25 9C17.25 9.19891 17.171 9.38968 17.0303 9.53033C16.8897 9.67098 16.6989 9.75 16.5 9.75H9.75V16.5C9.75 16.6989 9.67098 16.8897 9.53033 17.0303C9.38968 17.171 9.19891 17.25 9 17.25C8.80109 17.25 8.61032 17.171 8.46967 17.0303C8.32902 16.8897 8.25 16.6989 8.25 16.5V9.75H1.5C1.30109 9.75 1.11032 9.67098 0.96967 9.53033C0.829018 9.38968 0.75 9.19891 0.75 9C0.75 8.80109 0.829018 8.61032 0.96967 8.46967C1.11032 8.32902 1.30109 8.25 1.5 8.25H8.25V1.5C8.25 1.30109 8.32902 1.11032 8.46967 0.96967C8.61032 0.829018 8.80109 0.75 9 0.75Z"
              fill="#2563EB"
            />
          </Svg>
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              color: "#2563EB",
              fontSize: 16,
            }}
          >
            Leave Request
          </Text>
        </TouchableOpacity>
        {showCalendar && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowCalendar(false);
              if (selectedDate) {
                const shortMonth = selectedDate.toLocaleString("default", {
                  month: "short",
                });
                setSelectedMonth(shortMonth);
              }
            }}
          />
        )}
      </ScrollView>
      {/* Work from office alert */}
      <Modal animationType="slide" transparent={true} visible={officeAlert}>
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
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                textAlign: "center",
                fontSize: 22,
                color: "#1b1b1b",
              }}
            >
              Alert
            </Text>
            <Text
              style={{
                color: "#1b1b1b",
                fontFamily: "Inter-Regular",
                marginTop: 10,
              }}
            >
              {shiftData?.office_work_status_message}
            </Text>
            <Text
              style={{
                fontSize: 14,
                marginTop: 20,
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              Reason
            </Text>
            <Dropdown
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 10,
                height: 50,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#E2E8F0",
              }}
              placeholderStyle={{ color: "#64748B" }}
              selectedTextStyle={{ color: "#111827" }}
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={selectedValue}
              onChange={(item) => setSelectedValue(item.value)}
            />
            <Text
              style={{
                fontSize: 14,
                marginBottom: 5,
                color: "#64748B",
                fontFamily: "Inter-Regular",
                marginTop: 10,
              }}
            >
              Note
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                height: 120,
                padding: 10,
                textAlignVertical: "top",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#E2E8F0",
              }}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
            />
            {/* Cancel & Submit Btn */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10%",
              }}
            >
              <TouchableOpacity
                onPress={() => setOfficeAlert(false)}
                style={{
                  height: 44,
                  width: "48%",
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
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  height: 44,
                  width: "48%",
                  borderRadius: 47,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", color: "#fff" }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Company Branch Modal */}
      <Modal animationType="slide" transparent={true} visible={cmpModalVisible}>
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
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                textAlign: "center",
                fontSize: 22,
                color: "#1b1b1b",
              }}
            >
              Company Branches
            </Text>
            <FlatList
              data={cmpBranchList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedBranch(item);
                    setCmpModalVisible(false);
                    AsyncStorage.setItem("userBranch", JSON.stringify(item));
                  }}
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#E2E8F0",
                    backgroundColor:
                      selectedBranch?.id === item.id ? "#2563EB1F" : "white",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Regular",
                      color: "#1B1B1B",
                      fontSize: 16,
                    }}
                  >
                    {item.cmp_shortname} - {item.branch_name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    color: "#1B1B1B99",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No branches available
                </Text>
              )}
            />
            <TouchableOpacity
              onPress={() => setCmpModalVisible(false)}
              style={{
                height: 44,
                width: "100%",
                borderRadius: 47,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", color: "#fff" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
