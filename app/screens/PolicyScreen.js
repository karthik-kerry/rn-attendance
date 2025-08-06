import { View, Text, StatusBar, ScrollView } from "react-native";
import React from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const PolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Privacy Policy" navigate={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginVertical: 30 }}
        contentContainerStyle={{ alignItems: "flex-start", gap: 10 }}
      >
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            1. Privacy Policy
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            At K-Indev Logistics, we prioritize the protection and
            confidentiality of all personal and operational data that we manage.
            This Privacy Policy explains how we collect, use, store, and share
            information in connection with our logistics operations, employee
            management systems, and digital platforms. Our commitment is to
            comply with all applicable data protection laws and ensure that all
            information is handled responsibly.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            2. Information We Collect
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            We collect personal, business, and technical information as
            necessary for our operations. This may include employee data (e.g.,
            name, contact details, ID proof, payroll details), client/vendor
            details (e.g., company name, address, GST information), shipment
            records, financial transactions, and digital usage data (e.g.,
            device logs, IP addresses, login timestamps). This data is collected
            through physical documentation, internal portals, mobile
            applications, and system integrations.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            3. Purpose of Data Collection
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            The information we collect is used solely for legitimate business
            functions. These include human resource management, attendance
            tracking, payroll processing, logistics and shipment execution,
            warehouse monitoring, compliance reporting, customer service, and
            system optimization. We may also use this data for improving user
            experience, analytics, and operational reporting.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            4. Data Sharing and Disclosure
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            We do not sell or share personal information with unaffiliated third
            parties for marketing purposes. However, we may share data with:
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Government or legal authorities when required by law
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Technology partners and vendors who provide
              infrastructure support
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Financial institutions and auditors for compliance and
              verification
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Logistics partners for order execution or delivery
              tracking
            </Text>
          </View>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            All third parties are required to maintain confidentiality and use
            data strictly for agreed purposes.
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            5. Data Security Measures
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            We implement strong security measures to protect all collected data.
            These include:
          </Text>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Role-based access control
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} End-to-end encryption
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Secure authentication and login monitoring verification
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Routine data backups
            </Text>
            <Text style={{ color: "#1B1B1B", fontSize: 12, lineHeight: 20 }}>
              {"\u2022"} Periodic audits and vulnerability assessments Employee
              training and internal policies further reinforce our commitment to
              data privacy and security.
            </Text>
          </View>
        </View>
        <View style={{ gap: 5 }}>
          <Text style={{ color: "#1B1B1B", fontFamily: "Inter-SemiBold" }}>
            6. Use of Cookies and Tracking Tools
          </Text>
          <Text
            style={{
              color: "#1B1B1B",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            Our websites and mobile apps may use cookies, pixels, and analytics
            tools to improve functionality and user experience. These tools
            collect non-personal data such as browser type, device information,
            and usage patterns. Users may disable cookies through their browser
            settings, but doing so may limit some features of the site or app.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PolicyScreen;
