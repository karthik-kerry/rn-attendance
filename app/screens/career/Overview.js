import Header from "@/app/components/Header";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  Switch,
} from "react-native";
import { base_url } from "../../constant/api";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/app/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Path } from "react-native-svg";
import dayjs from "dayjs";

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
const getToday = () => new Date();
const pad = (v) => String(v).padStart(2, "0");
const toLocalDateStr = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatDisplay = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatLocalDateTime = (date) => {
  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const formatShortDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM");
};

const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr; // already a Date
  const [year, month, day] = String(dateStr).split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getStartOfDayISO = (dateStr) => {
  const d = parseLocalDate(dateStr);
  d.setHours(0, 0, 0, 0);
  return formatLocalDateTime(d);
};

const getEndOfDayISO = (dateStr) => {
  const today = new Date();
  const selected = parseLocalDate(dateStr);
  if (selected.toDateString() === today.toDateString())
    return formatLocalDateTime(new Date());
  selected.setHours(23, 59, 59, 999);
  return formatLocalDateTime(selected);
};

const STAT_CARD_TEMPLATE = [
  {
    title: "Total Application",
    apiKey: "total_applicatant_count",
    change: 20,
    up: true,
  },
  {
    title: "Screening",
    apiKey: "total_screening_count",
    change: 40,
    up: true,
  },
  {
    title: "Interviews",
    apiKey: "total_interviews_count",
    change: 20,
    up: true,
  },
  {
    title: "Offered",
    apiKey: "total_offered_count",
    change: 8,
    up: false,
  },
  {
    title: "Yet To Join",
    apiKey: "total_yet_to_join_count",
    change: 12,
    up: false,
  },
  {
    title: "Offer Declined",
    apiKey: "total_offered_declined_count",
    change: 20,
    up: true,
  },
  {
    title: "Hired",
    apiKey: "total_hired_count",
    change: 40,
    up: true,
  },
];

const getCurrentFYStart = () => {
  const today = new Date();
  return today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
};

const getCurrentMonthRange = (startDay = 1) => {
  const today = new Date();
  const periodStart =
    today.getDate() >= startDay
      ? new Date(today.getFullYear(), today.getMonth(), startDay)
      : new Date(today.getFullYear(), today.getMonth() - 1, startDay);
  periodStart.setHours(0, 0, 0, 0);
  return {
    start: toLocalDateStr(periodStart),
    end: toLocalDateStr(today),
  };
};

