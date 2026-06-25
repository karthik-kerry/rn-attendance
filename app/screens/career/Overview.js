import Header from "@/app/components/Header";
import { StatusBar } from "expo-status-bar";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import {
  formatDisplay,
  formatShortDate,
  formatDisplayDate,
  getStartOfDayISO,
  getEndOfDayISO,
  toLocalDateStr,
} from "../../utils/dateHelpers";
import {
  getCurrentFYStart,
  getCurrentMonthRange,
  computeRangeForFilter,
  normalizeRangeSplit,
  getSubOptions,
  getDefaultSubIdx,
} from "../../utils/filterHelpers";
import {
  STAT_CARD_TEMPLATE,
  SHORT_MONTHS,
  PERIOD_COLORS,
  RANGE_FIELD_MAP,
  FILTER_TYPE_OPTIONS,
  FILTER_FORM_FIELDS,
  FILTER_LABELS,
  MONTHS_FY_ORDER,
  QUARTER_OPTIONS,
  HALF_OPTIONS,
} from "../../constant/filterConstants";
import { base_url } from "../../constant/api";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/app/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { C } from "../../constant/colors";
import OverallChartsView from "../../components/Career/OverallChartsView";
import YearPickerModal from "../../components/Career/YearPickerModal";
import VerticalChartsView from "../../components/Career/VerticalChartsView";
import Case2TableRN from "../../components/Career/Case2TableRN";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import XLSX from "xlsx";

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
  const [view, setView] = useState("overall");
  const [chartData, setChartData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [budgetChartData, setBudgetChartData] = useState(null);
  const [activeVerticals, setActiveVerticals] = useState([]);
  const [pendingVerticals, setPendingVerticals] = useState([]);
  const [customFilterType, setCustomFilterType] = useState("monthly");
  const allVerticalsRef = useRef([]);
  const [allVerticalOptions, setAllVerticalOptions] = useState([]);
  const [verticalPickerVisible, setVerticalPickerVisible] = useState(false);
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
      const range = computeRangeForFilter(fType, subToUse, selectedFYStart, sd);
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
    const range = computeRangeForFilter(val, defSub, selectedFYStart, sd);
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
    );
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
      const range = computeRangeForFilter("monthly", defSub, fyYear, sd);
      setPendingStart(range.start);
      setPendingEnd(range.end);
    } else {
      const range = computeRangeForFilter(
        pendingFilterType,
        pendingSubIdx,
        fyYear,
        sd,
      );
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
    const range = getCurrentMonthRange(sd);
    setIsCustom(false);
    setPendingFilterType("current_month");
    setPendingSubIdx("");
    setPendingStart(range.start);
    setPendingEnd(range.end);
    setSelectedFYStart(getCurrentFYStart());
    setPendingVerticals([]);
    setActivePicker(null);
    setActiveFilterType("current_month");
    setActiveDateRange(range);
    setActiveSubIdx("");
    setActiveVerticals([]);
    setView("overall");
    closeDateModal();
  };

  const applyDateRange = () => {
    if (isApplyDisabled) return;
    const fType = isCustom ? "custom" : pendingFilterType;
    setActiveFilterType(fType);
    setActiveDateRange({ start: pendingStart, end: pendingEnd });
    setActiveSubIdx(pendingSubIdx);
    setActiveVerticals(pendingVerticals);
    if (pendingVerticals.length === 1) setView("overall");
    else if (pendingVerticals.length > 1) setView("vertical");
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

  const fetchStats = useCallback(async () => {
    if (!userData || !selectedCompany) return;
    if (!companyCalendar) return;
    if (!activeDateRange.start || !activeDateRange.end) return;
    setStatsLoading(true);
    try {
      const startISO = getStartOfDayISO(activeDateRange.start);
      const endISO = getEndOfDayISO(activeDateRange.end);
      const endpoint = `${base_url}/career/total_applicant/${userData.user_id}/${selectedCompany.id}/?from_date=${startISO}&to_date=${endISO}`;

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

  // ── Fetch chart data ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userData || !selectedCompany) return;
    if (!companyCalendar) return;
    if (!activeDateRange.start || !activeDateRange.end) return;

    const fetchChartData = async () => {
      if (!userData?.user_id || !selectedCompany?.id) return; // ← ADD THIS LINE
      setChartLoading(true);
      try {
        const startISO = getStartOfDayISO(activeDateRange.start);
        const endISO = getEndOfDayISO(activeDateRange.end);
        const chartFormData = new FormData();

        // if (activeVerticals.length > 0) {
        //   chartFormData.append(
        //     "departmenservicestids",
        //     JSON.stringify(activeVerticals),
        //   );
        // }

        // if (activeFilterType === "custom") {
        //   if (activeVerticals.length > 0) {
        //     const { key, value } =
        //       FILTER_FORM_FIELDS[customFilterType] ||
        //       FILTER_FORM_FIELDS.monthly;
        //     chartFormData.append(key, value);
        //   }
        // } else if (activeVerticals.length === 0) {
        //   const { key, value } =
        //     FILTER_FORM_FIELDS[activeFilterType] ||
        //     FILTER_FORM_FIELDS.current_month;
        //   chartFormData.append(key, value);
        // }

        if (activeVerticals.length > 0) {
          chartFormData.append(
            "departmenservicestids",
            JSON.stringify(activeVerticals),
          );
        }

        if (activeFilterType === "custom" && activeVerticals.length > 0) {
          const { key, value } =
            FILTER_FORM_FIELDS[customFilterType] || FILTER_FORM_FIELDS.monthly;
          chartFormData.append(key, value);
        } else if (
          activeFilterType === "custom" &&
          activeVerticals.length === 0
        ) {
          // RN's multipart body builder fails on a zero-field FormData — always
          // write at least one part so a valid boundary gets sent.
          chartFormData.append("filter", "");
        } else if (activeVerticals.length === 0) {
          const { key, value } =
            FILTER_FORM_FIELDS[activeFilterType] ||
            FILTER_FORM_FIELDS.current_month;
          chartFormData.append(key, value);
        }

        const response = await axiosInstance.post(
          `${base_url}/career/chart_datas/${userData.user_id}/${selectedCompany.id}/?from_date=${startISO}&to_date=${endISO}`,
          chartFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const apiData = response.data || {};
        const rangeData = apiData.range_split?.[0];
        const fullRangeSplit = apiData.range_split || [];
        setChartData({
          chart1: rangeData?.chart1 || [],
          chart2: rangeData?.chart2 || [],
          chart356: rangeData?.chart356 || [],
          rangeSplit: fullRangeSplit,
          cycleType: apiData.cycle_type || "Monthly",
        });

        if (activeVerticals.length === 0) {
          const seen = new Set();
          const opts = [];
          fullRangeSplit.forEach((period) => {
            [
              ...(period.chart1 || []),
              ...(period.chart2 || []),
              ...(period.chart356 || []),
            ].forEach((d) => {
              const id = d.department_services ?? d.department;
              const name =
                d.department_services_short_name ||
                d.department_name ||
                "Unknown";
              if (id !== undefined && !seen.has(id)) {
                seen.add(id);
                opts.push({ label: name, value: id });
              }
            });
          });
          if (opts.length > 0) {
            allVerticalsRef.current = opts;
            setAllVerticalOptions(opts);
          }
        }
      } catch (err) {
        console.error("Chart fetch failed:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchChartData();
  }, [
    activeDateRange.start,
    activeDateRange.end,
    userData,
    selectedCompany?.id,
    companyCalendar,
    activeVerticals,
    activeFilterType,
    customFilterType,
  ]);

  // ── Fetch budget chart data ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userData || !selectedCompany) return;
    if (!companyCalendar) return;
    if (!activeDateRange.start || !activeDateRange.end) return;

    const fetchBudget = async () => {
      try {
        const startISO = getStartOfDayISO(activeDateRange.start);
        const endISO = getEndOfDayISO(activeDateRange.end);
        const payload = new URLSearchParams();
        payload.append("filter", "monthly");
        const response = await axiosInstance.post(
          `${base_url}/career/total_applicant/${userData.user_id}/${selectedCompany.id}/?from_date=${startISO}&to_date=${endISO}`,
          payload.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
        );
        setBudgetChartData(normalizeRangeSplit(response.data || {}));
      } catch (err) {
        console.error("Budget fetch failed:", err);
      }
    };

    fetchBudget();
  }, [
    activeDateRange.start,
    activeDateRange.end,
    userData,
    selectedCompany?.id,
    companyCalendar,
  ]);

  const isCase2 = activeFilterType === "custom" && activeVerticals.length > 0;

  const effectiveView = useMemo(() => {
    if (activeVerticals.length === 1) return "overall";
    if (activeVerticals.length > 1) return "vertical";
    return view;
  }, [activeVerticals, view]);

  const filteredChartData = useMemo(() => {
    if (!chartData) return null;
    if (activeVerticals.length === 0) return chartData;
    return {
      chart1: chartData.chart1.filter((d) =>
        activeVerticals.includes(d.department_services ?? d.department),
      ),
      chart2: chartData.chart2.filter((d) =>
        activeVerticals.includes(d.department_services ?? d.department),
      ),
      chart356: chartData.chart356.filter((d) =>
        activeVerticals.includes(d.department_services ?? d.department),
      ),
    };
  }, [chartData, activeVerticals]);

  const newVsReplacementData = useMemo(() => {
    if (!filteredChartData?.chart1) return [];
    return filteredChartData.chart1.map((d) => ({
      name: d.department_services_short_name || d.department_name || "Unknown",
      new: d.new_employee_count ?? 0,
      rep: d.replacement_employee_count ?? 0,
    }));
  }, [filteredChartData]);

  const priorityOpenData = useMemo(() => {
    if (!filteredChartData?.chart2) return [];
    return filteredChartData.chart2.map((d) => ({
      name: d.department_services_short_name || d.department_name || "Unknown",
      active: d.priority_high_count ?? 0,
      open: d.priority_low_count ?? 0,
    }));
  }, [filteredChartData]);

  const hireVerticalData = useMemo(() => {
    if (!filteredChartData?.chart356) return [];
    return filteredChartData.chart356.map((d) => ({
      name: d.department_services_short_name || d.department_name || "Unknown",
      male: d.gender_counts?.male ?? 0,
      female: d.gender_counts?.female ?? 0,
    }));
  }, [filteredChartData]);

  const sourceOfHiringData = useMemo(() => {
    if (!filteredChartData?.chart356) return [];
    return filteredChartData.chart356.map((d) => ({
      name: d.department_services_short_name || d.department_name || "Unknown",
      consultancy: d.source_of_hiring_counts?.consultancy ?? 0,
      internal: d.source_of_hiring_counts?.internal ?? 0,
      portal: d.source_of_hiring_counts?.portal ?? 0,
      website: d.source_of_hiring_counts?.website ?? 0,
    }));
  }, [filteredChartData]);

  const hireVsExitData = useMemo(() => {
    if (!filteredChartData?.chart356) return [];
    return filteredChartData.chart356.map((d) => ({
      name: d.department_services_short_name || d.department_name || "Unknown",
      hire: d.hired_count ?? 0,
      exit: 0,
    }));
  }, [filteredChartData]);

  const overallNewVsReplacement = useMemo(() => {
    if (!filteredChartData?.chart1) return null;
    return {
      totalNew: filteredChartData.chart1.reduce(
        (s, d) => s + (d.new_employee_count ?? 0),
        0,
      ),
      totalRep: filteredChartData.chart1.reduce(
        (s, d) => s + (d.replacement_employee_count ?? 0),
        0,
      ),
      total: filteredChartData.chart1.reduce(
        (s, d) =>
          s + (d.new_employee_count ?? 0) + (d.replacement_employee_count ?? 0),
        0,
      ),
    };
  }, [filteredChartData]);

  const overallPriority = useMemo(() => {
    if (!filteredChartData?.chart2) return null;
    return {
      totalHigh: filteredChartData.chart2.reduce(
        (s, d) => s + (d.priority_high_count ?? 0),
        0,
      ),
      totalLow: filteredChartData.chart2.reduce(
        (s, d) => s + (d.priority_low_count ?? 0),
        0,
      ),
      total: filteredChartData.chart2.reduce(
        (s, d) =>
          s + (d.priority_high_count ?? 0) + (d.priority_low_count ?? 0),
        0,
      ),
    };
  }, [filteredChartData]);

  const overallGender = useMemo(() => {
    if (!filteredChartData?.chart356) return null;
    const male = filteredChartData.chart356.reduce(
      (s, d) => s + (d.gender_counts?.male ?? 0),
      0,
    );
    const female = filteredChartData.chart356.reduce(
      (s, d) => s + (d.gender_counts?.female ?? 0),
      0,
    );
    const transgender = filteredChartData.chart356.reduce(
      (s, d) => s + (d.gender_counts?.transgender ?? 0),
      0,
    );
    const other = filteredChartData.chart356.reduce(
      (s, d) => s + (d.gender_counts?.other ?? 0),
      0,
    );
    return {
      male,
      female,
      transgender,
      other,
      total: male + female + transgender + other,
    };
  }, [filteredChartData]);

  const overallHired = useMemo(() => {
    if (!filteredChartData?.chart356) return null;
    return filteredChartData.chart356.reduce(
      (s, d) => s + (d.hired_count ?? 0),
      0,
    );
  }, [filteredChartData]);

  const overallSourceOfHiring = useMemo(() => {
    if (!filteredChartData?.chart356) return null;
    return {
      consultancy: filteredChartData.chart356.reduce(
        (s, d) => s + (d.source_of_hiring_counts?.consultancy ?? 0),
        0,
      ),
      internal: filteredChartData.chart356.reduce(
        (s, d) => s + (d.source_of_hiring_counts?.internal ?? 0),
        0,
      ),
      portal: filteredChartData.chart356.reduce(
        (s, d) => s + (d.source_of_hiring_counts?.portal ?? 0),
        0,
      ),
      website: filteredChartData.chart356.reduce(
        (s, d) => s + (d.source_of_hiring_counts?.website ?? 0),
        0,
      ),
      total: filteredChartData.chart356.reduce(
        (s, d) =>
          s +
          Object.values(d.source_of_hiring_counts || {}).reduce(
            (a, b) => a + b,
            0,
          ),
        0,
      ),
    };
  }, [filteredChartData]);

  const overallLevelCounts = useMemo(() => {
    if (!filteredChartData?.chart356) return null;
    const agg = {};
    filteredChartData.chart356.forEach((d) => {
      Object.entries(d.level_counts || d["level_counts "] || {}).forEach(
        ([lvl, cnt]) => {
          agg[lvl] = (agg[lvl] || 0) + Number(cnt || 0);
        },
      );
    });
    return Object.keys(agg).length > 0 ? agg : null;
  }, [filteredChartData]);

  const dynamicOverallDonuts = useMemo(
    () => [
      {
        title: "New vs Replacement Hiring",
        data: [
          {
            name: "Replacement",
            value: overallNewVsReplacement?.totalRep ?? 0,
            color: C.blueLight,
          },
          {
            name: "New",
            value: overallNewVsReplacement?.totalNew ?? 0,
            color: C.blue,
          },
        ],
        center: {
          value: overallNewVsReplacement?.total ?? 0,
          label: "Total Hiring",
        },
      },
      {
        title: "Open Position",
        data: [
          {
            name: "High Priority",
            value: overallPriority?.totalHigh ?? 0,
            color: C.blue,
          },
          {
            name: "Low Priority",
            value: overallPriority?.totalLow ?? 0,
            color: C.blueLight,
          },
        ],
        center: {
          value: overallPriority?.total ?? 0,
          label: "Total Positions",
        },
      },
      {
        title: "Hire - Gender Wise",
        data: [
          { name: "Male", value: overallGender?.male ?? 0, color: C.violet },
          {
            name: "Female",
            value: overallGender?.female ?? 0,
            color: C.orange,
          },
          ...(overallGender?.transgender > 0
            ? [
                {
                  name: "Transgender",
                  value: overallGender.transgender,
                  color: C.teal,
                },
              ]
            : []),
          ...(overallGender?.other > 0
            ? [{ name: "Other", value: overallGender.other, color: C.amber }]
            : []),
        ],
        center: { value: overallGender?.total ?? 0, label: "Total Hired" },
      },
      {
        title: "Employee Hire vs Exit",
        data: [
          { name: "Hire", value: overallHired ?? 0, color: C.green },
          { name: "Exit", value: 0, color: C.red },
        ],
        center: { value: overallHired ?? 0, label: "Total Employees" },
      },
    ],
    [overallNewVsReplacement, overallPriority, overallGender, overallHired],
  );

  const dynamicSpiralData = useMemo(() => {
    if (!overallSourceOfHiring) return null;
    return [
      {
        name: "Consultancy",
        value: overallSourceOfHiring.consultancy,
        color: C.blueLight,
      },
      {
        name: "Internal",
        value: overallSourceOfHiring.internal,
        color: C.blue,
      },
      {
        name: "Portal",
        value: overallSourceOfHiring.portal,
        color: C.blueDark,
      },
      {
        name: "Website",
        value: overallSourceOfHiring.website,
        color: C.blueDark1,
      },
    ];
  }, [overallSourceOfHiring]);

  const budgetVsFinalData = useMemo(() => {
    return (budgetChartData || []).map((p) => {
      const d = p.start ? new Date(p.start) : null;
      const name = d
        ? `${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`
        : p.label || "";
      const budget = (p.hired_jobposting || []).reduce(
        (sum, h) => sum + (h.jobposdata_budget_from || 0),
        0,
      );
      const final = (p.hired_jobposting || []).reduce(
        (sum, h) => sum + (h.jobcandidate_final_ctc || 0),
        0,
      );
      return { name, budget, final };
    });
  }, [budgetChartData]);

  const case2TableData = useMemo(() => {
    if (!isCase2 || !chartData?.rangeSplit?.length) return null;
    const rangeSplit = chartData.rangeSplit;
    const cycleType = chartData.cycleType || "Monthly";
    const mapping = RANGE_FIELD_MAP[cycleType] || RANGE_FIELD_MAP.Monthly;
    const periods = rangeSplit.map((item) => ({
      label: item[mapping.labelKey] || "",
      start: item[mapping.startKey] || "",
      end: item[mapping.endKey] || "",
      _raw: item,
    }));
    const seen = new Set();
    const uniquePeriods = periods.filter((p) => {
      const k = p.start;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    const allDeptIds = new Set();
    const allDeptNames = {};
    rangeSplit.forEach((period) => {
      [
        ...(period.chart1 || []),
        ...(period.chart2 || []),
        ...(period.chart356 || []),
      ].forEach((d) => {
        const id = d.department_services ?? d.department;
        const name =
          d.department_services_short_name || d.department_name || "Unknown";
        if (id !== undefined) {
          allDeptIds.add(id);
          allDeptNames[id] = name;
        }
      });
    });
    const deptIds =
      activeVerticals.length > 0
        ? activeVerticals.filter((id) => allDeptIds.has(id))
        : [...allDeptIds];
    const deptNames = deptIds.map((id) => allDeptNames[id] || String(id));
    const val = (arr = [], deptId, getter) => {
      const row = arr.find(
        (d) => (d.department_services ?? d.department) === deptId,
      );
      return row ? (getter(row) ?? 0) : 0;
    };

    return {
      periods: uniquePeriods,
      deptIds,
      deptNames,
      tables: [
        {
          title: "New vs Replacement Hiring",
          subRows: [
            {
              label: "New",
              color: C.orange,
              getter: (p, id) => val(p.chart1, id, (d) => d.new_employee_count),
            },
            {
              label: "Replacement",
              color: C.blue,
              getter: (p, id) =>
                val(p.chart1, id, (d) => d.replacement_employee_count),
            },
          ],
        },
        {
          title: "Open Position",
          subRows: [
            {
              label: "High Priority",
              color: C.blue,
              getter: (p, id) =>
                val(p.chart2, id, (d) => d.priority_high_count),
            },
            {
              label: "Low Priority",
              color: C.blueLight,
              getter: (p, id) => val(p.chart2, id, (d) => d.priority_low_count),
            },
          ],
        },
        {
          title: "Hire - Gender Wise",
          subRows: [
            {
              label: "Male",
              color: C.violet,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.gender_counts?.male),
            },
            {
              label: "Female",
              color: C.orange,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.gender_counts?.female),
            },
            {
              label: "Transgender",
              color: C.teal,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.gender_counts?.transgender),
            },
            {
              label: "Other",
              color: C.amber,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.gender_counts?.other),
            },
          ],
        },
        {
          title: "Employee Hire vs Exit",
          subRows: [
            {
              label: "Hire",
              color: C.green,
              getter: (p, id) => val(p.chart356, id, (d) => d.hired_count),
            },
            { label: "Exit", color: C.red, getter: () => 0 },
          ],
        },
        {
          title: "Source of Hiring",
          subRows: [
            {
              label: "Consultancy",
              color: C.blue,
              getter: (p, id) =>
                val(
                  p.chart356,
                  id,
                  (d) => d.source_of_hiring_counts?.consultancy,
                ),
            },
            {
              label: "Internal",
              color: C.orange,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.source_of_hiring_counts?.internal),
            },
            {
              label: "Portal",
              color: C.grey,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.source_of_hiring_counts?.portal),
            },
            {
              label: "Website",
              color: C.amber,
              getter: (p, id) =>
                val(p.chart356, id, (d) => d.source_of_hiring_counts?.website),
            },
          ],
        },
      ],
    };
  }, [isCase2, chartData, activeVerticals]);

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
              {formatDisplay(activeDateRange.start)} →
              {formatDisplay(activeDateRange.end)}
            </Text>

            <Svg
              width="18"
              height="17"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M15.75 9H17.25C17.4489 9 17.6397 8.92098 17.7803 8.78033C17.921 8.63968 18 8.44891 18 8.25C18 8.05109 17.921 7.86032 17.7803 7.71967C17.6397 7.57902 17.4489 7.5 17.25 7.5H15.75C15.5511 7.5 15.3603 7.57902 15.2197 7.71967C15.079 7.86032 15 8.05109 15 8.25C15 8.44891 15.079 8.63968 15.2197 8.78033C15.3603 8.92098 15.5511 9 15.75 9ZM9 2.25C9 2.05109 9.07902 1.86032 9.21967 1.71967C9.36032 1.57902 9.55109 1.5 9.75 1.5H17.25C17.4489 1.5 17.6397 1.57902 17.7803 1.71967C17.921 1.86032 18 2.05109 18 2.25C18 2.44891 17.921 2.63968 17.7803 2.78033C17.6397 2.92098 17.4489 3 17.25 3H9.75C9.55109 3 9.36032 2.92098 9.21967 2.78033C9.07902 2.63968 9 2.44891 9 2.25ZM9 14.25C9 14.0511 9.07902 13.8603 9.21967 13.7197C9.36032 13.579 9.55109 13.5 9.75 13.5H17.25C17.4489 13.5 17.6397 13.579 17.7803 13.7197C17.921 13.8603 18 14.0511 18 14.25C18 14.4489 17.921 14.6397 17.7803 14.7803C17.6397 14.921 17.4489 15 17.25 15H9.75C9.55109 15 9.36032 14.921 9.21967 14.7803C9.07902 14.6397 9 14.4489 9 14.25ZM0.75 3H2.25C2.44891 3 2.63968 2.92098 2.78033 2.78033C2.92098 2.63968 3 2.44891 3 2.25C3 2.05109 2.92098 1.86032 2.78033 1.71967C2.63968 1.57902 2.44891 1.5 2.25 1.5H0.75C0.551088 1.5 0.360322 1.57902 0.21967 1.71967C0.0790175 1.86032 0 2.05109 0 2.25C0 2.44891 0.0790175 2.63968 0.21967 2.78033C0.360322 2.92098 0.551088 3 0.75 3ZM2.25 15H0.75C0.551088 15 0.360322 14.921 0.21967 14.7803C0.0790175 14.6397 0 14.4489 0 14.25C0 14.0511 0.0790175 13.8603 0.21967 13.7197C0.360322 13.579 0.551088 13.5 0.75 13.5H2.25C2.44891 13.5 2.63968 13.579 2.78033 13.7197C2.92098 13.8603 3 14.0511 3 14.25C3 14.4489 2.92098 14.6397 2.78033 14.7803C2.63968 14.921 2.44891 15 2.25 15ZM0 8.25C0 8.05109 0.0790175 7.86032 0.21967 7.71967C0.360322 7.57902 0.551088 7.5 0.75 7.5H8.25C8.44891 7.5 8.63968 7.57902 8.78033 7.71967C8.92098 7.86032 9 8.05109 9 8.25C9 8.44891 8.92098 8.63968 8.78033 8.78033C8.63968 8.92098 8.44891 9 8.25 9H0.75C0.551088 9 0.360322 8.92098 0.21967 8.78033C0.0790175 8.63968 0 8.44891 0 8.25ZM6 0C5.40326 0 4.83097 0.237053 4.40901 0.65901C3.98705 1.08097 3.75 1.65326 3.75 2.25C3.75 2.84674 3.98705 3.41903 4.40901 3.84099C4.83097 4.26295 5.40326 4.5 6 4.5C6.59674 4.5 7.16903 4.26295 7.59099 3.84099C8.01295 3.41903 8.25 2.84674 8.25 2.25C8.25 1.65326 8.01295 1.08097 7.59099 0.65901C7.16903 0.237053 6.59674 0 6 0ZM9.75 8.25C9.75 7.65326 9.98705 7.08097 10.409 6.65901C10.831 6.23705 11.4033 6 12 6C12.5967 6 13.169 6.23705 13.591 6.65901C14.0129 7.08097 14.25 7.65326 14.25 8.25C14.25 8.84674 14.0129 9.41903 13.591 9.84099C13.169 10.2629 12.5967 10.5 12 10.5C11.4033 10.5 10.831 10.2629 10.409 9.84099C9.98705 9.41903 9.75 8.84674 9.75 8.25ZM6 12C5.40326 12 4.83097 12.2371 4.40901 12.659C3.98705 13.081 3.75 13.6533 3.75 14.25C3.75 14.8467 3.98705 15.419 4.40901 15.841C4.83097 16.2629 5.40326 16.5 6 16.5C6.59674 16.5 7.16903 16.2629 7.59099 15.841C8.01295 15.419 8.25 14.8467 8.25 14.25C8.25 13.6533 8.01295 13.081 7.59099 12.659C7.16903 12.2371 6.59674 12 6 12Z"
                fill="#64748B"
              />
            </Svg>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.filterIcon} onPress={fetchStats}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity> */}
        </View>

        <View style={styles.filterStrip}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeTxt} numberOfLines={1}>
              {activeLabel}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>

          <View style={styles.PreviewfyBadge}>
            <Text style={styles.fyBadgeTxt}>
              FY {selectedFYStart}-{String(selectedFYStart + 1).slice(-2)}
            </Text>
          </View>

          <Text style={styles.chevron}>›</Text>

          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeTxt} numberOfLines={1}>
              {formatShortDate(activeDateRange.start)} –
              {formatShortDate(activeDateRange.end)}
            </Text>
          </View>

          {!isDefault && (
            <TouchableOpacity
              onPress={handleClearFilter}
              style={styles.clearIcon}
            >
              <Text style={{ fontSize: 17, color: "#dc2626" }}>✕</Text>
            </TouchableOpacity>
          )}
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
        {/* ── View Toggle ── */}
        {!isCase2 && (
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 14,
              alignSelf: "flex-start",
              opacity: activeVerticals.length > 0 ? 0.4 : 1,
            }}
          >
            {["overall", "vertical"].map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => {
                  if (activeVerticals.length === 0) setView(v);
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: effectiveView === v ? "#2388FF" : "#fff",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: effectiveView === v ? "600" : "400",
                    color: effectiveView === v ? "#fff" : "#555",
                    textTransform: "uppercase",
                  }}
                >
                  {v === "overall" ? "Overall" : "Vertical Wise"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {isCase2 && (
          <View
            style={{
              backgroundColor: "#FFF7E6",
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: C.amber,
              alignSelf: "flex-start",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: C.amber }}>
              Period × Vertical View
            </Text>
          </View>
        )}

        {/* ── Charts ── */}
        {chartLoading ? (
          <ActivityIndicator
            size="large"
            color="#2563EB"
            style={{ marginVertical: 40 }}
          />
        ) : isCase2 ? (
          case2TableData ? (
            case2TableData.tables.map((tbl) => (
              <Case2TableRN
                key={tbl.title}
                title={tbl.title}
                periods={case2TableData.periods}
                deptIds={case2TableData.deptIds}
                deptNames={case2TableData.deptNames}
                subRows={tbl.subRows}
              />
            ))
          ) : (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text style={{ color: "#888" }}>
                No data for selected range and verticals.
              </Text>
            </View>
          )
        ) : effectiveView === "overall" ? (
          <OverallChartsView
            dynamicOverallDonuts={dynamicOverallDonuts}
            dynamicSpiralData={dynamicSpiralData}
            overallSourceOfHiring={overallSourceOfHiring}
            overallLevelCounts={overallLevelCounts}
            budgetVsFinalData={budgetVsFinalData}
          />
        ) : (
          <VerticalChartsView
            newVsReplacementData={newVsReplacementData}
            priorityOpenData={priorityOpenData}
            hireVerticalData={hireVerticalData}
            hireVsExitData={hireVsExitData}
            sourceOfHiringData={sourceOfHiringData}
            overallLevelCounts={overallLevelCounts}
            budgetVsFinalData={budgetVsFinalData}
          />
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
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
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

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
                Vertical
              </Text>
              <TouchableOpacity
                style={styles.selectBtn}
                onPress={() => setVerticalPickerVisible(true)}
              >
                <Text style={styles.selectBtnText} numberOfLines={1}>
                  {pendingVerticals.length === 0
                    ? "All Verticals"
                    : pendingVerticals.length === allVerticalOptions.length
                      ? "All Verticals"
                      : `${pendingVerticals.length} selected`}
                </Text>
                <Text style={styles.selectArrow}>⌄</Text>
              </TouchableOpacity>

              {isCustom && pendingVerticals.length > 0 && (
                <>
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Filter Type
                  </Text>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() =>
                      setActivePicker(
                        activePicker === "customFilterType"
                          ? null
                          : "customFilterType",
                      )
                    }
                  >
                    <Text style={styles.selectBtnText}>
                      {[
                        { label: "Monthly", value: "monthly" },
                        { label: "Quarterly", value: "quarterly" },
                        { label: "Half Yearly", value: "half_yearly" },
                      ].find((o) => o.value === customFilterType)?.label ||
                        "Monthly"}
                    </Text>
                    <Text style={styles.selectArrow}>⌄</Text>
                  </TouchableOpacity>
                  {activePicker === "customFilterType" && (
                    <View style={styles.dropdownList}>
                      {[
                        { label: "Monthly", value: "monthly" },
                        { label: "Quarterly", value: "quarterly" },
                        { label: "Half Yearly", value: "half_yearly" },
                      ].map((opt) => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[
                            styles.dropdownItem,
                            customFilterType === opt.value &&
                              styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setCustomFilterType(opt.value);
                            setActivePicker(null);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              customFilterType === opt.value &&
                                styles.dropdownItemTextActive,
                            ]}
                          >
                            {opt.label}
                          </Text>
                          {customFilterType === opt.value && (
                            <Text style={styles.dropdownItemCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}

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
                          <ScrollView
                            nestedScrollEnabled
                            showsVerticalScrollIndicator={false}
                          >
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
                          </ScrollView>
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

                              setPendingStart(toLocalDateStr(start));
                              setPendingEnd(toLocalDateStr(end));
                            }
                          }}
                        />
                      )}
                    </View>
                  )}

                  {/* ── Start & End (side by side, disabled — mirrors ) ── */}
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
      <Modal
        visible={verticalPickerVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.filterModalOverlay}
          activeOpacity={1}
          onPress={() => setVerticalPickerVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.dateModalCard, { maxHeight: "70%" }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dateModalHeader}>
              <Text style={styles.dateModalTitle}>Select Verticals</Text>
              <TouchableOpacity onPress={() => setVerticalPickerVisible(false)}>
                <Text style={styles.dateModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  pendingVerticals.length === allVerticalOptions.length &&
                    allVerticalOptions.length > 0 &&
                    styles.dropdownItemActive,
                ]}
                onPress={() => {
                  if (pendingVerticals.length === allVerticalOptions.length) {
                    setPendingVerticals([]);
                  } else {
                    setPendingVerticals(allVerticalOptions.map((o) => o.value));
                  }
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    { fontWeight: "600", color: "#2563EB" },
                  ]}
                >
                  All Verticals
                </Text>
                {pendingVerticals.length === allVerticalOptions.length &&
                  allVerticalOptions.length > 0 && (
                    <Text style={styles.dropdownItemCheck}>✓</Text>
                  )}
              </TouchableOpacity>
              {allVerticalOptions.map((opt) => {
                const isSelected = pendingVerticals.includes(opt.value);
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setPendingVerticals((prev) =>
                        isSelected
                          ? prev.filter((v) => v !== opt.value)
                          : [...prev, opt.value],
                      );
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isSelected && styles.dropdownItemTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Text style={styles.dropdownItemCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={[styles.dateApplyBtn, { marginTop: 12 }]}
              onPress={() => setVerticalPickerVisible(false)}
            >
              <Text style={styles.dateApplyText}>Done</Text>
            </TouchableOpacity>
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
      {/* <Text style={styles.menuDots}>⋮</Text> */}
    </View>
    <View style={styles.cardRow}>
      <Text style={styles.cardValue}>{item.value}</Text>
      {/* <Text
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
      </Text> */}
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
    marginBottom: 10,
  },

  typeBadge: {
    // backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // borderWidth: 1,
    // borderColor: "#DBEAFE",
    maxWidth: 160,
  },

  typeBadgeTxt: { fontSize: 12, fontWeight: "600", color: "#2563EB" },

  PreviewfyBadge: {
    // backgroundColor: "#F8FAFC",
    // borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
  },

  fyBadgeTxt: { fontSize: 12, fontWeight: "600", color: "#6B7280" },

  chevron: { fontSize: 14, color: "#9CA3AF" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  toggleLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  dateBadge: {
    // backgroundColor: "#F8FAFC",
    // borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
    flex: 1,
    width: "fit-content",
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

  filterModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

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

  rowTwo: {
    flexDirection: "row",
    marginTop: 16,
  },

  halfCol: {
    flex: 1,
    marginHorizontal: 2,
  },

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
