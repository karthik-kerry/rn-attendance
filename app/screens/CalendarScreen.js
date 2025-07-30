import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  StatusBar,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle, Path } from "react-native-svg";

const CalendarScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [remindMe, setRemindMe] = useState(false);

  const handleAddEvent = () => {
    if (!eventName.trim()) return;

    setEvents((prev) => {
      const current = prev[selectedDate] || [];
      return {
        ...prev,
        [selectedDate]: [
          ...current,
          {
            name: eventName,
            note,
            startTime,
            endTime,
            remindMe,
            completed: false,
          },
        ],
      };
    });

    // Clear inputs
    setEventName("");
    setNote("");
    setRemindMe(false);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      <Header title="Calendar" navigate={() => navigation.goBack()} />

      <Calendar
        style={{ marginVertical: 20 }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#2563EB",
          },
        }}
      />

      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: "#2563EB",
          borderRadius: 8,
          padding: 12,
          alignItems: "center",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Add Event</Text>
      </TouchableOpacity>

      <FlatList
        data={events[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginVertical: 20 }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 8,
              marginVertical: 6,
              elevation: 1,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.note}</Text>
            <Text>
              {new Date(item.startTime).toLocaleTimeString()} -{" "}
              {new Date(item.endTime).toLocaleTimeString()}
            </Text>
            <Text style={{ color: "#888" }}>
              {item.completed ? "✅ Completed" : "⏳ Pending"}
            </Text>
          </View>
        )}
      />

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 10, textAlign: "center" }}
            >
              Add New Event
            </Text>
            <TextInput
              placeholder="Event Name"
              value={eventName}
              onChangeText={setEventName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
              }}
            />
            <TextInput
              placeholder="Note"
              value={note}
              onChangeText={setNote}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                height: 60,
                marginVertical: 10,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
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
                <Svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Circle
                    cx="10"
                    cy="10.5"
                    r="9"
                    stroke="#64748B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <Path
                    d="M10.5557 5.09961V10.4996L14.1557 12.2996"
                    stroke="#64748B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </Svg>
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
                <Svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Circle
                    cx="10"
                    cy="10.5"
                    r="9"
                    stroke="#64748B"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <Path
                    d="M10.5557 5.09961V10.4996L14.1557 12.2996"
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
                value={startTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartPicker(false);
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
                  setShowEndPicker(false);
                  if (selectedDate) setEndTime(selectedDate);
                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ flex: 1 }}>Remind Me</Text>
              <Switch value={remindMe} onValueChange={setRemindMe} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 6,
                  padding: 10,
                  width: "48%",
                  alignItems: "center",
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddEvent}
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: 6,
                  padding: 10,
                  width: "48%",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarScreen;