const getFYMonthRange = (
  monthIdx,
  fyStart = getCurrentFYStart(),
  startDay = 1,
) => {
  const year = monthIdx >= 3 ? fyStart : fyStart + 1;
  const start = new Date(year, monthIdx, startDay);
  const end = new Date(year, monthIdx + 1, startDay - 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
};

const getFYQuarterRange = (
  qIdx,
  fyStart = getCurrentFYStart(),
  startDay = 1,
) => {
  const quarters = [
    [3, 5],
    [6, 8],
    [9, 11],
    [0, 2],
  ];
  const [sm, em] = quarters[qIdx];
  const startYear = qIdx === 3 ? fyStart + 1 : fyStart;
  const endYear = qIdx === 3 ? fyStart + 1 : fyStart;
  const start = new Date(startYear, sm, startDay);
  const end = new Date(endYear, em + 1, startDay - 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
};

const getFYHalfRange = (hIdx, fyStart = getCurrentFYStart(), startDay = 1) => {
  if (hIdx === 0) {
    const start = new Date(fyStart, 3, startDay);
    const end = new Date(fyStart, 9, startDay - 1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
  }
  const start = new Date(fyStart, 9, startDay);
  const end = new Date(fyStart + 1, 3, startDay - 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
};

const getFYFullRange = (fyStart = getCurrentFYStart(), startDay = 1) => {
  const start = new Date(fyStart, 3, startDay);
  const end = new Date(fyStart + 1, 3, startDay - 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
};

const computeRangeForFilter = (
  filterType,
  subIdx,
  fyStart = getCurrentFYStart(),
  startDay = 1,
) => {
  const idx = subIdx !== "" && subIdx !== undefined ? parseInt(subIdx, 10) : 0;
  switch (filterType) {
    case "current_month":
      return getCurrentMonthRange(startDay);
    case "weekly":
      return { start: "", end: "" };
    case "monthly":
      return getFYMonthRange(isNaN(idx) ? 3 : idx, fyStart, startDay);
    case "quarterly":
      return getFYQuarterRange(isNaN(idx) ? 0 : idx, fyStart, startDay);
    case "half_yearly":
      return getFYHalfRange(isNaN(idx) ? 0 : idx, fyStart, startDay);
    case "financial_year":
      return getFYFullRange(fyStart, startDay);
    default:
      return getCurrentMonthRange(startDay);
  }
};

// ─── NEW HELPERS (add these) ──────────────────────────────────────────────────

const FILTER_TYPE_OPTIONS = [
  { label: "Current Month", value: "current_month" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half Yearly", value: "half_yearly" },
  { label: "Financial Year", value: "financial_year" },
];

const FILTER_FORM_FIELDS = {
  current_month: { key: "filter", value: "current_month" },
  weekly: { key: "filter", value: "weekly" },
  monthly: { key: "filter", value: "monthly" },
  quarterly: { key: "filter", value: "quarterly" },
  half_yearly: { key: "filter", value: "halfly" },
  financial_year: { key: "filter", value: "yearly" },
  custom: { key: "filter", value: "monthly" },
};

const FILTER_LABELS = {
  current_month: "Current Month",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  half_yearly: "Half Yearly",
  financial_year: "Financial Year",
  custom: "Custom Range",
};

const MONTHS_FY_ORDER = [
  { label: "April", idx: 3 },
  { label: "May", idx: 4 },
  { label: "June", idx: 5 },
  { label: "July", idx: 6 },
  { label: "August", idx: 7 },
  { label: "September", idx: 8 },
  { label: "October", idx: 9 },
  { label: "November", idx: 10 },
  { label: "December", idx: 11 },
  { label: "January", idx: 0 },
  { label: "February", idx: 1 },
  { label: "March", idx: 2 },
];

const QUARTER_OPTIONS = [
  { label: "Q1 (Apr–Jun)", idx: 0 },
  { label: "Q2 (Jul–Sep)", idx: 1 },
  { label: "Q3 (Oct–Dec)", idx: 2 },
  { label: "Q4 (Jan–Mar)", idx: 3 },
];

const HALF_OPTIONS = [
  { label: "H1 (Apr–Sep)", idx: 0 },
  { label: "H2 (Oct–Mar)", idx: 1 },
];

const getSubOptions = (filterType) => {
  if (filterType === "quarterly") return QUARTER_OPTIONS;
  if (filterType === "half_yearly") return HALF_OPTIONS;
  if (filterType === "monthly") return MONTHS_FY_ORDER;
  return [];
};

const getDefaultSubIdx = (filterType) => {
  const opts = getSubOptions(filterType);
  return opts.length > 0 ? String(opts[0].idx) : "";
};

const buildFYYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];

  for (let y = currentYear - 6; y <= currentYear + 5; y++) {
    years.push({
      label: `FY ${String(y).slice(-2)}-${String(y + 1).slice(-2)}`,
      value: y,
    });
  }

  return years;
};

const getWeekOptions = (fyStart = getCurrentFYStart()) => {
  const fyBegin = new Date(fyStart, 3, 1);
  const fyEnd = new Date(fyStart + 1, 2, 31);
  const weeks = [];
  let cursor = new Date(fyBegin);
  const dow = cursor.getDay();
  if (dow !== 1) cursor.setDate(cursor.getDate() - ((dow + 6) % 7));
  let wNum = 1;
  while (cursor <= fyEnd) {
    const wStart = new Date(cursor);
    const wEnd = new Date(cursor);
    wEnd.setDate(wEnd.getDate() + 6);
    weeks.push({
      label: `W${wNum} (${wStart.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}–${wEnd.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })})`,
      start: wStart.toISOString().split("T")[0],
      end: wEnd.toISOString().split("T")[0],
      idx: wNum,
    });
    cursor.setDate(cursor.getDate() + 7);
    wNum++;
  }
  return weeks;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr); // ✅ was new Date(dateStr)
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const YearPickerModal = ({ visible, selectedYear, onSelect, onClose }) => {
  const currentYear = new Date().getFullYear();

  const [pageStart, setPageStart] = useState(
    Math.floor((selectedYear || currentYear) / 12) * 12,
  );

  useEffect(() => {
    if (selectedYear) {
      setPageStart(Math.floor(selectedYear / 12) * 12);
    }
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
        style={styles.yearPickerOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.yearPickerCard}>
          {/* Header */}
          <View style={styles.yearPickerHeader}>
            <Text style={styles.yearPickerTitle}>Select Year</Text>

            <TouchableOpacity style={styles.yearPickerClose} onPress={onClose}>
              <Text style={styles.yearPickerCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation */}
          <View style={styles.yearPickerNav}>
            <TouchableOpacity
              style={styles.yearPickerNavBtn}
              onPress={() => setPageStart((p) => p - 12)}
            >
              <Text style={styles.yearPickerNavText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.yearPickerRange}>
              {pageStart} - {pageStart + 11}
            </Text>

            <TouchableOpacity
              style={styles.yearPickerNavBtn}
              onPress={() => setPageStart((p) => p + 12)}
            >
              <Text style={styles.yearPickerNavText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Grid */}
          <View style={styles.yearPickerGrid}>
            {years.map((year) => {
              const isSelected = selectedYear === year;
              const isCurrent = currentYear === year;

              return (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearPickerCell,
                    isSelected && styles.yearPickerCellActive,
                    isCurrent && !isSelected && styles.yearPickerCellCurrent,
                  ]}
                  onPress={() => {
                    onSelect(year);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.yearPickerCellText,
                      isSelected && styles.yearPickerCellTextActive,
                      isCurrent &&
                        !isSelected &&
                        styles.yearPickerCellTextCurrent,
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

// ─── OVERVIEW SCREEN ──────────────────────────────────────────────────────────
const Overview = () => {
  const navigation = useNavigation();
  const [companyCalendar, setCompanyCalendar] = useState(null);
  const startDayRef = useRef(1);
  const [userData, setUserData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [activeSubIdx, setActiveSubIdx] = useState(new Date().getMonth());
  const [stats, setStats] = useState(
    STAT_CARD_TEMPLATE.map((t) => ({
      title: t.title,
      value: "-",
      change: t.change,
      up: t.up,
    })),
  );
  const [statsLoading, setStatsLoading] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState("current_month");
  const [activeDateRange, setActiveDateRange] = useState({
    start: "",
    end: "",
  });

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedFYStart, setSelectedFYStart] = useState(getCurrentFYStart());
  const [pendingFilterType, setPendingFilterType] = useState("current_month");
  const [pendingSubIdx, setPendingSubIdx] = useState("");
  const [pendingStart, setPendingStart] = useState("");
  const [pendingEnd, setPendingEnd] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showWeekDatePicker, setShowWeekDatePicker] = useState(false);
  // ✅ ADD these:

  const subOptions = getSubOptions(pendingFilterType);

  const subDisabled = ["current_month", "weekly", "financial_year"].includes(
    pendingFilterType,
  );
  const subFieldLabel =
    pendingFilterType === "quarterly"
      ? "Quarter"
      : pendingFilterType === "half_yearly"
        ? "Half"
        : "Month";

  const customDateError =
    isCustom && pendingStart && pendingEnd && pendingStart > pendingEnd;

  const isApplyDisabled = isCustom
    ? !pendingStart || !pendingEnd || !!customDateError
    : !pendingStart || !pendingEnd;

  const openDateModal = () => {
    const sd = startDayRef.current;
    const custom = activeFilterType === "custom";
    const fType = custom ? "current_month" : activeFilterType;
    const subToUse =
      activeSubIdx !== "" ? activeSubIdx : getDefaultSubIdx(fType);

    setIsCustom(custom);
    setPendingFilterType(fType);
    setPendingSubIdx(subToUse);

    if (custom) {
      setPendingStart(activeDateRange.start);
      setPendingEnd(activeDateRange.end);
    } else {
      const range = computeRangeForFilter(fType, subToUse, selectedFYStart, sd); // ✅
      setPendingStart(range.start);
      setPendingEnd(range.end);
    }

    setSelectedFYStart(getCurrentFYStart());
    setActivePicker(null);
    setDateModalVisible(true);
  };

  const closeDateModal = () => {
    setActivePicker(null);
    setDateModalVisible(false);
  };

  const handleFilterTypeChange = (val) => {
    const sd = startDayRef.current;
    if (val === "current_month" && selectedFYStart !== getCurrentFYStart())
      return;
    setPendingFilterType(val);
    const defSub = getDefaultSubIdx(val);
    setPendingSubIdx(defSub);
    const range = computeRangeForFilter(val, defSub, selectedFYStart, sd); // ✅
    setPendingStart(range.start);
    setPendingEnd(range.end);
    setActivePicker(null);
  };

  const handleSubChange = (val) => {
    const sd = startDayRef.current;
    setPendingSubIdx(val);
    const range = computeRangeForFilter(
      pendingFilterType,
      val,
      selectedFYStart,
      sd,
    ); // ✅
    setPendingStart(range.start);
    setPendingEnd(range.end);
  };

  const handleFYYearChange = (fyYear) => {
    const sd = startDayRef.current;
    setSelectedFYStart(fyYear);
    if (
      fyYear !== getCurrentFYStart() &&
      pendingFilterType === "current_month"
    ) {
      setPendingFilterType("monthly");
      const defSub = getDefaultSubIdx("monthly");
      setPendingSubIdx(defSub);
      const range = computeRangeForFilter("monthly", defSub, fyYear, sd); // ✅
      setPendingStart(range.start);
      setPendingEnd(range.end);
    } else {
      const range = computeRangeForFilter(
        pendingFilterType,
        pendingSubIdx,
        fyYear,
        sd,
      ); // ✅
      setPendingStart(range.start);
      setPendingEnd(range.end);
    }
  };

  const handleToggleCustom = (val) => {
    const sd = startDayRef.current;
    setIsCustom(val);
    if (!val) {
      const range = computeRangeForFilter(
        pendingFilterType,
        pendingSubIdx,
        selectedFYStart,
        sd,
      );
      setPendingStart(range.start);
      setPendingEnd(range.end);
    }
    setActivePicker(null);
  };

  const handleClearFilter = () => {
    const sd = startDayRef.current;
    const range = getCurrentMonthRange(sd); // ✅
    setIsCustom(false);
    setPendingFilterType("current_month");
    setPendingSubIdx("");
    setPendingStart(range.start);
    setPendingEnd(range.end);
    setSelectedFYStart(getCurrentFYStart());
    setActivePicker(null);
  };

  const clearActiveFilter = () => {
    const sd = startDayRef.current;
    const range = getCurrentMonthRange(sd); // ✅
    setActiveFilterType("current_month");
    setActiveDateRange(range);
    setActiveSubIdx("");
    setSelectedFYStart(getCurrentFYStart());
  };

  const applyDateRange = () => {
    if (isApplyDisabled) return;
    const fType = isCustom ? "custom" : pendingFilterType;
    setActiveFilterType(fType);
    setActiveDateRange({ start: pendingStart, end: pendingEnd });
    setActiveSubIdx(pendingSubIdx);
    closeDateModal();
  };

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("userData");
      setUserData(JSON.parse(data));
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userData || !selectedCompany) return;

    const fetchCalendar = async () => {
      try {
        const res = await axiosInstance.get(
          `${base_url}/career/cmpstartdayweek_crud/${userData.user_id}/${selectedCompany.id}/`,
        );
        const cal = res.data || {};
        setCompanyCalendar(cal);
        startDayRef.current = cal.monthly_start_day ?? 1;
        const sd = cal.monthly_start_day ?? 1;
        const range = getCurrentMonthRange(sd);
        setActiveDateRange({ start: range.start, end: range.end });
        setPendingStart(range.start);
        setPendingEnd(range.end);
      } catch (err) {
        console.error("Calendar fetch failed:", err);
        setCompanyCalendar({
          monthly_start_day: 1,
          weekly_start_day: "MONDAY",
        });
        startDayRef.current = 1;
        const range = getCurrentMonthRange(1);
        setActiveDateRange({ start: range.start, end: range.end });
        setPendingStart(range.start);
        setPendingEnd(range.end);
      }
    };

    fetchCalendar();
  }, [userData, selectedCompany?.id]);

  const fetchStats = useCallback(async () => {
    if (!userData || !selectedCompany) return;
    if (!companyCalendar) return;
    if (!activeDateRange.start || !activeDateRange.end) return;
    setStatsLoading(true);
    try {
      const startISO = getStartOfDayISO(activeDateRange.start);
      const endISO = getEndOfDayISO(activeDateRange.end);
      const endpoint = `${base_url}/career/total_applicant/${userData.user_id}/${selectedCompany.id}/?from_date=${startISO}&to_date=${endISO}`;
      console.log("Fetching dashboard with endpoint:", endpoint);

      const formData = new FormData();

      const { key, value } =
        FILTER_FORM_FIELDS[activeFilterType] ||
        FILTER_FORM_FIELDS.current_month;

      const payload = new URLSearchParams();
      payload.append(key, value);

      const res = await axiosInstance.post(endpoint, payload.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

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

      console.log("STATUS:", error?.response?.status);
      console.log("DATA:", error?.response?.data);
      console.log("MESSAGE:", error?.message);
    } finally {
      setStatsLoading(false);
    }
  }, [
    userData,
    selectedCompany,
    activeDateRange,
    activeFilterType,
    companyCalendar,
  ]);

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

  const defaultRange = getCurrentMonthRange(startDayRef.current);
  const isDefault =
    activeFilterType === "current_month" &&
    selectedFYStart === getCurrentFYStart() &&
    activeDateRange.start === defaultRange.start &&
    activeDateRange.end === defaultRange.end;

  const activeLabel = (() => {
    let lbl = FILTER_LABELS[activeFilterType] || activeFilterType;
    if (activeFilterType === "quarterly") {
      const f = QUARTER_OPTIONS.find(
        (q) => String(q.idx) === String(activeSubIdx),
      );
      if (f) lbl += ` · ${f.label}`;
    } else if (activeFilterType === "half_yearly") {
      const f = HALF_OPTIONS.find(
        (h) => String(h.idx) === String(activeSubIdx),
      );
      if (f) lbl += ` · ${f.label}`;
    } else if (activeFilterType === "monthly") {
      const f = MONTHS_FY_ORDER.find(
        (m) => String(m.idx) === String(activeSubIdx),
      );
      if (f) lbl += ` · ${f.label}`;
    }
    return lbl;
  })();

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#F4F6F8" barStyle="dark-content" />
        <Header title="Overview" navigate={() => navigation.goBack()} />

        <View style={styles.filterStrip}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeTxt} numberOfLines={1}>
              {activeLabel}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>

          <View style={styles.fyBadge}>
            <Text style={styles.fyBadgeTxt}>
              FY {selectedFYStart}-{String(selectedFYStart + 1).slice(-2)}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>

          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeTxt} numberOfLines={1}>
              {formatShortDate(activeDateRange.start)} –{" "}
              {formatShortDate(activeDateRange.end)}
            </Text>
          </View>

          {!isDefault && (
            <TouchableOpacity
              onPress={clearActiveFilter}
              style={styles.clearIcon}
            >
              <Text style={{ fontSize: 17, color: "#dc2626" }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

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

            {/* <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path
                d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                stroke="#64748B"
                strokeWidth={1.5}
              />
            </Svg> */}
            <Svg width={20} height={20} viewBox="0 0 24 30" fill="none">
              <Path
                d="M8 2V5"
                stroke="#64748B"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Path
                d="M16 2V5"
                stroke="#64748B"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Path
                d="M3 9H21"
                stroke="#64748B"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Path
                d="M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                stroke="#64748B"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
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
      {/* DATE RANGE MODAL */}
      <Modal
        visible={dateModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.filterModalOverlay}
          activeOpacity={1}
          onPress={closeDateModal}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dateModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Filter</Text>
              <TouchableOpacity
                onPress={closeDateModal}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.dateModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              // contentContainerStyle={{ paddingBottom: 8 }}
              nestedScrollEnabled={true}
            >
              {/* ── Custom Range Toggle ── */}
              <View style={styles.toggleRow}>
                <Switch
                  value={isCustom}
                  onValueChange={handleToggleCustom}
                  trackColor={{ false: "#E5E7EB", true: "#BFDBFE" }}
                  thumbColor={isCustom ? "#2563EB" : "#9CA3AF"}
                />
                <Text style={styles.toggleLabel}>Custom Range</Text>
              </View>

              {/* ══ CUSTOM MODE ══ */}
              {isCustom ? (
                <>
                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
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
                      {pendingStart
                        ? formatDisplayDate(pendingStart)
                        : "Select start date"}
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
                      value={pendingStart ? new Date(pendingStart) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "calendar"}
                      maximumDate={
                        pendingEnd ? new Date(pendingEnd) : new Date()
                      }
                      onChange={(_, date) => {
                        if (date) {
                          setPendingStart(date);
                          if (Platform.OS === "android") setActivePicker(null);
                        }
                      }}
                      style={styles.datePicker}
                    />
                  )}

                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
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
                      {pendingEnd
                        ? formatDisplayDate(pendingEnd)
                        : "Select end date"}
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
                      value={pendingEnd ? new Date(pendingEnd) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "calendar"}
                      minimumDate={
                        pendingStart ? new Date(pendingStart) : undefined
                      }
                      maximumDate={new Date()}
                      onChange={(_, date) => {
                        if (date) {
                          setPendingEnd(date);
                          if (Platform.OS === "android") setActivePicker(null);
                        }
                      }}
                      style={styles.datePicker}
                    />
                  )}
                  {customDateError && (
                    <Text style={styles.dateError}>
                      From date cannot be later than To date.
                    </Text>
                  )}
                </>
              ) : (
                /* ══ PRESET MODE ══ */
                <>
                  {/* ── Year ── */}
                  <View style={{ marginTop: 16 }}>
                    <View style={styles.yearLabelRow}>
                      <Text style={styles.fieldLabel}>Year</Text>
                      <View style={styles.fyBadge}>
                        <Text style={styles.fyBadgeText}>
                          FY {selectedFYStart}–
                          {String(selectedFYStart + 1).slice(-2)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.selectBtn}
                      onPress={() => setShowYearPicker(true)}
                    >
                      <Text style={styles.selectBtnText}>
                        FY {selectedFYStart}-
                        {String(selectedFYStart + 1).slice(-2)}
                      </Text>
                      <Text style={styles.selectArrow}>⌄</Text>
                    </TouchableOpacity>
                  </View>

                  {/* ── Filter Type + Period (side by side like React) ── */}
                  <View style={styles.rowTwo}>
                    {/* Filter Type dropdown */}
                    <View style={styles.halfCol}>
                      <Text style={styles.fieldLabel}>Filter Type</Text>
                      <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={() =>
                          setActivePicker(
                            activePicker === "filterType" ? null : "filterType",
                          )
                        }
                      >
                        <Text style={styles.selectBtnText} numberOfLines={1}>
                          {FILTER_TYPE_OPTIONS.find(
                            (o) => o.value === pendingFilterType,
                          )?.label || "Select"}
                        </Text>
                        <Text style={styles.selectArrow}>⌄</Text>
                      </TouchableOpacity>
                      {activePicker === "filterType" && (
                        <View style={styles.dropdownList}>
                          {FILTER_TYPE_OPTIONS.map((opt) => {
                            const isDisabled =
                              opt.value === "current_month" &&
                              selectedFYStart !== getCurrentFYStart();
                            return (
                              <TouchableOpacity
                                key={opt.value}
                                style={[
                                  styles.dropdownItem,
                                  pendingFilterType === opt.value &&
                                    styles.dropdownItemActive,
                                  isDisabled && styles.dropdownItemDisabled,
                                ]}
                                onPress={() => {
                                  if (isDisabled) return;
                                  handleFilterTypeChange(opt.value);
                                  setActivePicker(null);
                                }}
                                activeOpacity={isDisabled ? 1 : 0.7}
                              >
                                <Text
                                  style={[
                                    styles.dropdownItemText,
                                    pendingFilterType === opt.value &&
                                      styles.dropdownItemTextActive,
                                    isDisabled &&
                                      styles.dropdownItemTextDisabled,
                                  ]}
                                >
                                  {opt.label}
                                </Text>
                                {pendingFilterType === opt.value && (
                                  <Text style={styles.dropdownItemCheck}>
                                    ✓
                                  </Text>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      )}
                    </View>

                    {/* Period dropdown */}
                    <View style={styles.halfCol}>
                      <Text style={styles.fieldLabel}>
                        {subDisabled ? "Period" : subFieldLabel}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.selectBtn,
                          subDisabled && styles.selectBtnDisabled,
                        ]}
                        onPress={() => {
                          if (subDisabled) return;
                          setActivePicker(
                            activePicker === "subPeriod" ? null : "subPeriod",
                          );
                        }}
                        activeOpacity={subDisabled ? 1 : 0.7}
                      >
                        <Text
                          style={[
                            styles.selectBtnText,
                            subDisabled && styles.selectBtnTextDisabled,
                          ]}
                          numberOfLines={1}
                        >
                          {subDisabled
                            ? "—"
                            : subOptions.find(
                                (o) => String(o.idx) === String(pendingSubIdx),
                              )?.label || "Select"}
                        </Text>
                        <Text
                          style={[
                            styles.selectArrow,
                            subDisabled && { color: "#D1D5DB" },
                          ]}
                        >
                          ⌄
                        </Text>
                      </TouchableOpacity>
                      {activePicker === "subPeriod" && !subDisabled && (
                        <View style={styles.dropdownList}>
                          <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                          >
                            {subOptions.map((opt) => (
                              <TouchableOpacity
                                key={opt.idx}
                                style={[
                                  styles.dropdownItem,
                                  String(pendingSubIdx) === String(opt.idx) &&
                                    styles.dropdownItemActive,
                                ]}
                                onPress={() => {
                                  handleSubChange(String(opt.idx));
                                  setActivePicker(null);
                                }}
                              >
                                <Text
                                  style={[
                                    styles.dropdownItemText,
                                    String(pendingSubIdx) === String(opt.idx) &&
                                      styles.dropdownItemTextActive,
                                  ]}
                                >
                                  {opt.label}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* ── Weekly Picker ── */}
                  {pendingFilterType === "weekly" && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={styles.fieldLabel}>Select Week</Text>
                      <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={() => setShowWeekDatePicker(true)}
                      >
                        <Text style={styles.selectBtnText}>
                          {pendingStart && pendingEnd
                            ? `${formatDisplayDate(pendingStart)} - ${formatDisplayDate(pendingEnd)}`
                            : "Select Week"}
                        </Text>

                        <Text style={styles.selectArrow}>⌄</Text>
                      </TouchableOpacity>

                      {showWeekDatePicker && (
                        <DateTimePicker
                          value={new Date()}
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "inline" : "calendar"
                          }
                          maximumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            setShowWeekDatePicker(false);
                            if (selectedDate) {
                              const start = new Date(selectedDate);
                              const day = start.getDay();
                              const diff =
                                start.getDate() - day + (day === 0 ? -6 : 1);
                              start.setDate(diff);
                              start.setHours(0, 0, 0, 0);
                              const end = new Date(start);
                              end.setDate(start.getDate() + 6);
                              end.setHours(23, 59, 59, 999);

                              setPendingStart(toLocalDateStr(start)); // ✅ was toISOString
                              setPendingEnd(toLocalDateStr(end)); // ✅ was toISOString
                            }
                          }}
                        />
                      )}
                    </View>
                  )}

                  {/* ── Start & End (side by side, disabled — mirrors React) ── */}
                  <View style={[styles.rowTwo, { marginTop: 16 }]}>
                    <View style={styles.halfCol}>
                      <Text style={styles.fieldLabel}>Start Date</Text>
                      <View style={styles.disabledDateBox}>
                        <Text style={styles.disabledDateText}>
                          {pendingStart ? formatDisplayDate(pendingStart) : "—"}
                        </Text>
                        <Svg width={16} height={16} viewBox="0 0 24 24">
                          <Path
                            d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                            stroke="#9CA3AF"
                            strokeWidth={1.5}
                          />
                        </Svg>
                      </View>
                    </View>

                    <View style={styles.halfCol}>
                      <Text style={styles.fieldLabel}>End Date</Text>
                      <View style={styles.disabledDateBox}>
                        <Text style={styles.disabledDateText}>
                          {pendingEnd ? formatDisplayDate(pendingEnd) : "—"}
                        </Text>
                        <Svg width={16} height={16} viewBox="0 0 24 24">
                          <Path
                            d="M7 2v2M17 2v2M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                            stroke="#9CA3AF"
                            strokeWidth={1.5}
                          />
                        </Svg>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
            <YearPickerModal
              visible={showYearPicker}
              selectedYear={selectedFYStart}
              onSelect={handleFYYearChange}
              onClose={() => setShowYearPicker(false)}
            />
            {/* ── Footer ── */}
            <View style={styles.dateModalActions}>
              <TouchableOpacity
                style={styles.dateCancelBtn}
                onPress={handleClearFilter}
              >
                <Text style={styles.dateCancelText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.dateApplyBtn,
                  isApplyDisabled && styles.dateApplyBtnDisabled,
                ]}
                onPress={applyDateRange}
                disabled={isApplyDisabled}
              >
                <Text style={styles.dateApplyText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
        {item.title !== "Yet To Join" && (
          <Text
            style={[
              styles.changeText,
              { color: item.up ? "#16a34a" : "#dc2626" },
            ]}
          >
            {item.up ? "↑" : "↓"} {String(item.change).replace(/[+-]/, "")}%
          </Text>
        )}
      </Text>
    </View>
  </View>
);

export default Overview;

const styles = {
  container: { flex: 1 },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },

  filterStrip: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },

  typeBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    maxWidth: 160,
  },

  typeBadgeTxt: { fontSize: 12, fontWeight: "600", color: "#2563EB" },

  fyBadge: {
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  fyBadgeTxt: { fontSize: 12, fontWeight: "600", color: "#6B7280" },

  chevron: { fontSize: 14, color: "#9CA3AF" },

  dateBadge: {
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flex: 1,
  },

  dateBadgeTxt: { fontSize: 12, fontWeight: "600", color: "#6B7280" },

  clearIcon: { padding: 4 },

  filterIconTxt: { fontSize: 17, color: "#2563EB" },

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

  loaderWrapper: { alignItems: "center", paddingVertical: 40 },
  loaderText: { fontSize: 14, color: "#888", marginTop: 12 },

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
  // New styles to add — drop-in alongside existing ones

  filterModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  // Replace dateModalCard with this:
  dateModalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  fieldLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },

  yearLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },

  fyBadge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#C7DAFF",
  },

  fyBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  // Reusable select button (mimics Ant Design Select)
  selectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  selectBtnDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },

  selectBtnText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },

  selectBtnTextDisabled: {
    color: "#9CA3AF",
  },

  selectArrow: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 4,
    minHeight: 50,
    maxHeight: 220,
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  dropdownItemActive: {
    backgroundColor: "#EFF6FF",
  },

  dropdownItemDisabled: {
    opacity: 0.4,
  },

  dropdownItemText: {
    fontSize: 14,
    color: "#374151",
  },

  dropdownItemTextActive: {
    color: "#2563EB",
    fontWeight: "600",
  },

  dropdownItemTextDisabled: {
    color: "#9CA3AF",
  },

  dropdownItemCheck: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "600",
  },

  // Side-by-side two-column row
  rowTwo: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  halfCol: {
    flex: 1,
  },

  // Disabled date display box (mirrors React's disabled DatePicker)
  disabledDateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },

  disabledDateText: {
    fontSize: 13,
    color: "#6B7280",
    flex: 1,
  },
  yearPickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  yearPickerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 360,
  },

  yearPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  yearPickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  yearPickerClose: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  yearPickerCloseText: {
    fontSize: 15,
    color: "#6B7280",
  },

  yearPickerNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  yearPickerNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  yearPickerNavText: {
    fontSize: 20,
    color: "#374151",
  },

  yearPickerRange: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  yearPickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  yearPickerCell: {
    width: "31%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },

  yearPickerCellActive: {
    backgroundColor: "#2563EB",
  },

  yearPickerCellCurrent: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  yearPickerCellText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  yearPickerCellTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  yearPickerCellTextCurrent: {
    color: "#2563EB",
    fontWeight: "700",
  },
};
