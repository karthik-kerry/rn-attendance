import {
  View,
  StatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { base_url } from "../../constant/api";
import axios from "axios";

const JobListing = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");

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

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchJobList = async () => {
      setIsLoading(true);

      try {
        const endpoint = `${base_url}/career/career_jobposting_crud/${userData?.user_id}/${userData?.branchid?.companyid}/?branch=${userData?.branchid?.branchid}`;
        const headers = {
          Authorization: `Token ${userData?.token}`,
        };

        const res = await axios.get(endpoint, { headers });
        setJobs([...res.data].reverse());
      } catch (error) {
        console.log("Error loading job posting list:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (userData) fetchJobList();
  }, [userData]);

  const filteredJobs = jobs.filter(
    (job) =>
      job?.job_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      job?.department_name?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Job List" navigate={() => navigation.goBack()} />

      {/* Search Bar */}

      <View style={{ marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 16,
            borderRadius: 222,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            height: 44,
          }}
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: 8 }}
          >
            <Path
              d="M10.5 18C15.1944 18 19 14.1944 19 9.5C19 4.80558 15.1944 1 10.5 1C5.80558 1 2 4.80558 2 9.5C2 14.1944 5.80558 18 10.5 18Z"
              stroke="#A0AEC0"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M22 22L17 17"
              stroke="#A0AEC0"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={{
              flex: 1,
              fontSize: 16,
              color: "#000000",
              paddingVertical: 10,
            }}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      {isLoading ? (
        <SkeletonPlaceholder>
          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={{
                marginBottom: 20,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <View style={{ width: 150, height: 20, borderRadius: 4 }} />
              <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                <View style={{ width: 60, height: 20, borderRadius: 10 }} />
                <View style={{ width: 80, height: 20, borderRadius: 10 }} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                <View style={{ width: 120, height: 20, borderRadius: 10 }} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                <View style={{ width: 100, height: 20, borderRadius: 10 }} />
              </View>
            </View>
          ))}
        </SkeletonPlaceholder>
      ) : (
        <ScrollView
          style={{ marginVertical: 20 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20 }}
        >
          {filteredJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => navigation.navigate("jobDetail", { job })}
            >
              <View key={job.id} style={{ flexDirection: "column" }}>
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 12,
                    borderStyle: "solid",
                    borderWidth: 0.8,
                    borderColor: "#0000001F",
                    borderRadius: 12,
                    alignItems: "flex-start",
                    gap: 12,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                      color: "#2563EB",
                    }}
                  >
                    {job?.job_name}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: job?.is_active
                          ? "#107B1D1F"
                          : "#FF00001F",
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        borderRadius: 40,
                        alignItems: "flex-start",
                        justifyContent: "center",
                        fontSize: 16,
                        color: job?.is_active ? "#107B1D" : "#FF0000",
                        fontWeight: 600,
                      }}
                    >
                      {job?.is_active ? "Active" : "Inactive"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#4D5561",
                        fontWeight: 400,
                      }}
                    >
                      {job?.cmp_name}{" "}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Path
                        d="M13.25 4.5V7M13.25 7V9.5M13.25 7H15.75M13.25 7H10.75M8.875 3.5625C8.875 4.30842 8.57868 5.02379 8.05124 5.55124C7.52379 6.07868 6.80842 6.375 6.0625 6.375C5.31658 6.375 4.60121 6.07868 4.07376 5.55124C3.54632 5.02379 3.25 4.30842 3.25 3.5625C3.25 2.81658 3.54632 2.10121 4.07376 1.57376C4.60121 1.04632 5.31658 0.75 6.0625 0.75C6.80842 0.75 7.52379 1.04632 8.05124 1.57376C8.57868 2.10121 8.875 2.81658 8.875 3.5625ZM0.75 14.2792V14.1875C0.75 12.7785 1.30971 11.4273 2.306 10.431C3.30228 9.43471 4.65354 8.875 6.0625 8.875C7.47146 8.875 8.82272 9.43471 9.819 10.431C10.8153 11.4273 11.375 12.7785 11.375 14.1875V14.2783C9.77123 15.2442 7.93384 15.7532 6.06167 15.75C4.11917 15.75 2.30167 15.2125 0.75 14.2783V14.2792Z"
                        stroke="#6B7A8F"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#212529",
                        fontWeight: 400,
                      }}
                    >
                      {job?.experience_form
                        ? job?.experience_to
                          ? `${job.experience_form} – ${job.experience_to} Years`
                          : `${job.experience_form} + Years`
                        : "-"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Svg
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Path
                        d="M15.125 10.0417V13.5833C15.125 14.495 14.4692 15.28 13.565 15.4C11.8259 15.6308 10.0517 15.75 8.25005 15.75C6.44838 15.75 4.67421 15.6308 2.93505 15.4C2.03088 15.28 1.37505 14.495 1.37505 13.5833V10.0417M15.125 10.0417C15.3229 9.86971 15.4812 9.65696 15.5891 9.41803C15.697 9.1791 15.7519 8.91965 15.75 8.6575V5.505C15.75 4.60417 15.11 3.82583 14.2192 3.6925C13.2753 3.55118 12.3266 3.44361 11.375 3.37M15.125 10.0417C14.9634 10.1792 14.775 10.2875 14.5642 10.3583C12.5277 11.034 10.3957 11.3773 8.25005 11.375C6.04338 11.375 3.92088 11.0175 1.93588 10.3583C1.73026 10.2899 1.53982 10.1824 1.37505 10.0417M1.37505 10.0417C1.17717 9.86971 1.01885 9.65696 0.910962 9.41803C0.803077 9.1791 0.748182 8.91965 0.750046 8.6575V5.505C0.750046 4.60417 1.39005 3.82583 2.28088 3.6925C3.22479 3.55118 4.17345 3.44361 5.12505 3.37M11.375 3.37V2.625C11.375 2.12772 11.1775 1.65081 10.8259 1.29917C10.4742 0.947544 9.99733 0.75 9.50005 0.75H7.00005C6.50277 0.75 6.02585 0.947544 5.67422 1.29917C5.32259 1.65081 5.12505 2.12772 5.12505 2.625V3.37M11.375 3.37C9.29482 3.20923 7.20528 3.20923 5.12505 3.37M8.25005 8.875H8.25671V8.88167H8.25005V8.875Z"
                        stroke="#6B7A8F"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </Svg>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#212529",
                        fontWeight: 400,
                      }}
                    >
                      {job?.department_name}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default JobListing;
