import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";

const AttendanceCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const markedDates = {
    "2025-07-26": createMarked("P"),
    "2025-07-27": createMarked("P", "🏠"),
    "2025-07-28": createMarked("P"),
    "2025-07-29": createMarked("📅"),
    "2025-07-30": createMarked("🏠"),
    "2025-07-31": createMarked("A"),
    "2025-08-01": createMarked("P"),
    "2025-08-02": createMarked("P"),
    "2025-08-03": createMarked("P", "🏠"),
    "2025-08-04": createMarked("🌓"),
    "2025-08-05": createMarked("R"),
    "2025-08-09": createMarked("L"),
    "2025-08-12": createMarked("H"),
    "2025-08-16": createMarked("A"),
    "2025-08-22": createMarked("OD"),
    "2025-08-23": createMarked("?"),
  };

  function createMarked(code, icon = null) {
    return {
      customStyles: {
        container: {
          backgroundColor: getColor(code),
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
        },
        text: {
          color: "#000",
          fontWeight: "bold",
        },
      },
      icon: icon,
      code: code,
    };
  }

  function getColor(code) {
    return (
      {
        P: "#d1f1d1",
        A: "#ffe2e2",
        OD: "#c2e1ff",
        L: "#fff7c2",
        R: "#d9d9d9",
        H: "#ffd6d6",
        "?": "#e4ccf7",
        "📅": "#e9f0f7",
        "🏠": "#f0f8ff",
        "🌓": "#d1f1d1",
      }[code] || "#fff"
    );
  }

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <Calendar
        markingType="custom"
        markedDates={Object.fromEntries(
          Object.entries(markedDates).map(([key, val]) => [key, val])
        )}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#fff",
          textSectionTitleColor: "#000",
          dayTextColor: "#000",
          monthTextColor: "#000",
          arrowColor: "#000",
          todayTextColor: "#000",
        }}
        dayComponent={({ date, state }) => {
          const entry = markedDates[date.dateString];
          return (
            <TouchableOpacity
              onPress={() => handleDayPress(date)}
              style={[
                {
                  height: 40,
                  width: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                },
                entry?.customStyles?.container,
              ]}
            >
              <Text
                style={[
                  {
                    color: state === "disabled" ? "gray" : "black",
                    fontSize: 12,
                  },
                  entry?.customStyles?.text,
                ]}
              >
                {date.day}
              </Text>
              {entry?.icon && (
                <Text style={{ fontSize: 10 }}>{entry.icon}</Text>
              )}
              {!entry?.icon && entry?.code && entry.code.length <= 3 && (
                <Text style={{ fontSize: 10 }}>{entry.code}</Text>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {selectedDate && (
        <View
          style={{
            marginTop: 30,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#1B1B1B",
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              Detail Info
            </Text>
            <Text
              style={{
                color: "#64748B",
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 20,
              marginVertical: 20,
              marginHorizontal: -10,
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
      )}
    </ScrollView>
  );
};

export default AttendanceCalendar;
