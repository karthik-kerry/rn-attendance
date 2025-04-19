import {
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { Agenda } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const CalendarScreen = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState("");
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [remindMe, setRemindMe] = useState(false);

  const loadItems = (day) => {
    const newItems = { ...items };
    for (let i = -15; i < 15; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      const dateStr = new Date(time).toISOString().split("T")[0];

      if (!newItems[dateStr]) {
        newItems[dateStr] = [];
      }
    }
    setItems(newItems);
  };

  const renderItem = (item) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        marginRight: 10,
        marginTop: 17,
        borderRadius: 10,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 14, marginTop: 5 }}>
        {new Date(item.startTime).toLocaleTimeString()} -{" "}
        {new Date(item.endTime).toLocaleTimeString()}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
      <Text style={{ fontSize: 14, marginTop: 5 }}>{item.note}</Text>
      <Text style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
        {item.completed ? "✅ Completed" : "⏳ Pending"}
      </Text>
    </View>
  );

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleAddEvent = () => {
    if (eventName.trim() === "") return;

    const newItems = { ...items };
    if (!newItems[selectedDate]) {
      newItems[selectedDate] = [];
    }

    newItems[selectedDate].push({
      name: eventName,
      note,
      completed: false,
      startTime,
      endTime,
      remindMe,
      height: 70,
    });

    setItems(newItems);
    setEventName("");
    setNote("");
    setRemindMe(false);
    setModalVisible(false);
  };

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
      <Header title="Calendar" navigate={() => navigation.goBack()} />
      <Agenda
        style={{ marginTop: 20 }}
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().split("T")[0]}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        theme={{
          agendaDayTextColor: "black",
          agendaDayNumColor: "#2563EB",
          agendaTodayColor: "#2563EB",
          agendaKnobColor: "#2563EB",
        }}
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
              width: "90%",
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginBottom: 20,
                textAlign: "center",
                fontFamily: "Inter-SemiBold",
                color: "#1b1b1b",
              }}
            >
              Add New Event
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: "#64748B",
                  marginBottom: 5,
                }}
              >
                Event Name
              </Text>
              <TextInput
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
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: "#64748B",
                  marginBottom: 5,
                }}
              >
                Note
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                multiline
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  height: 80,
                  marginBottom: 10,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
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

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontFamily: "Inter-Regular",
                  color: "#1b1b1b",
                }}
              >
                Remind me
              </Text>
              <Switch value={remindMe} onValueChange={setRemindMe} />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#64748B",
                  borderRadius: 47,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  width: "47%",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    color: "#64748B",
                    fontSize: 16,
                    fontFamily: "Inter-Regular",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 47,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  width: "47%",
                  backgroundColor: "#2563EB",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleAddEvent}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontFamily: "Inter-Regular",
                  }}
                >
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarScreen;
