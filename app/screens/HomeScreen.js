import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ScrollView,
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
import getAddressFromCoordinates from "../utils/getAddressFromCoordinates";

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
  const [jobAddresses, setJobAddresses] = useState({});

  useEffect(() => {
    if (jobs && jobs.distances) {
      jobs.distances.forEach(async (job) => {
        if (job.coordinates?.latitude && job.coordinates?.longitude) {
          const address = await getAddressFromCoordinates(
            job.coordinates.latitude,
            job.coordinates.longitude
          );
          setJobAddresses((prev) => ({
            ...prev,
            [job.workId || `Job-${job.id}`]: address,
          }));
        }
      });
    }
  }, [jobs]);

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
        setUserData(JSON.parse(storedData));
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
      try {
        const endPoint = `${base_url}hrm/latitude_longitude/14/`; //userData?.user_id
        const payload = {
          user_latitude: 14.0827, //currentLocation.coords.latitude
          user_longitude: 80.2707, //currentLocation.coords.longitude
        };
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };
        const res = await axios.post(endPoint, payload, { headers });
        setJobs(res.data);
      } catch (error) {
        console.log("Error fetching nearby jobs:", error.message);
      }
    };
    fetchNearbyJobs();
  }, [userData]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <View
        style={{ backgroundColor: "#2563EB", width: width, height: "26%" }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          position: "absolute",
          top: "3%",
          width: "100%",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            width: "65%",
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
              }}
            >
              {address}
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
            onPress={() => setActiveTab("home")}
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
            width: 120,
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
            General Shift
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
          <View
            style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
          >
            <MaterialIcons name="timer" size={24} color="#2563EB" />
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
            style={{ alignItems: "center", justifyContent: "center", gap: 2 }}
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
        </View>
      </View>
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
        style={{
          marginTop: activeTab === "home" ? "65%" : "55%",
          marginBottom: 20,
        }}
      >
        {activeTab === "office" && (
          <>
            {jobs &&
              jobs.distances &&
              jobs.distances.map((job, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() =>
                    navigation.navigate("details", {
                      data: {
                        workId: job.workId || `CHE-${i + 1}`,
                        distance: `${job.distance_km} KM`,
                        cmpName: job.location || "Unknown Location",
                        isCheckIn: job.isCheckIn || false,
                        setIsCheckIn: (value) => {
                          const updatedJobs = [...jobs.distances];
                          updatedJobs[i].isCheckIn = value;
                          setJobs({ ...jobs, distances: updatedJobs });
                        },
                        address:
                          jobAddresses[job.workId || `CHE-${job.id}`] ||
                          "Fetching address...",
                      },
                    })
                  }
                  style={{
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    height: 200,
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
                      {job.workId || `CHE-${i + 1}`}
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
                        {job.distance_km} KM
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
                      {job.location}
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
                        alignItems: "center",
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
                        }}
                      >
                        {jobAddresses[job.workId || `CHE-${job.id}`] ||
                          "Fetching address..."}
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
                      onPress={() => {
                        // Share functionality or other actions
                      }}
                    >
                      <Fontisto name="share" size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                  {job.isCheckIn ? (
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
                        onPress={() => {
                          setModalVisible(true);
                        }}
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
                        onPress={() => {
                          const updatedJobs = [...jobs.distances];
                          updatedJobs[i].isCheckIn = false;
                          setJobs({ ...jobs, distances: updatedJobs });
                        }}
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
                      onPress={() => {
                        const updatedJobs = [...jobs.distances];
                        updatedJobs[i].isCheckIn = true;
                        setJobs({ ...jobs, distances: updatedJobs });
                      }}
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
    </View>
  );
};

export default HomeScreen;
