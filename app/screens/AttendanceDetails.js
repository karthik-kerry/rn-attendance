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
import Svg, { Path } from "react-native-svg";

const AttendanceDetails = () => {
  const route = useRoute();
  const { data } = route.params;
  const navigation = useNavigation();

  const date = data.split(",")[1];

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header
        title="Attendance Details"
        navigate={() => navigation.goBack()}
        addVisible={true}
        addFunc={() => {}}
      />
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
          <Svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.5 1.5C4.63261 1.5 4.75979 1.55268 4.85355 1.64645C4.94732 1.74021 5 1.86739 5 2V3H11V2C11 1.86739 11.0527 1.74021 11.1464 1.64645C11.2402 1.55268 11.3674 1.5 11.5 1.5C11.6326 1.5 11.7598 1.55268 11.8536 1.64645C11.9473 1.74021 12 1.86739 12 2V3H12.5C13.0304 3 13.5391 3.21071 13.9142 3.58579C14.2893 3.96086 14.5 4.46957 14.5 5V12.5C14.5 13.0304 14.2893 13.5391 13.9142 13.9142C13.5391 14.2893 13.0304 14.5 12.5 14.5H3.5C2.96957 14.5 2.46086 14.2893 2.08579 13.9142C1.71071 13.5391 1.5 13.0304 1.5 12.5V5C1.5 4.46957 1.71071 3.96086 2.08579 3.58579C2.46086 3.21071 2.96957 3 3.5 3H4V2C4 1.86739 4.05268 1.74021 4.14645 1.64645C4.24021 1.55268 4.36739 1.5 4.5 1.5ZM13.5 7.5C13.5 7.23478 13.3946 6.98043 13.2071 6.79289C13.0196 6.60536 12.7652 6.5 12.5 6.5H3.5C3.23478 6.5 2.98043 6.60536 2.79289 6.79289C2.60536 6.98043 2.5 7.23478 2.5 7.5V12.5C2.5 12.7652 2.60536 13.0196 2.79289 13.2071C2.98043 13.3946 3.23478 13.5 3.5 13.5H12.5C12.7652 13.5 13.0196 13.3946 13.2071 13.2071C13.3946 13.0196 13.5 12.7652 13.5 12.5V7.5Z"
              fill="#2563EB"
            />
          </Svg>
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
            width: "100%",
          }}
        >
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{
                color: "#64748B",
                fontSize: 12,
                fontFamily: "Inter-SemiBold",
              }}
            >
              Total Working Hrs
            </Text>
            <Text style={{ color: "#1B1B1B", fontFamily: "Inter-Bold" }}>
              08:00 Hrs
            </Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{
                color: "#64748B",
                fontSize: 12,
                fontFamily: "Inter-SemiBold",
              }}
            >
              User Working Hrs
            </Text>
            <Text style={{ color: "#1B1B1B", fontFamily: "Inter-Bold" }}>
              07:30 Hrs
            </Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{
                color: "#64748B",
                fontSize: 12,
                fontFamily: "Inter-SemiBold",
              }}
            >
              Total Break Hrs
            </Text>
            <Text style={{ color: "#1B1B1B", fontFamily: "Inter-Bold" }}>
              35:00 Mins
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#0000001F",
            marginVertical: 20,
          }}
        />
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
              backgroundColor: "#E4403B",
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
            <Text style={{ color: "#E4403B", fontFamily: "Inter-Regular" }}>
              Check-Out Time
            </Text>
            <Text style={{ color: "#E4403B", fontFamily: "Inter-Regular" }}>
              (18:30)
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AttendanceDetails;
