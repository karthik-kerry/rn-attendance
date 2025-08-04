import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const AttendanceCalendar = () => {
  const markedDates = {
    "2025-07-26": { customStyles: getCustomStyle("P") },
    "2025-07-27": { customStyles: getCustomStyle("P", "home") },
    "2025-07-28": { customStyles: getCustomStyle("P") },
    "2025-07-29": { customStyles: getCustomStyle("calendar") },
    "2025-07-30": { customStyles: getCustomStyle("home") },
    "2025-07-31": { customStyles: getCustomStyle("A") },
    "2025-08-01": { customStyles: getCustomStyle("P") },
    "2025-08-02": { customStyles: getCustomStyle("P") },
    "2025-08-03": { customStyles: getCustomStyle("P", "home") },
    "2025-08-04": { customStyles: getCustomStyle("half") },
    "2025-08-05": { customStyles: getCustomStyle("R") },
    "2025-08-12": { customStyles: getCustomStyle("H") },
    "2025-08-16": { customStyles: getCustomStyle("A") },
    "2025-08-22": { customStyles: getCustomStyle("OD") },
    "2025-08-23": { customStyles: getCustomStyle("?") },
    "2025-08-09": { customStyles: getCustomStyle("L") },
  };

  return (
    <Calendar
      markingType={"custom"}
      markedDates={markedDates}
      theme={{
        calendarBackground: "#fff",
        textSectionTitleColor: "#000",
        dayTextColor: "#000",
        monthTextColor: "#000",
      }}
    />
  );
};

const getCustomStyle = (type, iconType = null) => {
  const backgroundColors = {
    P: "#d1f1d1",
    A: "#ffe2e2",
    OD: "#c2e1ff",
    L: "#fff7c2",
    R: "#d9d9d9",
    H: "#ffd6d6",
    "?": "#e4ccf7",
    calendar: "#e9f0f7",
    home: "#f0f8ff",
    half: "#d1f1d1",
  };

  return {
    container: {
      backgroundColor: backgroundColors[type] || "#fff",
      borderRadius: 5,
    },
    text: {
      color: "#000",
      fontWeight: "bold",
    },
  };
};

export default AttendanceCalendar;
