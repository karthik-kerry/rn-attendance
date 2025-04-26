import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AntDesign from "@expo/vector-icons/AntDesign";
import CustomModal from "../components/CustomModal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { base_url } from "../constant/api";
import axios from "axios";
import haversine from "haversine-distance";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [jobs, setJobs] = useState(null);
  const [shiftData, setShiftData] = useState(null);
  const [officeAlert, setOfficeAlert] = useState(false);

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
        const endPoint = `${base_url}hrm/user_company_details/14/78/`; //${userData?.user_id}
        const headers = {
          Authorization: `Token b9c5f914363bbac9070f9f8b2849e527fa47f726`, //${userData?.token}
        };
        const res = await axios.get(endPoint, { headers });
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
    const fetchShiftDetails = async () => {
      try {
        const endPoint = `${base_url}hrm/attendance/14/78/`;
        const headers = {
          Authorization: `Token b9c5f914363bbac9070f9f8b2849e527fa47f726`, //${userData?.token}
        };
        const res = await axios.get(endPoint, { headers });
        setShiftData(res.data);
      } catch (error) {
        console.log("Error fetching shift details:", error);
      }
    };
    fetchShiftDetails();
  }, []);

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
            <Ionicons name="location-sharp" size={24} color="white" />
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
          <Fontisto name="bell-alt" size={22} color="white" />
        </TouchableOpacity>
      </View>
      {/* Username */}
      <Text
        style={{
          position: "absolute",
          top: "13%",
          left: "5%",
          color: "white",
          fontFamily: "Inter-Regular",
          fontWeight: "500",
          fontSize: 24,
        }}
      >
        Welcome, {userData?.username}
      </Text>
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
            <MaterialCommunityIcons
              name="office-building"
              size={18}
              color={activeTab === "office" ? "#fff" : "#2563EB"}
            />
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
            <Ionicons
              name="home"
              size={18}
              color={activeTab === "home" ? "#fff" : "#2563EB"}
            />
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
            {jobs?.shift_group?.name} - {jobs?.user_shift?.name} Shift
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
          {jobs?.shift_group && jobs?.shift_group?.name === "Flexible" ? (
            <>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <MaterialIcons name="timer" size={24} color="#2563EB" />
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
                <MaterialIcons name="timer" size={24} color="#2563EB" />
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
                <MaterialIcons name="timer" size={24} color="#2563EB" />
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
                <MaterialIcons name="timer" size={24} color="#2563EB" />
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
                <MaterialIcons name="timer" size={24} color="#2563EB" />
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
      {/* work cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginTop: activeTab === "home" ? "65%" : "55%",
          marginBottom: 20,
        }}
      >
        {activeTab === "office" && (
          <>
            {jobs &&
              jobs.locations &&
              jobs.locations
                .filter((job) => {
                  if (!location || !job.latitude || !job.longitude)
                    return false;

                  const userCoords = {
                    latitude: 13.043784235701205, //location.coords.latitude,
                    longitude: 80.269433297331, //location.coords.longitude,
                  };
                  const jobCoords = {
                    latitude: job.latitude,
                    longitude: job.longitude,
                  };
                  const distance = haversine(userCoords, jobCoords);

                  return distance <= job.geo_tolerance_radius_mtr;
                })
                .map((job, i) => (
                  <TouchableOpacity
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
                          <FontAwesome6
                            name="location-dot"
                            size={16}
                            color="#64748B"
                          />
                          <Text
                            style={{
                              fontFamily: "Inter-Regular",
                              color: "#1B1B1B99",
                              width: "96%",
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
                        <Fontisto name="share" size={16} color="#2563EB" />
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
            <Ionicons name="calendar-clear" size={16} color="#2563EB" />
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
          onPress={() => {}}
        >
          <AntDesign name="plus" size={24} color="#2563EB" />
          <Text
            style={{
              fontFamily: "Inter-SemiBold",
              color: "#2563EB",
              fontSize: 16,
            }}
          >
            Request
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
                  width: "100%",
                  borderRadius: 47,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-Regular", color: "#fff" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
