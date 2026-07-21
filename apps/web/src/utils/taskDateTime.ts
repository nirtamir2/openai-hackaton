function pad(part: number) {
  return String(part).padStart(2, "0");
}

export function toDate(value: Date | string) {
  return typeof value === "string" ? new Date(value) : value;
}

export function toDateInputValue(value: Date | string) {
  const date = toDate(value);

  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toDatetimeLocalValue(value: Date | string) {
  const date = toDate(value);

  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatTaskDate(value: Date | string) {
  return toDate(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTaskDateTime(value: Date | string) {
  return toDate(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getDefaultScheduleDates() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(9, 0, 0, 0);

  const end = new Date(start);
  end.setHours(10, 0, 0, 0);

  const targetDate = new Date(start);
  targetDate.setHours(0, 0, 0, 0);

  return { targetDate, scheduledStart: start, scheduledEnd: end };
}

export function getTaskListDateRange() {
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);
  from.setHours(0, 0, 0, 0);

  const to = new Date();
  to.setFullYear(to.getFullYear() + 2);
  to.setHours(23, 59, 59, 999);

  return { from, to };
}
