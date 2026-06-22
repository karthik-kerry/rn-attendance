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
import { base_url } from "../../constant/api";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "@/app/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import XLSX from "xlsx";
import Svg, {
  Path,
  Circle,
  Rect,
  Text as SvgText,
  G,
  Line,
  Polyline,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
  ClipPath,
} from "react-native-svg";

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
    title: "Total Openings",
    apiKey: "total_jobpostingcount",
    change: 5,
    up: true,
  },
  {
    title: "Total Applicants",
    apiKey: "total_applicatant_count",
    change: 20,
    up: true,
  },
  { title: "Screening", apiKey: "total_screening_count", change: 40, up: true },
  {
    title: "Interviews",
    apiKey: "total_interviews_count",
    change: 20,
    up: true,
  },
  { title: "Offered", apiKey: "total_offered_count", change: 8, up: false },
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
  { title: "Hired", apiKey: "total_hired_count", change: 40, up: true },
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
const { width: SCREEN_W } = Dimensions.get("window");

const C = {
  blue: "#4E9FFF",
  blueDark: "#185FA5",
  grey: "#A5A5A5",
  blueLight: "#C3DDFF",
  green: "#36AC00",
  red: "#EB0505",
  violet: "#8979FF",
  orange: "#FF928A",
  amber: "#ED7D31",
  navy: "#1E3A5F",
  teal: "#2BBFBF",
  white: "#fff",
  blueDark1: "#0B3C91",
};

const RANGE_FIELD_MAP = {
  Monthly: {
    labelKey: "month_label",
    startKey: "month_start",
    endKey: "month_end",
  },
  "Current Month": {
    labelKey: "current_month_label",
    startKey: "current_month_start",
    endKey: "current_month_end",
  },
  "Half-Yearly": {
    labelKey: "half_label",
    startKey: "half_start",
    endKey: "half_end",
  },
  Quarterly: {
    labelKey: "quarter_label",
    startKey: "quarter_start",
    endKey: "quarter_end",
  },
  Weekly: {
    labelKey: "week_label",
    startKey: "week_start",
    endKey: "week_end",
  },
  "Financial Year": {
    labelKey: "month_label",
    startKey: "month_start",
    endKey: "month_end",
  },
};

