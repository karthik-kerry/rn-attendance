export const STAT_CARD_TEMPLATE = [
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

export const SHORT_MONTHS = [
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

export const PERIOD_COLORS = [
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

export const RANGE_FIELD_MAP = {
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

export const FILTER_TYPE_OPTIONS = [
  { label: "Current Month", value: "current_month" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Half Yearly", value: "half_yearly" },
  { label: "Financial Year", value: "financial_year" },
];

export const FILTER_FORM_FIELDS = {
  current_month: { key: "filter", value: "current_month" },
  weekly: { key: "filter", value: "weekly" },
  monthly: { key: "filter", value: "monthly" },
  quarterly: { key: "filter", value: "quarterly" },
  half_yearly: { key: "filter", value: "halfly" },
  financial_year: { key: "filter", value: "yearly" },
  custom: { key: "filter", value: "monthly" },
};

export const FILTER_LABELS = {
  current_month: "Current Month",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  half_yearly: "Half Yearly",
  financial_year: "Financial Year",
  custom: "Custom Range",
};

export const MONTHS_FY_ORDER = [
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

export const QUARTER_OPTIONS = [
  { label: "Q1 (Apr–Jun)", idx: 0 },
  { label: "Q2 (Jul–Sep)", idx: 1 },
  { label: "Q3 (Oct–Dec)", idx: 2 },
  { label: "Q4 (Jan–Mar)", idx: 3 },
];

export const HALF_OPTIONS = [
  { label: "H1 (Apr–Sep)", idx: 0 },
  { label: "H2 (Oct–Mar)", idx: 1 },
];
