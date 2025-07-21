import { View, Text, Dimensions, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";

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
          <Svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M6.66634 10.8333L10.0607 13.5488C10.4886 13.8911 11.1123 13.8253 11.4593 13.4012L18.333 5"
              stroke="#13950F"
              stroke-width="2"
              stroke-linecap="round"
            />
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.71665 9.98156L13.2743 5.63327C13.6241 5.20582 13.5611 4.5758 13.1336 4.22607C12.7062 3.87635 12.0762 3.93935 11.7264 4.36679L8.18014 8.70114L9.71665 9.98156ZM6.55033 13.8515L5.01383 12.5711L4.83347 12.7915L2.26705 10.8667C1.82522 10.5353 1.19842 10.6249 0.867051 11.0667C0.53568 11.5085 0.625223 12.1353 1.06705 12.4667L3.63347 14.3915C4.49086 15.0346 5.70273 14.8875 6.38139 14.058L6.55033 13.8515Z"
              fill="#13950F"
            />
          </Svg>
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
          <Svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M6.66634 10.8333L10.0607 13.5488C10.4886 13.8911 11.1123 13.8253 11.4593 13.4012L18.333 5"
              stroke="#13950F"
              stroke-width="2"
              stroke-linecap="round"
            />
            <Path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.71665 9.98156L13.2743 5.63327C13.6241 5.20582 13.5611 4.5758 13.1336 4.22607C12.7062 3.87635 12.0762 3.93935 11.7264 4.36679L8.18014 8.70114L9.71665 9.98156ZM6.55033 13.8515L5.01383 12.5711L4.83347 12.7915L2.26705 10.8667C1.82522 10.5353 1.19842 10.6249 0.867051 11.0667C0.53568 11.5085 0.625223 12.1353 1.06705 12.4667L3.63347 14.3915C4.49086 15.0346 5.70273 14.8875 6.38139 14.058L6.55033 13.8515Z"
              fill="#13950F"
            />
          </Svg>
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
              <Svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M16.6667 7.16699H6.66667C5.74619 7.16699 5 7.91318 5 8.83366V18.8337C5 19.7541 5.74619 20.5003 6.66667 20.5003H16.6667C17.5871 20.5003 18.3333 19.7541 18.3333 18.8337V8.83366C18.3333 7.91318 17.5871 7.16699 16.6667 7.16699Z"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M15 5.5V8.83333"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M8.33301 5.5V8.83333"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M5 12.167H18.3333"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M10.833 15.5H11.6663"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M11.667 15.5V18"
                  stroke="#64748B"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
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
