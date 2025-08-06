import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const TermScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Terms & Conditions" navigate={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 30 }}
        contentContainerStyle={{ alignItems: "flex-start", gap: 10 }}
      >
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            1. Acceptance of Terms
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            By accessing or using the services, applications, or systems
            provided by K-Indev, including but not limited to employee portals,
            logistics dashboards, mobile apps, and websites, you agree to be
            bound by these Terms & Conditions. If you do not agree with any part
            of these terms, you must not use our platforms or services.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            2. Eligibility
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            Use of our platforms and services is restricted to authorized
            personnel, employees, verified clients, and registered vendors.
            Unauthorized access or use is strictly prohibited and may result in
            legal action.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            3. Use of Services
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            Users must access and use the systems solely for their intended
            purpose. All actions must comply with company policies, applicable
            laws, and professional standards. Users are responsible for
            maintaining the confidentiality of their login credentials and must
            immediately report any unauthorized access.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            4. Data Accuracy
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            All users are required to provide accurate, complete, and up-to-date
            information when requested. Misrepresentation, falsification, or
            submission of misleading information may result in suspension or
            termination of access and services.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            5. Confidentiality
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            All information accessible through our systems—including employee
            data, shipment records, business documents, and client details—is
            strictly confidential. Users must not disclose, share, or misuse
            such data without prior written authorization from K-Indev.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            6. Intellectual Property
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            All content, software, documentation, and materials available
            through our services are the property of K-Indev or its licensors
            and are protected by applicable intellectual property laws. Users
            are not permitted to copy, modify, reproduce, or distribute any
            material without explicit permission.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            7. System Access & Restrictions
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            Users must not engage in activities that may disrupt, damage, or
            interfere with the operation of our systems. This includes but is
            not limited to attempting unauthorized access, deploying malware, or
            extracting data using automated tools.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            8. Monitoring & Audits
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            K-Indev Logistics reserves the right to monitor system usage, audit
            logs, and user activities to ensure compliance with these terms,
            maintain security, and prevent misuse. Any suspicious or
            non-compliant activity may be investigated and acted upon
            accordingly.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermScreen;
