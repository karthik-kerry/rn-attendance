import { toLocalDateStr } from "./dateHelpers";
import {
  MONTHS_FY_ORDER,
  QUARTER_OPTIONS,
  HALF_OPTIONS,
  RANGE_FIELD_MAP,
} from "../constant/filterConstants";

export const getCurrentFYStart = () => {
  const today = new Date();
  return today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
};

export const getCurrentMonthRange = (startDay = 1) => {
  const today = new Date();
  const periodStart =
    today.getDate() >= startDay
      ? new Date(today.getFullYear(), today.getMonth(), startDay)
      : new Date(today.getFullYear(), today.getMonth() - 1, startDay);
  periodStart.setHours(0, 0, 0, 0);
  return { start: toLocalDateStr(periodStart), end: toLocalDateStr(today) };
};

export const getFYMonthRange = (
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

export const getFYQuarterRange = (
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

export const getFYHalfRange = (
  hIdx,
  fyStart = getCurrentFYStart(),
  startDay = 1,
) => {
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

export const getFYFullRange = (fyStart = getCurrentFYStart(), startDay = 1) => {
  const start = new Date(fyStart, 3, startDay);
  const end = new Date(fyStart + 1, 3, startDay - 1);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start: toLocalDateStr(start), end: toLocalDateStr(end) };
};

export const computeRangeForFilter = (
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

export const normalizeRangeSplit = (response = {}) => {
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

export const getSubOptions = (filterType) => {
  if (filterType === "quarterly") return QUARTER_OPTIONS;
  if (filterType === "half_yearly") return HALF_OPTIONS;
  if (filterType === "monthly") return MONTHS_FY_ORDER;
  return [];
};

export const getDefaultSubIdx = (filterType) => {
  const opts = getSubOptions(filterType);
  return opts.length > 0 ? String(opts[0].idx) : "";
};
