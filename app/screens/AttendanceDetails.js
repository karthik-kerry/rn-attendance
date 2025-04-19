import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";

const AttendanceDetails = () => {
  const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();

  const date = data.split(",")[1];

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Attendance Details" navigate={() => navigation.goBack()} />
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
            {date}
          </Text>
          <Ionicons name="calendar-clear" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
    </View>
  );
};

export default AttendanceDetails;
