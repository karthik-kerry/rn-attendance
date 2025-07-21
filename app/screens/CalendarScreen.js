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
                marginBottom: 10,
              }}
            />

            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text style={{ marginBottom: 5 }}>
                Start: {startTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text style={{ marginBottom: 5 }}>
                End: {endTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

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

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ flex: 1 }}>Remind Me</Text>
              <Switch value={remindMe} onValueChange={setRemindMe} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
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
