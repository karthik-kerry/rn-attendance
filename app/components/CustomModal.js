import { Ionicons } from "@expo/vector-icons";
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

const CustomModal = ({ visible, onClose, onSubmit }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { width } = Dimensions.get("window");

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
            Break
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
            Reason
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
            Break Time
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
                width: 150,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 5,
              }}
              onPress={() => setShowStartPicker(true)}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                {startTime ? startTime.toLocaleTimeString() : "Start Time"}
              </Text>
              <Ionicons name="time-outline" size={22} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 44,
                width: 150,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                padding: 5,
              }}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={{ fontFamily: "Inter-Regular", color: "#64748B" }}>
                {endTime ? endTime.toLocaleTimeString() : "End Time"}
              </Text>
              <Ionicons name="time-outline" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(Platform.OS === "ios");
                if (selectedDate) setStartTime(selectedDate);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(Platform.OS === "ios");
                if (selectedDate) setEndTime(selectedDate);
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
              onPress={() => onSubmit({ selectedValue, text })}
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
  );
};

export default CustomModal;
