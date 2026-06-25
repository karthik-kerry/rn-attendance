import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";

const YearPickerModal = ({ visible, selectedYear, onSelect, onClose }) => {
  const currentYear = new Date().getFullYear();
  const [pageStart, setPageStart] = useState(
    Math.floor((selectedYear || currentYear) / 12) * 12,
  );

  useEffect(() => {
    if (selectedYear) setPageStart(Math.floor(selectedYear / 12) * 12);
  }, [selectedYear]);

  const years = Array.from({ length: 12 }, (_, i) => pageStart + i);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Year</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.nav}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => setPageStart((p) => p - 12)}
            >
              <Text style={styles.navTxt}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.range}>
              {pageStart} - {pageStart + 11}
            </Text>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => setPageStart((p) => p + 12)}
            >
              <Text style={styles.navTxt}>›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {years.map((year) => {
              const isSelected = selectedYear === year;
              const isCurrent = currentYear === year;
              return (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.cell,
                    isSelected && styles.cellActive,
                    isCurrent && !isSelected && styles.cellCurrent,
                  ]}
                  onPress={() => {
                    onSelect(year);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.cellTxt,
                      isSelected && styles.cellTxtActive,
                      isCurrent && !isSelected && styles.cellTxtCurrent,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default YearPickerModal;

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeTxt: { fontSize: 15, color: "#6B7280" },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  navTxt: { fontSize: 20, color: "#374151" },
  range: { fontSize: 14, fontWeight: "600", color: "#374151" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cell: {
    width: "31%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  cellActive: { backgroundColor: "#2563EB" },
  cellCurrent: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  cellTxt: { fontSize: 14, color: "#374151", fontWeight: "500" },
  cellTxtActive: { color: "#fff", fontWeight: "700" },
  cellTxtCurrent: { color: "#2563EB", fontWeight: "700" },
};
