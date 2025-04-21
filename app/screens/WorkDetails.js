import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import CustomModal from "../components/CustomModal";

const WorkDetails = () => {
  const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();

  const [isCheckIn, setIsCheckIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Header title="Shift Details" navigate={() => navigation.goBack()} />
      <View
        style={{
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          height: 320,
          width: "100%",
          borderRadius: 16,
          padding: 16,
          backgroundColor: "white",
          elevation: 1,
          marginVertical: 20,
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
            {data.workId}
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
              {data.distance}
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
            {data.cmpName}
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
            <FontAwesome6 name="location-dot" size={16} color="#64748B" />
            <Text style={{ fontFamily: "Inter-Regular", color: "#1B1B1B99" }}>
              {data.address}
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
            onPress={() => {}}
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
        <View
          style={{
            height: 1,
            width: "100%",
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
            width: "100%",
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
            Today
          </Text>
          <Ionicons name="calendar-clear" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <ScrollView
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
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(data) => {
          console.log(data);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

export default WorkDetails;
