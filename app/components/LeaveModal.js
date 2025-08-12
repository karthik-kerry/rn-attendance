import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";

const formatDate = (dateObj) => {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

const LeaveModal = ({ visible, onClose, onSubmit }) => {
  const { width } = Dimensions.get("window");

  const [selectedValue, setSelectedValue] = useState(null);
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));

  const onStartDateChange = (event, selectedDate) => {
    showStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    showEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setFormattedDate(formatDate(selectedDate));
    }
  };

  const dropdownData = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
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
            Leave Apply
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
            Select Leave
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
          {/* Start and End Date */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 5,
                  color: "#64748B",
                  fontFamily: "Inter-SemiBold",
                }}
              >
                Start Date
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 44,
                    width: width - 240,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    padding: 10,
                  }}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={{ color: "#000" }}>
                    {startDate.toLocaleDateString() || "Select Date"}
                  </Text>
                  <Svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M12.6667 2.66699H2.66667C1.74619 2.66699 1 3.41318 1 4.33366V14.3337C1 15.2541 1.74619 16.0003 2.66667 16.0003H12.6667C13.5871 16.0003 14.3333 15.2541 14.3333 14.3337V4.33366C14.3333 3.41318 13.5871 2.66699 12.6667 2.66699Z"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M11 1V4.33333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M4.3335 1V4.33333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M1 7.66699H14.3333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M6.8335 11H7.66683"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M7.6665 11V13.5"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onStartDateChange}
                />
              )}
            </View>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: 5,
                  color: "#64748B",
                  fontFamily: "Inter-SemiBold",
                }}
              >
                End Date
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    height: 44,
                    width: width - 240,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    padding: 10,
                  }}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={{ color: "#000" }}>
                    {endDate.toLocaleDateString() || "Select Date"}
                  </Text>
                  <Svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M12.6667 2.66699H2.66667C1.74619 2.66699 1 3.41318 1 4.33366V14.3337C1 15.2541 1.74619 16.0003 2.66667 16.0003H12.6667C13.5871 16.0003 14.3333 15.2541 14.3333 14.3337V4.33366C14.3333 3.41318 13.5871 2.66699 12.6667 2.66699Z"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M11 1V4.33333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M4.3335 1V4.33333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M1 7.66699H14.3333"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M6.8335 11H7.66683"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <Path
                      d="M7.6665 11V13.5"
                      stroke="#64748B"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onEndDateChange}
                />
              )}
            </View>
          </View>
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
              onPress={onClose}
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
              onPress={() =>
                onSubmit({ selectedValue, text, startDate, endDate })
              }
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
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LeaveModal;