const normalizeRangeSplit = (response = {}) => {
  const rangeSplit = Array.isArray(response.range_split)
    ? response.range_split
    : [];
  const cycleType = response.cycle_type || "Monthly";
  const mapping = RANGE_FIELD_MAP[cycleType] || RANGE_FIELD_MAP.Monthly;
  return rangeSplit.map((item) => ({
    label: item[mapping.labelKey] || "",
    start: item[mapping.startKey] || "",
    end: item[mapping.endKey] || "",
    hired_jobposting: item.hired_jobposting || [],
  }));
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PERIOD_COLORS = [
  "#4E9FFF",
  "#FF928A",
  "#A0C878",
  "#ED7D31",
  "#8979FF",
  "#2BBFBF",
  "#EB0505",
  "#B28D00",
  "#305898",
  "#3A5525",
];

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

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
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
          <View style={styles.yearPickerHeader}>
            <Text style={styles.yearPickerTitle}>Select Year</Text>

            <TouchableOpacity style={styles.yearPickerClose} onPress={onClose}>
              <Text style={styles.yearPickerCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

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

// ─── DOT ─────────────────────────────────────────────────────────────────────
const RNDot = ({ color, size = 8 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

const RNLegendItem = ({ color, label }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
    <RNDot color={color} />
    <Text style={{ fontSize: 11, color: "#19213D" }}>{label}</Text>
  </View>
);

// ─── DONUT CHART (SVG) ────────────────────────────────────────────────────────
const DonutChart = ({ data, center, size = 160 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.32;
  const r = size * 0.22;
  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  const arcs = [];
  let startAngle = -Math.PI / 2;
  const CORNER = 0.05;

  data.forEach((d, i) => {
    const pct = total > 0 ? d.value / total : 1 / data.length;
    const angle = pct * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const polarToCart = (angle, radius) => ({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });

    if (angle < 0.01) {
      startAngle = endAngle;
      return;
    }

    const s1 = polarToCart(startAngle + CORNER, R);
    const e1 = polarToCart(endAngle - CORNER, R);
    const s2 = polarToCart(endAngle - CORNER, r);
    const e2 = polarToCart(startAngle + CORNER, r);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${s1.x} ${s1.y}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${r} ${r} 0 ${largeArc} 0 ${e2.x} ${e2.y}`,
      "Z",
    ].join(" ");

    arcs.push(<Path key={i} d={path} fill={d.color} />);
    startAngle = endAngle;
  });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 8,
      }}
    >
      <View style={{ position: "relative", width: size, height: size }}>
        <Svg width={size} height={size}>
          {arcs}
        </Svg>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1B1B1B" }}>
            {center.value}
          </Text>
          <Text style={{ fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>
            {center.label}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 10 }}>
        {data.map((d, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <RNDot color={d.color} size={10} />
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#1B1B1B" }}
              >
                {d.value}
              </Text>
              <Text style={{ fontSize: 10, color: "#888" }}>{d.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── SPIRAL CHART  ────────────────────────────────────────────
const SpiralChart = ({ data, center }) => {
  const svgW = 220;
  const svgH = 140;
  const cx = svgW * 0.45;
  const cy = svgH * 0.95;
  const baseInner = 20;
  const thickness = 16;
  const gap = 5;
  const total = center.value || 1;

  const arcs = [];
  data.forEach((d, i) => {
    const inner = baseInner + i * (thickness + gap);
    const outer = inner + thickness;
    const pct = Math.min(d.value / total, 1);
    const sweepDeg = pct * 180;
    const sweepRad = (sweepDeg * Math.PI) / 180;

    const polarToCart = (angleDeg, r) => {
      const rad = (angleDeg * Math.PI) / 180;
      return {
        x: cx + r * Math.cos(Math.PI - rad),
        y: cy - r * Math.sin(Math.PI - rad),
      };
    };

    // Background arc
    const bgS = polarToCart(0, inner);
    const bgE = polarToCart(180, inner);
    const bgSO = polarToCart(0, outer);
    const bgEO = polarToCart(180, outer);
    arcs.push(
      <Path
        key={`bg-${i}`}
        d={`M ${bgSO.x} ${bgSO.y} A ${outer} ${outer} 0 0 1 ${bgEO.x} ${bgEO.y} L ${bgE.x} ${bgE.y} A ${inner} ${inner} 0 0 0 ${bgS.x} ${bgS.y} Z`}
        fill="#E5E7EB"
      />,
    );

    if (sweepDeg > 1) {
      const s = polarToCart(0, inner);
      const e = polarToCart(sweepDeg, inner);
      const sO = polarToCart(0, outer);
      const eO = polarToCart(sweepDeg, outer);
      const lg = sweepDeg > 90 ? 1 : 0;
      arcs.push(
        <Path
          key={`val-${i}`}
          d={`M ${sO.x} ${sO.y} A ${outer} ${outer} 0 ${lg} 1 ${eO.x} ${eO.y} L ${e.x} ${e.y} A ${inner} ${inner} 0 ${lg} 0 ${s.x} ${s.y} Z`}
          fill={d.color}
          fillOpacity={0.9}
        />,
      );
    }
  });

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ position: "relative", width: svgW, height: svgH }}>
        <Svg width={svgW} height={svgH}>
          {arcs}
        </Svg>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700" }}>
            {center.value}
          </Text>
          <Text style={{ fontSize: 10, color: "#9CA3AF" }}>{center.label}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => (
          <View
            key={i}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <RNDot color={d.color} size={10} />
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700" }}>{d.value}</Text>
              <Text style={{ fontSize: 10, color: "#888" }}>{d.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── SHARED TICK HELPER ───────────────────────────────────────────────────────
const generateYTicks = (maxVal, tickCount = 5) => {
  if (maxVal === 0) return [0];
  const intMax = Math.ceil(maxVal);
  if (intMax <= tickCount) {
    return Array.from({ length: intMax + 1 }, (_, i) => i);
  }
  const rawStep = intMax / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude || 1;
  const niceMax = Math.ceil(intMax / niceStep) * niceStep;

  const ticks = [];
  for (let v = 0; v <= niceMax; v += niceStep) {
    ticks.push(Math.round(v));
  }
  return ticks;
};

// ─── BAR CHART (SVG) ─────────────────────────────────────────────────────────
const BarChartSVG = ({ data, keys, colors, height = 200, fixedWidth }) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );

  // ✅ unique, evenly-spaced ticks
  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];

  const groupW = chartW / Math.max(data.length, 1);
  const barW = Math.max(groupW / (keys.length + 1) - 2, 4);

  return (
    <Svg width={svgW} height={height}>
      {/* Y gridlines + labels */}
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {/* Bars */}
      {data.map((d, di) => {
        const groupX = PAD_L + di * groupW + groupW * 0.1;
        return keys.map((k, ki) => {
          const val = d[k] || 0;
          const barH = (val / niceMax) * chartH;
          const x = groupX + ki * (barW + 2);
          const y = PAD_T + chartH - barH;
          return (
            <G key={`${di}-${ki}`}>
              <Rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 0)}
                fill={colors[ki]}
                rx={2}
              />
            </G>
          );
        });
      })}
      {/* X labels */}
      {data.map((d, di) => {
        const x = PAD_L + di * groupW + groupW / 2;
        const label = d.name || "";
        const words = label.split(" ");
        return (
          <G key={`lbl-${di}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={x}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── LINE CHART (SVG) ─────────────────────────────────────────────────────────
const LineChartSVG = ({ data, keys, colors, height = 180, fixedWidth }) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );

  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];

  const n = data.length;
  const xOf = (i) => PAD_L + (n < 2 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yOf = (v) => PAD_T + chartH - (v / niceMax) * chartH;

  return (
    <Svg width={svgW} height={height}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {keys.map((k, ki) => {
        const pts = data.map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`).join(" ");
        return (
          <G key={`line-${ki}`}>
            <Polyline
              points={pts}
              fill="none"
              stroke={colors[ki]}
              strokeWidth={2}
            />
            {data.map((d, i) => (
              <Circle
                key={i}
                cx={xOf(i)}
                cy={yOf(d[k] || 0)}
                r={3}
                fill={colors[ki]}
              />
            ))}
          </G>
        );
      })}
      {data.map((d, i) => {
        const words = (d.name || "").split(" ");
        return (
          <G key={`lbl-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={xOf(i)}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── AREA CHART (SVG) ─────────────────────────────────────────────────────────
const AreaChartSVG = ({ data, keys, colors, height = 180, fixedWidth }) => {
  const svgW = fixedWidth ?? SCREEN_W - 80;
  const PAD_L = 36,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = height - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => keys.map((k) => d[k] || 0)),
    1,
  );

  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];

  const n = data.length;
  const xOf = (i) => PAD_L + (n < 2 ? chartW / 2 : (i / (n - 1)) * chartW);
  const yOf = (v) => PAD_T + chartH - (v / niceMax) * chartH;
  const baseY = PAD_T + chartH;

  return (
    <Svg width={svgW} height={height}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={9}
              fill="#888"
              textAnchor="end"
            >
              {val}
            </SvgText>
          </G>
        );
      })}
      {keys.map((k, ki) => {
        if (!data.length) return null;
        const linePts = data
          .map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`)
          .join(" ");
        const fillPts =
          `${xOf(0)},${baseY} ` +
          data.map((d, i) => `${xOf(i)},${yOf(d[k] || 0)}`).join(" ") +
          ` ${xOf(n - 1)},${baseY}`;
        return (
          <G key={`area-${ki}`}>
            <Polygon points={fillPts} fill={colors[ki]} fillOpacity={0.18} />
            <Polyline
              points={linePts}
              fill="none"
              stroke={colors[ki]}
              strokeWidth={2}
            />
          </G>
        );
      })}
      {data.map((d, i) => {
        const words = (d.name || "").split(" ");
        return (
          <G key={`lbl-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={xOf(i)}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── BULLET BAR CHART (SVG) ───────────────────────────────────────────────────
const BulletBarChartSVG = ({ data, mainKey, subKey, mainColor, subColor }) => {
  const svgW = SCREEN_W - 80;
  const LABEL_W = 80,
    PAD_R = 8,
    ROW_H = 24,
    MAIN_H = 8,
    AXIS_H = 20;
  const BAR_AREA = svgW - LABEL_W - PAD_R;
  const svgH = data.length * ROW_H + AXIS_H;
  const maxVal = Math.max(
    ...data.map((d) => (d[mainKey] || 0) + (d[subKey] || 0)),
    1,
  );
  const xTicks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    maxVal,
  ];
  const toX = (v) => LABEL_W + (v / maxVal) * BAR_AREA;

  return (
    <Svg width={svgW} height={svgH}>
      {xTicks.map((t, ti) => (
        <G key={`tick-${ti}`}>
          <Line
            x1={toX(t)}
            y1={0}
            x2={toX(t)}
            y2={svgH - AXIS_H}
            stroke="#E5E7EB"
            strokeWidth={1}
            strokeDasharray="4,3"
          />
          <SvgText
            x={toX(t)}
            y={svgH - 4}
            fontSize={9}
            fill="#9CA3AF"
            textAnchor="middle"
          >
            {t}
          </SvgText>
        </G>
      ))}
      {data.map((d, i) => {
        const midY = i * ROW_H + ROW_H / 2;
        const mainW = Math.max(((d[mainKey] || 0) / maxVal) * BAR_AREA, 2);
        const subW = Math.max(((d[subKey] || 0) / maxVal) * BAR_AREA, 0);
        const label = d.name || "";
        const words = label.split(" ");
        return (
          <G key={`row-${i}`}>
            {words.map((w, wi) => (
              <SvgText
                key={wi}
                x={LABEL_W - 6}
                y={midY - (words.length - 1) * 5 + wi * 10 + 4}
                fontSize={8}
                fill="#6B7280"
                textAnchor="end"
              >
                {w}
              </SvgText>
            ))}
            <Rect
              x={LABEL_W}
              y={midY - MAIN_H / 2}
              width={mainW}
              height={MAIN_H}
              rx={MAIN_H / 2}
              fill={mainColor}
            />
            {subW > 0 && (
              <Rect
                x={LABEL_W}
                y={midY - MAIN_H / 2}
                width={subW}
                height={MAIN_H}
                rx={MAIN_H / 2}
                fill={subColor}
              />
            )}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── BUDGET vs FINAL BAR CHART (SVG) ─────────────────────────────────────────
const BudgetBarChartSVG = ({ data }) => {
  const svgW = SCREEN_W - 80;
  const PAD_L = 44,
    PAD_R = 8,
    PAD_T = 12,
    PAD_B = 50;
  const chartW = svgW - PAD_L - PAD_R;
  const chartH = 220 - PAD_T - PAD_B;
  const maxVal = Math.max(
    ...data.flatMap((d) => [d.budget || 0, d.final || 0]),
    1,
  );

  const yTicks = generateYTicks(maxVal);
  const niceMax = yTicks[yTicks.length - 1];

  const n = data.length;
  const groupW = chartW / Math.max(n, 1);
  const barW = Math.max(groupW * 0.3 - 2, 4);
  const toY = (v) => PAD_T + chartH - (v / niceMax) * chartH;

  const fmtK = (v) =>
    v >= 100000
      ? `${(v / 100000).toFixed(1)}L`
      : v >= 1000
        ? `${(v / 1000).toFixed(0)}K`
        : String(v);

  return (
    <Svg width={svgW} height={220}>
      {yTicks.map((val) => {
        const y = PAD_T + chartH - (val / niceMax) * chartH;
        return (
          <G key={`grid-${val}`}>
            <Line
              x1={PAD_L}
              y1={y}
              x2={svgW - PAD_R}
              y2={y}
              stroke="#F0F0F0"
              strokeWidth={1}
            />
            <SvgText
              x={PAD_L - 4}
              y={y + 4}
              fontSize={8}
              fill="#888"
              textAnchor="end"
            >
              {fmtK(val)}
            </SvgText>
          </G>
        );
      })}
      {data.map((d, di) => {
        const cx = PAD_L + di * groupW + groupW / 2;
        const budH = ((d.budget || 0) / niceMax) * chartH;
        const finH = ((d.final || 0) / niceMax) * chartH;
        return (
          <G key={`bar-${di}`}>
            <Rect
              x={cx - barW - 1}
              y={toY(d.budget || 0)}
              width={barW}
              height={Math.max(budH, 0)}
              fill={C.blueLight}
              rx={2}
            />
            <Rect
              x={cx + 1}
              y={toY(d.final || 0)}
              width={barW}
              height={Math.max(finH, 0)}
              fill={C.blue}
              rx={2}
            />
            {d.name.split(" ").map((w, wi) => (
              <SvgText
                key={wi}
                x={cx}
                y={PAD_T + chartH + 14 + wi * 11}
                fontSize={9}
                fill="#555"
                textAnchor="middle"
              >
                {w}
              </SvgText>
            ))}
          </G>
        );
      })}
    </Svg>
  );
};

// ─── PYRAMID (SVG) ────────────────────────────────────────────────────────────
const PYRAMID_LEVELS_FALLBACK = [
  { label: "TM - 2", color: "#0B045A", widthPct: 20 },
  { label: "Sm - 11", color: "#C35A12", widthPct: 40 },
  { label: "MM - 41", color: "#B28D00", widthPct: 60 },
  { label: "JM - 66", color: "#305898", widthPct: 80 },
  { label: "LM - 4", color: "#3A5525", widthPct: 100 },
];

const PyramidSVG = ({ levelCounts }) => {
  if (!levelCounts || Object.keys(levelCounts).length === 0) return null;

  const levels = Object.entries(levelCounts)
    .sort((a, b) => b[1] - a[1])
    .reverse()
    .map(([label, count], i) => ({
      label,
      count,
      color: PYRAMID_LEVELS_FALLBACK[i % PYRAMID_LEVELS_FALLBACK.length].color,
      widthPct:
        PYRAMID_LEVELS_FALLBACK[i % PYRAMID_LEVELS_FALLBACK.length].widthPct,
    }));

  const SEG_H = 36;
  const SVG_W = 200;
  const CX = SVG_W / 2;
  const LABEL_W = 90;
  const GAP = 10;
  const totalH = levels.length * SEG_H;
  const totalW = LABEL_W + GAP + SVG_W;
  const px = LABEL_W + GAP;

  return (
    <View style={{ alignItems: "center", paddingVertical: 10 }}>
      <Svg
        width={Math.min(totalW, SCREEN_W - 60)}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
      >
        {levels.map((l, i) => {
          const botW = (l.widthPct / 100) * SVG_W;
          const topW = i === 0 ? 0 : (levels[i - 1].widthPct / 100) * SVG_W;
          const y = i * SEG_H;
          const midY = y + SEG_H / 2;
          const topL = px + CX - topW / 2;
          const botL = px + CX - botW / 2;
          const leftEdgeMid = (topL + botL) / 2;

          return (
            <G key={`${l.label}-${i}`}>
              <Polygon
                points={`${topL},${y} ${topL + topW},${y} ${botL + botW},${y + SEG_H} ${botL},${y + SEG_H}`}
                fill={l.color}
                fillOpacity={0.9}
              />
              <Line
                x1={LABEL_W}
                y1={midY}
                x2={leftEdgeMid - 2}
                y2={midY}
                stroke="#C0C0C0"
                strokeWidth={0.8}
              />
              <SvgText
                x={LABEL_W - 30}
                y={midY + 4}
                fontSize={11}
                fill="#444"
                textAnchor="end"
              >
                {l.label} - {l.count}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

// ─── CHART TABLE (horizontal scroll) ─────────────────────────────────────────
const ChartTableRN = ({ rows, columns }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{ marginTop: 8 }}
  >
    <View>
      {/* Header */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: 80, padding: 4 }} />
        {columns.map((col, ci) => (
          <View
            key={ci}
            style={{ width: 48, padding: 4, alignItems: "center" }}
          >
            <Text
              style={{
                fontSize: 9,
                color: "#555",
                fontWeight: "500",
                textAlign: "center",
              }}
              numberOfLines={2}
            >
              {col}
            </Text>
          </View>
        ))}
      </View>
      {/* Rows */}
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={{
            flexDirection: "row",
            backgroundColor: ri % 2 === 0 ? "#FAFAFA" : "#fff",
            borderWidth: 0.5,
            borderColor: "#D9D9D9",
          }}
        >
          <View
            style={{
              width: 80,
              padding: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RNDot color={row.color} />
            <Text
              style={{ fontSize: 9, fontWeight: "500", color: "#555" }}
              numberOfLines={1}
            >
              {row.label}
            </Text>
          </View>
          {row.values.map((v, ci) => (
            <View
              key={ci}
              style={{
                width: 48,
                padding: 4,
                alignItems: "center",
                borderLeftWidth: 0.5,
                borderLeftColor: "#D9D9D9",
              }}
            >
              <Text
                style={{ fontSize: 10, color: "#1B1B1B", textAlign: "center" }}
              >
                {v}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  </ScrollView>
);

// ─── CHART CARD ───────────────────────────────────────────────────────────────
const ChartCard = ({ title, legend, rightExtra, children }) => (
  <View
    style={{
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        flexWrap: "wrap",
        gap: 4,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: "600", color: "#000", flex: 1 }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {legend}
        {rightExtra}
      </View>
    </View>
    {children}
  </View>
);

// ─── CASE 2 TABLE ─────────────────────────────────────────────────────────────
const Case2TableRN = ({ title, periods, deptIds, deptNames, subRows }) => {
  const getPeriodLabel = (p) => {
    const dStart = p.start ? new Date(p.start) : null;
    const dEnd = p.end ? new Date(p.end) : null;
    if (!dStart) return p.label || "—";
    const startStr = `${SHORT_MONTHS[dStart.getMonth()]} ${dStart.getFullYear()}`;
    if (
      dEnd &&
      !(
        dStart.getMonth() === dEnd.getMonth() &&
        dStart.getFullYear() === dEnd.getFullYear()
      )
    ) {
      return `${startStr} – ${SHORT_MONTHS[dEnd.getMonth()]} ${dEnd.getFullYear()}`;
    }
    return startStr;
  };

  const thStyle = {
    backgroundColor: "#1E3A5F",
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#152D4A",
  };
  const thTxt = {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  };
  const thLightStyle = {
    backgroundColor: "#EEF4FF",
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#D0D9F0",
  };
  const thLightTxt = {
    fontSize: 9,
    fontWeight: "600",
    color: "#2563EB",
    textAlign: "center",
  };
  const tdStyle = {
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#E8EEFF",
  };
  const tdTxt = { fontSize: 10, textAlign: "center", color: "#1B1B1B" };
  const tdLabelStyle = {
    padding: 6,
    borderWidth: 0.5,
    borderColor: "#E8EEFF",
    backgroundColor: "#FAFBFF",
  };

  const barData = deptIds.map((deptId, di) => {
    const entry = { name: deptNames[di] };
    periods.forEach((p, pi) => {
      subRows.forEach((sr) => {
        const key = `P${pi + 1}__${sr.label}`;
        entry[key] = sr.getter(p._raw, deptId) || 0;
      });
    });
    return entry;
  });

  const barKeys = [];
  const barColors = [];
  periods.forEach((p, pi) => {
    subRows.forEach((sr, si) => {
      const key = `P${pi + 1}__${sr.label}`;
      barKeys.push(key);
      barColors.push(
        subRows.length > 1
          ? sr.color
          : PERIOD_COLORS[pi % PERIOD_COLORS.length],
      );
    });
  });

  const SNO_W = 36;
  const MONTH_W = 120;
  const CELL_W = 70;

  const chartWidth = Math.max(
    SCREEN_W - 80,
    deptIds.length * subRows.length * 40 + 60,
  );

  return (
    <ChartCard title={title}>
      {/* Bar chart */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            gap: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {(subRows.length > 1
              ? subRows.map((sr) => ({ label: sr.label, color: sr.color }))
              : periods.map((p, pi) => ({
                  label: getPeriodLabel(p),
                  color: PERIOD_COLORS[pi % PERIOD_COLORS.length],
                }))
            ).map((l, i) => (
              <RNLegendItem key={i} color={l.color} label={l.label} />
            ))}
          </View>
          <BarChartSVG
            data={barData}
            keys={barKeys}
            colors={barColors}
            height={200}
            fixedWidth={chartWidth}
          />
        </View>
      </ScrollView>

      {/* Table */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        <View
          style={{
            width:
              SNO_W +
              MONTH_W +
              (deptIds.length * subRows.length + subRows.length) * CELL_W,
          }}
        >
          {/* Header row 1 */}
          <View style={{ flexDirection: "row" }}>
            <View style={[thStyle, { width: SNO_W }]}>
              <Text style={thTxt}>S.No</Text>
            </View>
            <View style={[thStyle, { width: MONTH_W }]}>
              <Text style={thTxt}>Month</Text>
            </View>
            {deptNames.map((name) => (
              <View
                key={name}
                style={[thStyle, { width: CELL_W * subRows.length }]}
              >
                <Text style={thTxt} numberOfLines={2}>
                  {name}
                </Text>
              </View>
            ))}
            <View style={[thStyle, { width: CELL_W * subRows.length }]}>
              <Text style={thTxt}>Total</Text>
            </View>
          </View>
          {/* Header row 2 — sub rows */}
          {subRows.length > 1 && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: SNO_W }} />
              <View style={{ width: MONTH_W }} />
              {deptNames.map((name) =>
                subRows.map((sr) => (
                  <View
                    key={`${name}-${sr.label}`}
                    style={[thLightStyle, { width: CELL_W }]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <RNDot color={sr.color} size={6} />
                      <Text style={thLightTxt}>{sr.label}</Text>
                    </View>
                  </View>
                )),
              )}
              {subRows.map((sr) => (
                <View
                  key={`tot-${sr.label}`}
                  style={[thLightStyle, { width: CELL_W }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <RNDot color={sr.color} size={6} />
                    <Text style={thLightTxt}>{sr.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {/* Data rows */}
          {periods.map((period, pi) => (
            <View
              key={pi}
              style={{
                flexDirection: "row",
                backgroundColor: pi % 2 === 0 ? "#fff" : "#F7F9FF",
                minWidth: SCREEN_W - 40,
              }}
            >
              <View style={[tdStyle, { width: SNO_W }]}>
                <Text style={{ ...tdTxt, color: "#888" }}>{pi + 1}</Text>
              </View>
              <View style={[tdLabelStyle, { width: MONTH_W }]}>
                <Text
                  style={{ fontSize: 10, fontWeight: "600", color: "#374151" }}
                >
                  {getPeriodLabel(period)}
                </Text>
                {period.label ? (
                  <Text style={{ fontSize: 8, color: "#888" }}>
                    ({period.label})
                  </Text>
                ) : null}
              </View>
              {deptIds.map((deptId) =>
                subRows.map((sr) => (
                  <View
                    key={`${deptId}-${sr.label}`}
                    style={[tdStyle, { width: CELL_W }]}
                  >
                    <Text style={tdTxt}>{sr.getter(period._raw, deptId)}</Text>
                  </View>
                )),
              )}
              {subRows.map((sr) => {
                const rowTotal = deptIds.reduce(
                  (sum, id) => sum + (sr.getter(period._raw, id) || 0),
                  0,
                );
                return (
                  <View
                    key={`row-tot-${sr.label}`}
                    style={[
                      tdStyle,
                      { width: CELL_W, backgroundColor: "#EEF4FF" },
                    ]}
                  >
                    <Text style={{ ...tdTxt, fontWeight: "600" }}>
                      {rowTotal}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
          {/* Total row */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#F0F5FF",
              minWidth: SCREEN_W - 40,
            }}
          >
            <View style={[tdStyle, { width: SNO_W }]}>
              <Text style={tdTxt} />
            </View>
            <View
              style={[
                tdLabelStyle,
                { width: MONTH_W, backgroundColor: "#F0F5FF" },
              ]}
            >
              <Text
                style={{ fontSize: 10, fontWeight: "700", color: "#1E3A5F" }}
              >
                Total
              </Text>
            </View>
            {deptIds.map((deptId) =>
              subRows.map((sr) => {
                const colTotal = periods.reduce(
                  (sum, p) => sum + (sr.getter(p._raw, deptId) || 0),
                  0,
                );
                return (
                  <View
                    key={`col-tot-${deptId}-${sr.label}`}
                    style={[
                      tdStyle,
                      { width: CELL_W, backgroundColor: "#F0F5FF" },
                    ]}
                  >
                    <Text
                      style={{ ...tdTxt, fontWeight: "700", color: "#1E3A5F" }}
                    >
                      {colTotal}
                    </Text>
                  </View>
                );
              }),
            )}
            {subRows.map((sr) => {
              const grandTotal = periods.reduce(
                (sum, p) =>
                  sum +
                  deptIds.reduce(
                    (s2, id) => s2 + (sr.getter(p._raw, id) || 0),
                    0,
                  ),
                0,
              );
              return (
                <View
                  key={`grand-${sr.label}`}
                  style={[
                    tdStyle,
                    { width: CELL_W, backgroundColor: "#D6E4FF" },
                  ]}
                >
                  <Text
                    style={{ ...tdTxt, fontWeight: "700", color: "#1E3A5F" }}
                  >
                    {grandTotal}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ChartCard>
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

  const clearActiveFilter = () => {
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
      // ✅ Fix: removed trailing space, also handle both key variants
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
          <>
            {dynamicOverallDonuts.map((d) => (
              <ChartCard
                key={d.title}
                title={d.title}
                legend={
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                  >
                    {d.data.map((s) => (
                      <RNLegendItem
                        key={s.name}
                        color={s.color}
                        label={s.name}
                      />
                    ))}
                  </View>
                }
              >
                <DonutChart data={d.data} center={d.center} />
              </ChartCard>
            ))}

            <ChartCard
              title="Source of Hiring"
              legend={
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                >
                  {[
                    ["Consultancy", C.blueLight],
                    ["Internal", C.blue],
                    ["Portal", C.blueDark],
                    ["Website", C.blueDark1],
                  ].map(([l, c]) => (
                    <RNLegendItem key={l} color={c} label={l} />
                  ))}
                </View>
              }
            >
              <SpiralChart
                data={
                  dynamicSpiralData ?? [
                    { name: "Consultancy", value: 0, color: C.blueLight },
                    { name: "Internal", value: 0, color: C.blue },
                    { name: "Portal", value: 0, color: C.blueDark },
                    { name: "Website", value: 0, color: C.blueDark1 },
                  ]
                }
                center={{
                  value: overallSourceOfHiring?.total ?? 0,
                  label: "Total Hires",
                }}
              />
            </ChartCard>

            <ChartCard title="Job Levels">
              {overallLevelCounts && (
                <PyramidSVG levelCounts={overallLevelCounts} />
              )}
            </ChartCard>

            <ChartCard
              title="Budget vs Actual CTC by Month"
              legend={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <RNLegendItem color={C.blueLight} label="Budget" />
                  <RNLegendItem color={C.blue} label="Actual CTC" />
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BudgetBarChartSVG data={budgetVsFinalData} />
              </ScrollView>
            </ChartCard>
          </>
        ) : (
          <>
            <ChartCard
              title="New vs Replacement Hiring by Vertical"
              legend={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <RNLegendItem color={C.orange} label="New" />
                  <RNLegendItem color={C.blue} label="Replacement" />
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <LineChartSVG
                  data={newVsReplacementData}
                  keys={["new", "rep"]}
                  colors={[C.orange, C.blue]}
                  fixedWidth={Math.max(
                    SCREEN_W - 80,
                    newVsReplacementData.length * 60 + 60,
                  )}
                />
              </ScrollView>
              <ChartTableRN
                columns={newVsReplacementData.map((d) => d.name)}
                rows={[
                  {
                    label: "New",
                    color: C.orange,
                    values: newVsReplacementData.map((d) => d.new),
                  },
                  {
                    label: "Replacement",
                    color: C.blue,
                    values: newVsReplacementData.map((d) => d.rep),
                  },
                ]}
              />
            </ChartCard>

            <ChartCard title="Open Position">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: "100%" }}>
                  <View
                    style={{ flexDirection: "row", backgroundColor: "#EEF4FF" }}
                  >
                    {["Department", "High Priority", "Low Priority"].map(
                      (h) => (
                        <Text
                          key={h}
                          style={{
                            flex: 1,
                            padding: 8,
                            fontSize: 11,
                            fontWeight: "600",
                            color: "#2563EB",
                            textAlign: "center",
                            borderWidth: 0.5,
                            borderColor: "#D0D9F0",
                          }}
                        >
                          {h}
                        </Text>
                      ),
                    )}
                  </View>
                  {priorityOpenData.map((row, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        backgroundColor: i % 2 === 0 ? "#fff" : "#F7F9FF",
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          padding: 7,
                          fontSize: 11,
                          color: "#1B1B1B",
                          textAlign: "center",
                          borderWidth: 0.5,
                          borderColor: "#E8EEFF",
                        }}
                      >
                        {row.name}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          padding: 7,
                          fontSize: 11,
                          color: "#1B1B1B",
                          textAlign: "center",
                          borderWidth: 0.5,
                          borderColor: "#E8EEFF",
                        }}
                      >
                        {row.active}
                      </Text>
                      <Text
                        style={{
                          flex: 1,
                          padding: 7,
                          fontSize: 11,
                          color: "#1B1B1B",
                          textAlign: "center",
                          borderWidth: 0.5,
                          borderColor: "#E8EEFF",
                        }}
                      >
                        {row.open}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{ flexDirection: "row", backgroundColor: "#F0F5FF" }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        padding: 7,
                        fontSize: 11,
                        fontWeight: "700",
                        textAlign: "center",
                        borderWidth: 0.5,
                        borderColor: "#E8EEFF",
                      }}
                    >
                      TOTAL
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 7,
                        fontSize: 11,
                        fontWeight: "700",
                        textAlign: "center",
                        borderWidth: 0.5,
                        borderColor: "#E8EEFF",
                      }}
                    >
                      {priorityOpenData.reduce((s, r) => s + r.active, 0)}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        padding: 7,
                        fontSize: 11,
                        fontWeight: "700",
                        textAlign: "center",
                        borderWidth: 0.5,
                        borderColor: "#E8EEFF",
                      }}
                    >
                      {priorityOpenData.reduce((s, r) => s + r.open, 0)}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </ChartCard>

            <ChartCard
              title="Hire - Vertical Wise"
              legend={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <RNLegendItem color={C.violet} label="Male" />
                  <RNLegendItem color={C.orange} label="Female" />
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BulletBarChartSVG
                  data={hireVerticalData}
                  mainKey="male"
                  subKey="female"
                  mainColor={C.violet}
                  subColor={C.orange}
                />
              </ScrollView>
              <ChartTableRN
                columns={hireVerticalData.map((d) => d.name)}
                rows={[
                  {
                    label: "Male",
                    color: C.violet,
                    values: hireVerticalData.map((d) => d.male),
                  },
                  {
                    label: "Female",
                    color: C.orange,
                    values: hireVerticalData.map((d) => d.female),
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="Employee Hire vs Exit"
              legend={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <RNLegendItem color={C.blue} label="Hire" />
                  <RNLegendItem color="#FAC6D0" label="Exit" />
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <AreaChartSVG
                  data={hireVsExitData}
                  keys={["hire", "exit"]}
                  colors={[C.blue, "#FAC6D0"]}
                  fixedWidth={Math.max(
                    SCREEN_W - 80,
                    hireVsExitData.length * 60 + 60,
                  )}
                />
              </ScrollView>
              <ChartTableRN
                columns={hireVsExitData.map((d) => d.name)}
                rows={[
                  {
                    label: "Hire",
                    color: C.blue,
                    values: hireVsExitData.map((d) => d.hire),
                  },
                  {
                    label: "Exit",
                    color: "#FAC6D0",
                    values: hireVsExitData.map((d) => d.exit),
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="Source of Hiring"
              legend={
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                >
                  {[
                    ["Consultancy", C.blue],
                    ["Internal", C.orange],
                    ["Portal", C.grey],
                    ["Website", C.amber],
                  ].map(([l, c]) => (
                    <RNLegendItem key={l} color={c} label={l} />
                  ))}
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <BarChartSVG
                  data={sourceOfHiringData}
                  keys={["consultancy", "internal", "portal", "website"]}
                  colors={[C.blue, C.orange, C.grey, C.amber]}
                  fixedWidth={Math.max(
                    SCREEN_W - 80,
                    sourceOfHiringData.length * 80 + 60,
                  )}
                />
              </ScrollView>
              <ChartTableRN
                columns={sourceOfHiringData.map((d) => d.name)}
                rows={[
                  {
                    label: "Consultancy",
                    color: C.blue,
                    values: sourceOfHiringData.map((d) => d.consultancy),
                  },
                  {
                    label: "Internal",
                    color: C.orange,
                    values: sourceOfHiringData.map((d) => d.internal),
                  },
                  {
                    label: "Portal",
                    color: C.grey,
                    values: sourceOfHiringData.map((d) => d.portal),
                  },
                  {
                    label: "Website",
                    color: C.amber,
                    values: sourceOfHiringData.map((d) => d.website),
                  },
                ]}
              />
            </ChartCard>

            <ChartCard title="Job Levels">
              {overallLevelCounts && (
                <PyramidSVG levelCounts={overallLevelCounts} />
              )}
            </ChartCard>

            <ChartCard
              title="Budget vs Actual CTC by Month"
              legend={
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <RNLegendItem color={C.blueLight} label="Budget" />
                  <RNLegendItem color={C.blue} label="Actual CTC" />
                </View>
              }
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BudgetBarChartSVG data={budgetVsFinalData} />
              </ScrollView>
            </ChartCard>
          </>
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
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
