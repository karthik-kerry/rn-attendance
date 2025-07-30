import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { List } from "react-native-paper";

const months = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const PayslipScreen = () => {
  const navigation = useNavigation();

  const [selectedMonth, setSelectedMonth] = useState("Jun");
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  const renderTab = ({ item }) => {
    const isActive = selectedMonth === item;
    return (
      <TouchableOpacity onPress={() => setSelectedMonth(item)}>
        <View style={{ paddingHorizontal: 14, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              color: isActive ? "#2563EB" : "#64748B",
              fontSize: 14,
            }}
          >
            {item}
          </Text>
          {isActive && (
            <View
              style={{
                marginTop: 6,
                height: 2,
                width: "150%",
                backgroundColor: "#2563EB",
                borderRadius: 1,
              }}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const MonthPayslip = ({ month }) => {
    return (
      <View
        style={{
          backgroundColor: "#FFFFFF",
          width: "100%",
          height: 150,
          borderRadius: 12,
          padding: 18,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                backgroundColor: "#2563EB",
                height: 20,
                width: 3,
                borderRadius: 30,
              }}
            />
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
                color: "#1b1b1b",
              }}
            >
              Net Pay - {month}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              height: 44,
              width: 44,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1.5,
              borderColor: "#2563EB",
              backgroundColor: "#2563EB0F",
            }}
          >
            <Svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M1 13V15C1 15.5304 1.21071 16.0391 1.58579 16.4142C1.96086 16.7893 2.46957 17 3 17H15C15.5304 17 16.0391 16.7893 16.4142 16.4142C16.7893 16.0391 17 15.5304 17 15V13M13 9L9 13M9 13L5 9M9 13V1"
                stroke="#2563EB"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: "#13950F",
            fontFamily: "Inter-SemiBold",
            fontSize: 23,
            paddingVertical: 6,
          }}
        >
          ₹45,000.00
        </Text>
        <Text
          style={{
            color: "#64748B",
            fontFamily: "Inter-Regular",
            paddingVertical: 6,
          }}
        >
          Rupees Forty-five thousand only
        </Text>
      </View>
    );
  };

  const CustomAccordion = ({ title, total, items }) => (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2563EB",
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <List.Accordion
        title={title}
        description={`₹${total}`}
        titleStyle={{
          fontFamily: "Inter-SemiBold",
          color: "#64748B",
          fontSize: 14,
        }}
        descriptionStyle={{
          fontFamily: "Inter-SemiBold",
          color: "#13950F",
          fontSize: 16,
        }}
        style={{
          backgroundColor: "#2563EB0A",
        }}
      >
        {items.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: "#fff",
              borderTopWidth: index === 0 ? 1 : 0,
              borderColor: "#E2E8F0",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                color: "#64748B",
              }}
            >
              {item.label}
            </Text>
            <Text
              style={{
                fontFamily: "Inter-SemiBold",
                color: "#1B1B1B",
              }}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </List.Accordion>
    </View>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Payslip" navigate={() => navigation.goBack()} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#1b1b1b",
            fontSize: 16,
          }}
        >
          Payroll Year
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
            2025-2026
          </Text>
          <Svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              opacity="0.8"
              d="M11 1.5L6 6.5L1 1.5"
              stroke="#64748B"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginVertical: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          data={months}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderTab}
          keyExtractor={(item) => item}
          contentContainerStyle={{
            marginTop: 20,
            gap: 16,
            borderBottomColor: "#64748B1F",
            borderBottomWidth: 1,
          }}
        />
      </View>
      <View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            width: "100%",
            height: 155,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <MonthPayslip month={selectedMonth} />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <List.Section style={{ gap: 20 }}>
          <CustomAccordion
            title="Earnings"
            total="47,000.00"
            items={[
              { label: "BASIC", value: "₹18,800.00" },
              { label: "HRA", value: "₹9,400.00" },
              { label: "SPECIAL ALLOWANCE", value: "₹14,800.00" },
              { label: "BONUS PAID IN ADVANCE", value: "₹4,000.00" },
            ]}
          />
          <CustomAccordion
            title="Deductions"
            total="2,000.00"
            items={[
              { label: "PF", value: "₹1,200.00" },
              { label: "TDS", value: "₹800.00" },
            ]}
          />
        </List.Section>
      </View>
    </View>
  );
};

export default PayslipScreen;
