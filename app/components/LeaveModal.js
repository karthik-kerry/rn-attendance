import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const LeaveModal = ({ visible, onClose, onSubmit }) => {
  const { width } = Dimensions.get("window");

  const [selectedValue, setSelectedValue] = useState(null);
  const [text, setText] = useState("");

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

export default LeaveModal;
