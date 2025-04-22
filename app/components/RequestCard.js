import { View, Text, Dimensions, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

const RequestCard = ({
  initial,
  name,
  content,
  profileBg,
  profileText,
  time,
  btnText1,
  btnPrimary1,
  btnSecondary1,
  btnText2,
  btnPrimary2,
  btnSecondary2,
  isApproved,
  isNotificationSend,
}) => {
  const { width } = Dimensions.get("window");

  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [text, setText] = useState("");

  const dropdownData = [
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
  ];

  const onSubmit = () => {
    console.log("Reason: ", selectedValue);
    console.log("Date: ", startDate.toLocaleDateString("en-GB"));
    console.log("Note: ", text);
  };

  if (isApproved) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: profileBg,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              {initial}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
              width: "80%",
            }}
          >
            <Text
              style={{
                lineHeight: 20,
              }}
            >
              <Text
                style={{
                  color: profileText,
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {name}{" "}
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: "Inter-Regular",
                }}
              >
                {content}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#64748B",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {time}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            marginVertical: 10,
          }}
        >
          <Ionicons name="checkmark-done-sharp" size={20} color="#13950F" />
          <Text style={{ color: "#13950F", fontFamily: "Inter-SemiBold" }}>
            Approved
          </Text>
        </View>
        <View
          style={{
            height: 0.8,
            width: "100%",
            backgroundColor: "#E2E8F0",
            marginVertical: 10,
          }}
        />
      </View>
    );
  }

  if (isNotificationSend) {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: profileBg,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
                fontSize: 16,
              }}
            >
              {initial}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 5,
              width: "80%",
            }}
          >
            <Text
              style={{
                lineHeight: 20,
              }}
            >
              <Text
                style={{
                  color: profileText,
                  fontFamily: "Inter-SemiBold",
                }}
              >
                {name}{" "}
              </Text>
              <Text
                style={{
                  color: "#64748B",
                  fontFamily: "Inter-Regular",
                }}
              >
                {content}
              </Text>
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Inter-SemiBold",
            color: "#64748B",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {time}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            marginVertical: 10,
          }}
        >
          <Ionicons name="checkmark-done-sharp" size={20} color="#13950F" />
          <Text style={{ color: "#13950F", fontFamily: "Inter-SemiBold" }}>
            Notification Send
          </Text>
        </View>
        <View
          style={{
            height: 0.8,
            width: "100%",
            backgroundColor: "#E2E8F0",
            marginVertical: 10,
          }}
        />
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <View
          style={{
            height: 46,
            width: 46,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: profileBg,
          }}
        >
          <Text
            style={{
              color: profileText,
              fontFamily: "Inter-SemiBold",
              fontSize: 16,
            }}
          >
            {initial}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 5,
            width: "80%",
          }}
        >
          <Text
            style={{
              lineHeight: 20,
            }}
          >
            <Text
              style={{
                color: profileText,
                fontFamily: "Inter-SemiBold",
              }}
            >
              {name}{" "}
            </Text>
            <Text
              style={{
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              {content}
            </Text>
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: "Inter-SemiBold",
          color: "#64748B",
          fontSize: 12,
          textAlign: "right",
        }}
      >
        {time}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (btnText1 === "Attendance") {
              setModalVisible(true);
            }
          }}
          style={{
            backgroundColor: btnSecondary1,
            borderWidth: 1,
            borderColor: btnPrimary1,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: btnPrimary1, fontFamily: "Inter-SemiBold" }}>
            {btnText1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: btnSecondary2,
            borderWidth: 1,
            borderColor: btnPrimary2,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "48%",
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: btnPrimary2, fontFamily: "Inter-SemiBold" }}>
            {btnText2}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 0.8,
          width: "100%",
          backgroundColor: "#E2E8F0",
          marginVertical: 10,
        }}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000060",
          }}
        >
          <View
            style={{
              height: "auto",
              width: width - 40,
              marginHorizontal: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              elevation: 5,
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                textAlign: "center",
                fontSize: 16,
                color: "#1b1b1b",
              }}
            >
              Attendance
            </Text>

            {/* Reason Dropdown */}
            <Text
              style={{
                fontSize: 14,
                marginBottom: 5,
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              Select Reason
            </Text>
            <Dropdown
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 10,
                marginBottom: 20,
                height: 50,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#E2E8F0",
              }}
              placeholderStyle={{ color: "#64748B" }}
              selectedTextStyle={{ color: "#111827" }}
              data={dropdownData}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={selectedValue}
              onChange={(item) => setSelectedValue(item.value)}
            />

            {/* Start & End Time */}
            <Text
              style={{
                fontSize: 14,
                marginBottom: 5,
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              Date
            </Text>
            <TouchableOpacity
              style={{
                height: 50,
                width: "100%",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingHorizontal: 10,
                backgroundColor: "white",
                marginBottom: 20,
              }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: startDate ? "#111827" : "#64748B",
                }}
              >
                {startDate
                  ? startDate.toLocaleDateString("en-GB")
                  : "Select Date"}
              </Text>
              <Ionicons name="calendar-outline" size={22} color="#64748B" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setStartDate(selectedDate);
                  }
                }}
              />
            )}

            {/* Note Textarea */}
            <Text
              style={{
                fontSize: 14,
                marginBottom: 5,
                color: "#64748B",
                fontFamily: "Inter-Regular",
              }}
            >
              Note
            </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                height: 120,
                padding: 10,
                textAlignVertical: "top",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#E2E8F0",
              }}
              multiline
              numberOfLines={4}
              value={text}
              onChangeText={setText}
            />

            {/* Cancel & Submit Btn */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "10%",
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  height: 44,
                  width: 153,
                  borderRadius: 47,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#64748B",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                style={{
                  height: 44,
                  width: 153,
                  borderRadius: 47,
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Inter-Regular",
                  }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RequestCard;
