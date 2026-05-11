import Header from "@/app/components/Header";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { base_url } from "../../constant/api";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/app/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const getToday = () => new Date();

const getStartOfCurrentMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const formatDisplay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const getStartOfDayISO = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const getEndOfDayISO = (date) => {
  const today = new Date();
  const selected = new Date(date);
  if (selected.toDateString() === today.toDateString()) {
    return new Date().toISOString();
  }
  selected.setHours(23, 59, 59, 999);
  return selected.toISOString();
};

const getMonthRange = (monthIndex) => {
  const start = new Date();
  start.setMonth(monthIndex, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setMonth(monthIndex + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getQuarterRange = (quarterIndex) => {
  const start = new Date();
  start.setMonth(quarterIndex * 3, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setMonth(quarterIndex * 3 + 3, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getHalfYearRange = (halfIndex) => {
  const start = new Date();
  start.setMonth(halfIndex * 6, 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setMonth(halfIndex * 6 + 6, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getFinancialYearRange = () => {
  const d = new Date();

  let start;
  let end;

  if (d.getMonth() >= 3) {
    start = new Date(d.getFullYear(), 3, 1);
    end = new Date(d.getFullYear() + 1, 2, 31);
  } else {
    start = new Date(d.getFullYear() - 1, 3, 1);
    end = new Date(d.getFullYear(), 2, 31);
  }

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

// ─── STAT CARD TEMPLATE ───────────────────────────────────────────────────────
const STAT_CARD_TEMPLATE = [
  {
    title: "Total Application",
    apiKey: "total_applicants",
    change: 20,
    up: true,
  },
  { title: "Screening", apiKey: "screnning", change: 40, up: true },
  { title: "Interviews", apiKey: "interviews_count", change: 20, up: true },
  { title: "Offered", apiKey: "offered_count", change: 8, up: false },
  { title: "Yet To Join", apiKey: "yet_to_join_count", change: 12, up: false },
  {
    title: "Offer Declined",
    apiKey: "offered_declined_count",
    change: 20,
    up: true,
  },
  { title: "Hired", apiKey: "hired_count", change: 40, up: true },
];

// ─── OVERVIEW SCREEN ──────────────────────────────────────────────────────────
const Overview = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);

  const [stats, setStats] = useState(
    STAT_CARD_TEMPLATE.map((t) => ({
      title: t.title,
      value: "-",
      change: t.change,
      up: t.up,
    })),
  );
  const [statsLoading, setStatsLoading] = useState(false);

  const [activeDateRange, setActiveDateRange] = useState({
    start: getStartOfCurrentMonth(),
    end: getToday(),
  });

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [pendingStart, setPendingStart] = useState(getStartOfCurrentMonth());
  const [pendingEnd, setPendingEnd] = useState(getToday());
  const [activePicker, setActivePicker] = useState(null);

  const FILTER_PRESETS = {
    monthly: "Monthly",
    quarterly: "Quarterly",
    halfYearly: "Half Yearly",
    financialYear: "Financial Year",
    custom: "Custom",
  };

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  const HALF_YEARS = ["H1", "H2"];

  const [filterType, setFilterType] = useState("monthly");
  const [selectedPeriod, setSelectedPeriod] = useState(new Date().getMonth());

  const applyMonthFilter = (monthIndex) => {
    const range = getMonthRange(monthIndex);

    setPendingStart(range.start);
    setPendingEnd(range.end);

    setSelectedPeriod(monthIndex);
    setFilterType("monthly");
  };

  const applyQuarterFilter = (quarterIndex) => {
    const range = getQuarterRange(quarterIndex);

    setPendingStart(range.start);
    setPendingEnd(range.end);

    setSelectedPeriod(quarterIndex);
    setFilterType("quarterly");
  };

  const applyHalfYearFilter = (halfIndex) => {
    const range = getHalfYearRange(halfIndex);

    setPendingStart(range.start);
    setPendingEnd(range.end);

    setSelectedPeriod(halfIndex);
    setFilterType("halfYearly");
  };

  const applyFinancialYearFilter = () => {
    const range = getFinancialYearRange();

    setPendingStart(range.start);
    setPendingEnd(range.end);

    setFilterType("financialYear");
  };

  const openDateModal = () => {
    setPendingStart(new Date(activeDateRange.start));
    setPendingEnd(new Date(activeDateRange.end));
    setActivePicker(null);
    setDateModalVisible(true);
  };

  const closeDateModal = () => {
    setActivePicker(null);
    setDateModalVisible(false);
  };

  const applyDateRange = () => {
    setActiveDateRange({ start: pendingStart, end: pendingEnd });
    closeDateModal();
  };

  const isApplyDisabled =
    !pendingStart || !pendingEnd || pendingStart > pendingEnd;

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  const fetchStats = useCallback(async () => {
    if (!userData || !selectedCompany) return;
    setStatsLoading(true);
    try {
      const startISO = getStartOfDayISO(activeDateRange.start);
      const endISO = getEndOfDayISO(activeDateRange.end);
      const endpoint = `${base_url}/career/total_applicant/${userData.user_id}/${selectedCompany.id}/?from_date=${startISO}&to_date=${endISO}`;
      const res = await axiosInstance.get(endpoint);
      const data = res.data || {};
      setStats(
        STAT_CARD_TEMPLATE.map((t) => ({
          title: t.title,
          value: data[t.apiKey] !== undefined ? data[t.apiKey] : 0,
          change: t.change,
          up: t.up,
        })),
      );
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [userData, selectedCompany, activeDateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchCompanies = async () => {
    if (!userData) return;
    try {
      const res = await axiosInstance.get(
        `${base_url}/core/userbranch_cmp_branch_list/${userData?.user_id}/`,
      );
      const fetchedCompanies = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setCompanies(fetchedCompanies);

      const storedCompany = await AsyncStorage.getItem("selectedCompany");
      if (storedCompany) {
        setSelectedCompany(JSON.parse(storedCompany));
        return;
      }
      if (fetchedCompanies.length) {
        const first = fetchedCompanies[0];
        const selectedData = {
          id: first.cmpid,
          name: first.cmp_name,
          company_shortname: first.cmp_shortname,
          branchid: first.branchid,
          branch_name: first.branch_name,
          branch_shortname: first.branch_shortname,
        };
        setSelectedCompany(selectedData);
        await AsyncStorage.setItem(
          "selectedCompany",
          JSON.stringify(selectedData),
        );
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    if (userData) fetchCompanies();
  }, [userData]);

  const updateBranch = async (companyData) => {
    try {
      const res = await axiosInstance.post(
        `${base_url}/core/grant_cmpbranch_permission/${userData?.user_id}/${companyData?.id}/`,
        { branchid: companyData?.branchid },
      );
      await AsyncStorage.setItem("modulePermissions", JSON.stringify(res.data));
    } catch (error) {
      console.log("Error updating branch:", error);
    }
  };

  const handleChange = (branchId) => {
    const selected = companies.find((c) => c.branchid === branchId);
    if (!selected) return;
    const selectedData = {
      id: selected.cmpid,
      name: selected.cmp_name,
      company_shortname: selected.cmp_shortname,
      branchid: selected.branchid,
      branch_name: selected.branch_name,
      branch_shortname: selected.branch_shortname,
    };
    Alert.alert("Change Branch", "Do you want to change the branch?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await AsyncStorage.setItem(
              "selectedCompany",
              JSON.stringify(selectedData),
            );
            setSelectedCompany(selectedData);
            await updateBranch(selectedData);
            setBranchModalVisible(false);
            Alert.alert("Success", "Branch changed successfully");
          } catch {
            Alert.alert("Error", "Failed to change branch");
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
        <Header title="Overview" navigate={() => navigation.goBack()} />

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setBranchModalVisible(true)}
          >
            <Text style={styles.dropdownText} numberOfLines={1}>
              {selectedCompany?.branch_name || "Select Branch"}
            </Text>
            <Text style={styles.icon}>⌄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateBox} onPress={openDateModal}>
            <Text style={styles.dateText} numberOfLines={1}>
              {formatDisplay(activeDateRange.start)} →{" "}
              {formatDisplay(activeDateRange.end)}
            </Text>

            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                stroke="#64748B"
                strokeWidth={1.5}
              />
            </Svg>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.filterIcon} onPress={fetchStats}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity> */}
        </View>

        {statsLoading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loaderText}>Loading stats…</Text>
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {stats.map((item, index) => (
              <StatCard key={index} item={item} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* BRANCH MODAL */}
      <Modal visible={branchModalVisible} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setBranchModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={(e) => e.stopPropagation()}
          >
            {companies.map((item) => (
              <TouchableOpacity
                key={item.branchid}
                onPress={() => {
                  setBranchModalVisible(false);
                  handleChange(item.branchid);
                }}
                style={styles.branchItem}
              >
                <Text style={styles.branchItemText}>
                  {item.cmp_shortname} – {item.branch_name}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* DATE RANGE MODAL */}
      <Modal visible={dateModalVisible} animationType="slide" transparent>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={closeDateModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dateModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Select Date Range</Text>
              <TouchableOpacity
                onPress={closeDateModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.dateModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.dateLabel}>Filter Type</Text>

            <View style={styles.filterTypeContainer}>
              {Object.entries(FILTER_PRESETS).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterTypeBtn,
                    filterType === key && styles.filterTypeBtnActive,
                  ]}
                  onPress={() => {
                    setFilterType(key);

                    if (key === "financialYear") {
                      applyFinancialYearFilter();
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.filterTypeText,
                      filterType === key && styles.filterTypeTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── MONTHLY ── */}
            {filterType === "monthly" && (
              <>
                <Text style={[styles.dateLabel, { marginTop: 18 }]}>
                  Select Month
                </Text>

                <View style={styles.periodGrid}>
                  {MONTHS.map((month, idx) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.periodBtn,
                        selectedPeriod === idx && styles.periodBtnActive,
                      ]}
                      onPress={() => applyMonthFilter(idx)}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          selectedPeriod === idx && styles.periodBtnTextActive,
                        ]}
                      >
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* ── QUARTERLY ── */}
            {filterType === "quarterly" && (
              <>
                <Text style={[styles.dateLabel, { marginTop: 18 }]}>
                  Select Quarter
                </Text>

                <View style={styles.periodGrid}>
                  {QUARTERS.map((quarter, idx) => (
                    <TouchableOpacity
                      key={quarter}
                      style={[
                        styles.periodBtn,
                        selectedPeriod === idx && styles.periodBtnActive,
                      ]}
                      onPress={() => applyQuarterFilter(idx)}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          selectedPeriod === idx && styles.periodBtnTextActive,
                        ]}
                      >
                        {quarter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* ── HALF YEARLY ── */}
            {filterType === "halfYearly" && (
              <>
                <Text style={[styles.dateLabel, { marginTop: 18 }]}>
                  Select Half Year
                </Text>

                <View style={styles.periodGrid}>
                  {HALF_YEARS.map((half, idx) => (
                    <TouchableOpacity
                      key={half}
                      style={[
                        styles.periodBtn,
                        selectedPeriod === idx && styles.periodBtnActive,
                      ]}
                      onPress={() => applyHalfYearFilter(idx)}
                    >
                      <Text
                        style={[
                          styles.periodBtnText,
                          selectedPeriod === idx && styles.periodBtnTextActive,
                        ]}
                      >
                        {half}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* ── CUSTOM DATE ── */}
            {filterType === "custom" && (
              <>
                {/* FROM DATE */}
                <Text style={[styles.dateLabel, { marginTop: 18 }]}>
                  From Date
                </Text>

                <TouchableOpacity
                  style={[
                    styles.dateInputBtn,
                    activePicker === "start" && styles.dateInputBtnActive,
                  ]}
                  onPress={() =>
                    setActivePicker(activePicker === "start" ? null : "start")
                  }
                >
                  <Text style={styles.dateInputText}>
                    {formatDisplay(pendingStart)}
                  </Text>

                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                      stroke="#64748B"
                      strokeWidth={1.5}
                    />
                  </Svg>
                </TouchableOpacity>

                {activePicker === "start" && (
                  <DateTimePicker
                    value={pendingStart}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    maximumDate={pendingEnd}
                    onChange={(_, date) => {
                      if (date) {
                        setPendingStart(date);

                        if (Platform.OS === "android") {
                          setActivePicker(null);
                        }
                      }
                    }}
                    style={styles.datePicker}
                  />
                )}

                {/* TO DATE */}
                <Text style={[styles.dateLabel, { marginTop: 18 }]}>
                  To Date
                </Text>

                <TouchableOpacity
                  style={[
                    styles.dateInputBtn,
                    activePicker === "end" && styles.dateInputBtnActive,
                  ]}
                  onPress={() =>
                    setActivePicker(activePicker === "end" ? null : "end")
                  }
                >
                  <Text style={styles.dateInputText}>
                    {formatDisplay(pendingEnd)}
                  </Text>

                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                      stroke="#64748B"
                      strokeWidth={1.5}
                    />
                  </Svg>
                </TouchableOpacity>

                {activePicker === "end" && (
                  <DateTimePicker
                    value={pendingEnd}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "calendar"}
                    minimumDate={pendingStart}
                    maximumDate={getToday()}
                    onChange={(_, date) => {
                      if (date) {
                        setPendingEnd(date);

                        if (Platform.OS === "android") {
                          setActivePicker(null);
                        }
                      }
                    }}
                    style={styles.datePicker}
                  />
                )}
              </>
            )}

            {/* Validation hint */}
            {pendingStart > pendingEnd && (
              <Text style={styles.dateError}>
                From date cannot be later than To date.
              </Text>
            )}

            {/* Cancel / Apply */}
            <View style={styles.dateModalActions}>
              <TouchableOpacity
                style={styles.dateCancelBtn}
                onPress={closeDateModal}
              >
                <Text style={styles.dateCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dateApplyBtn,
                  isApplyDisabled && styles.dateApplyBtnDisabled,
                ]}
                onPress={applyDateRange}
                disabled={isApplyDisabled}
              >
                <Text style={styles.dateApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
const StatCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.menuDots}>⋮</Text>
    </View>
    <View style={styles.cardRow}>
      <Text style={styles.cardValue}>{item.value}</Text>
      <Text
        style={[styles.changeText, { color: item.up ? "#16a34a" : "#dc2626" }]}
      >
        {item.up ? "↑" : "↓"} {item.change}%
      </Text>
    </View>
  </View>
);

export default Overview;

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  container: { flex: 1, backgroundColor: "#f5f7fb" },

  // ── Filter row ──
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  dropdown: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },
  dropdownText: { fontSize: 14, color: "#333", flexShrink: 1, marginRight: 4 },
  dateBox: {
    flex: 1.4,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8,
  },
  dateText: { fontSize: 11, color: "#333", marginRight: 4, flexShrink: 1 },
  filterIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: { fontSize: 20, color: "#2563EB" },
  icon: { fontSize: 14, color: "#888" },

  // ── Loader ──
  loaderWrapper: { alignItems: "center", paddingVertical: 40 },
  loaderText: { fontSize: 14, color: "#888", marginTop: 12 },

  // ── Stat cards ──
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 13, color: "#6b7280", flexShrink: 1, marginRight: 4 },
  menuDots: { color: "#9ca3af" },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardValue: { fontSize: 22, fontWeight: "bold", color: "#111" },
  changeText: { fontSize: 13, fontWeight: "500" },

  // ── Shared modal overlay ──
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  branchItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  branchItemText: { fontSize: 14, color: "#333" },

  // ── Date range modal ──
  dateModalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dateModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateModalTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  dateModalClose: { fontSize: 18, color: "#888" },
  dateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  dateInputBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
  },
  dateInputBtnActive: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  dateInputText: { fontSize: 14, color: "#1F2937", fontWeight: "500" },
  dateInputIcon: { fontSize: 16 },
  datePicker: { marginTop: 4, marginBottom: 4 },
  dateError: { fontSize: 12, color: "#dc2626", marginTop: 8 },
  dateModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  dateCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dateCancelText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  dateApplyBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dateApplyBtnDisabled: { backgroundColor: "#93C5FD" },
  dateApplyText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  filterTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  filterTypeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  filterTypeBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },

  filterTypeText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  filterTypeTextActive: {
    color: "#2563EB",
  },

  periodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  periodBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },

  periodBtnActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },

  periodBtnText: {
    fontSize: 12,
    color: "#374151",
  },

  periodBtnTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },
};
