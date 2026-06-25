import dayjs from "dayjs";

export const pad = (v) => String(v).padStart(2, "0");

export const toLocalDateStr = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  const [year, month, day] = String(dateStr).split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDisplay = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatLocalDateTime = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  const secs = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${mins}:${secs}`;
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return "—";
  return dayjs(dateStr).format("DD MMM");
};

export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getStartOfDayISO = (dateStr) => {
  const d = parseLocalDate(dateStr);
  d.setHours(0, 0, 0, 0);
  return formatLocalDateTime(d);
};

export const getEndOfDayISO = (dateStr) => {
  const today = new Date();
  const selected = parseLocalDate(dateStr);
  if (selected.toDateString() === today.toDateString())
    return formatLocalDateTime(new Date());
  selected.setHours(23, 59, 59, 999);
  return formatLocalDateTime(selected);
};
