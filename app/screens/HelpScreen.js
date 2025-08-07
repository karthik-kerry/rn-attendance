import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

import Svg, { Path } from "react-native-svg";

const HelpScreen = () => {
  const navigation = useNavigation();
  const FAQ_Data = [
    {
      question: "How Do I Reset My Login PIN Or Password?",
      answer:
        "By accessing or using the services, applications, or systems provided by K-Indev Logistics, including but not limited to employee portals, logistics dashboards, mobile apps, and websites, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our platforms or services.",
    },
    {
      question: "I’m Unable To Mark Attendance. What Should I Do?",
      answer:
        "Ensure GPS and permissions are enabled. Contact admin if the issue persists.",
    },
    {
      question: "How Can I View My Task Assignments And Status?",
      answer:
        "Go to the Task tab in the app to view all assignments and their current status.",
    },
    {
      question: "Where Can I Check My Leave Balance Or Apply For Leave?",
      answer:
        "Open the Leave tab from the dashboard to view balance and submit leave requests.",
    },
    {
      question: "I Submitted A Support Request. How Do I Track It?",
      answer:
        "Go to the Helpdesk section to track status of your submitted requests.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleExpand = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const renderItem = ({ item, index }) => (
    <View
      style={{
        borderBottomWidth: index !== FAQ_Data.length - 1 ? 1 : 0,
        borderColor: "#E2E8F0",
        paddingVertical: 12,
      }}
    >
      <TouchableOpacity
        onPress={() => toggleExpand(index)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            color: "#1b1b1b",
            flex: 1,
            paddingRight: 8,
          }}
        >
          {item.question}
        </Text>
        <View style={{ marginBottom: 20 }}>
          {activeIndex === index ? (
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.469828 0.470153C0.610453 0.329703 0.801078 0.250813 0.999828 0.250813C1.19858 0.250813 1.3892 0.329703 1.52983 0.470153L6.99983 5.94015L12.4698 0.470153C12.5385 0.396466 12.6213 0.337364 12.7133 0.296372C12.8053 0.25538 12.9046 0.233339 13.0053 0.231562C13.106 0.229785 13.206 0.24831 13.2994 0.286031C13.3928 0.323752 13.4776 0.379896 13.5489 0.451115C13.6201 0.522334 13.6762 0.607168 13.714 0.700556C13.7517 0.793944 13.7702 0.893973 13.7684 0.994676C13.7666 1.09538 13.7446 1.19469 13.7036 1.28669C13.6626 1.37869 13.6035 1.46149 13.5298 1.53015L8.05983 7.00015L13.5298 12.4702C13.6035 12.5388 13.6626 12.6216 13.7036 12.7136C13.7446 12.8056 13.7666 12.9049 13.7684 13.0056C13.7702 13.1063 13.7517 13.2064 13.714 13.2998C13.6762 13.3931 13.6201 13.478 13.5489 13.5492C13.4776 13.6204 13.3928 13.6766 13.2994 13.7143C13.206 13.752 13.106 13.7705 13.0053 13.7687C12.9046 13.767 12.8053 13.7449 12.7133 13.7039C12.6213 13.6629 12.5385 13.6038 12.4698 13.5302L6.99983 8.06015L1.52983 13.5302C1.38765 13.6626 1.19961 13.7348 1.00531 13.7313C0.811005 13.7279 0.625619 13.6492 0.488206 13.5118C0.350793 13.3744 0.272082 13.189 0.268653 12.9947C0.265225 12.8004 0.337348 12.6123 0.469828 12.4702L5.93983 7.00015L0.469828 1.53015C0.329378 1.38953 0.250488 1.1989 0.250488 1.00015C0.250488 0.801403 0.329378 0.610779 0.469828 0.470153Z"
                fill="#64748B"
              />
            </Svg>
          ) : (
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
                d="M9 0.75C9.19891 0.75 9.38968 0.829018 9.53033 0.96967C9.67098 1.11032 9.75 1.30109 9.75 1.5V8.25H16.5C16.6989 8.25 16.8897 8.32902 17.0303 8.46967C17.171 8.61032 17.25 8.80109 17.25 9C17.25 9.19891 17.171 9.38968 17.0303 9.53033C16.8897 9.67098 16.6989 9.75 16.5 9.75H9.75V16.5C9.75 16.6989 9.67098 16.8897 9.53033 17.0303C9.38968 17.171 9.19891 17.25 9 17.25C8.80109 17.25 8.61032 17.171 8.46967 17.0303C8.32902 16.8897 8.25 16.6989 8.25 16.5V9.75H1.5C1.30109 9.75 1.11032 9.67098 0.96967 9.53033C0.829018 9.38968 0.75 9.19891 0.75 9C0.75 8.80109 0.829018 8.61032 0.96967 8.46967C1.11032 8.32902 1.30109 8.25 1.5 8.25H8.25V1.5C8.25 1.30109 8.32902 1.11032 8.46967 0.96967C8.61032 0.829018 8.80109 0.75 9 0.75Z"
                fill="#64748B"
              />
            </Svg>
          )}
        </View>
      </TouchableOpacity>

      {activeIndex === index && (
        <Text
          style={{
            marginTop: 8,
            color: "#4B5563",
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          {item.answer}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
        <Header title="Help & Support" navigate={() => navigation.goBack()} />
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            paddingVertical: 30,
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "#fff",
              height: 74,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.5 3.5C0.5 2.70435 0.816071 1.94129 1.37868 1.37868C1.94129 0.816071 2.70435 0.5 3.5 0.5H4.872C5.732 0.5 6.482 1.086 6.691 1.92L7.796 6.343C7.88554 6.701 7.86746 7.07746 7.74401 7.42522C7.62055 7.77299 7.39723 8.07659 7.102 8.298L5.809 9.268C5.674 9.369 5.645 9.517 5.683 9.62C6.24738 11.1549 7.1386 12.5487 8.29495 13.7051C9.4513 14.8614 10.8451 15.7526 12.38 16.317C12.483 16.355 12.63 16.326 12.732 16.191L13.702 14.898C13.9234 14.6028 14.227 14.3794 14.5748 14.256C14.9225 14.1325 15.299 14.1145 15.657 14.204L20.08 15.309C20.914 15.518 21.5 16.268 21.5 17.129V18.5C21.5 19.2956 21.1839 20.0587 20.6213 20.6213C20.0587 21.1839 19.2956 21.5 18.5 21.5H16.25C7.552 21.5 0.5 14.448 0.5 5.75V3.5Z"
                  fill="#2563EB"
                />
              </Svg>
              <View>
                <Text
                  style={{ color: "#64748B", fontFamily: "Inter-SemiBold" }}
                >
                  Call Us
                </Text>
                <Text
                  style={{ color: "#2563EB", fontFamily: "Inter-SemiBold" }}
                >
                  +91-88888 88888
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: "#fff",
              height: 74,
              borderRadius: 16,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              <Svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M1.5 8.66992V17.2499C1.5 18.0456 1.81607 18.8086 2.37868 19.3712C2.94129 19.9339 3.70435 20.2499 4.5 20.2499H19.5C20.2956 20.2499 21.0587 19.9339 21.6213 19.3712C22.1839 18.8086 22.5 18.0456 22.5 17.2499V8.66992L13.572 14.1629C13.0992 14.4538 12.5551 14.6078 12 14.6078C11.4449 14.6078 10.9008 14.4538 10.428 14.1629L1.5 8.66992Z"
                  fill="#2563EB"
                />
                <Path
                  d="M22.5 6.908V6.75C22.5 5.95435 22.1839 5.19129 21.6213 4.62868C21.0587 4.06607 20.2956 3.75 19.5 3.75H4.5C3.70435 3.75 2.94129 4.06607 2.37868 4.62868C1.81607 5.19129 1.5 5.95435 1.5 6.75V6.908L11.214 12.886C11.4504 13.0314 11.7225 13.1084 12 13.1084C12.2775 13.1084 12.5496 13.0314 12.786 12.886L22.5 6.908Z"
                  fill="#2563EB"
                />
              </Svg>

              <View>
                <Text
                  style={{ color: "#64748B", fontFamily: "Inter-SemiBold" }}
                >
                  Email Support
                </Text>
                <Text
                  style={{ color: "#2563EB", fontFamily: "Inter-SemiBold" }}
                >
                  support@xbmtechnologies.com
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ gap: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Inter-Regular",
                color: "#1b1b1b",
              }}
            >
              Frequently Asked Questions (FAQs)
            </Text>

            <View
              style={{
                width: "!00%",
                backgroundColor: "#fff",
                height: "auto",
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <FlatList
                data={FAQ_Data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HelpScreen;
