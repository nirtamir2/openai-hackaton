function pad(part: number) {
  return String(part).padStart(2, "0");
}

export function getLocalDateKey({ date }: { date: Date }) {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayLocalDateKey() {
  return getLocalDateKey({ date: new Date() });
}

export function isScheduledForToday({ date }: { date: Date }) {
  return getLocalDateKey({ date }) === getTodayLocalDateKey();
}

export function getTodaySchedule() {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setHours(0, 0, 0, 0);

  const scheduledStart = new Date(now);
  scheduledStart.setHours(9, 0, 0, 0);

  if (scheduledStart.getTime() <= now.getTime()) {
    scheduledStart.setTime(now.getTime());
    scheduledStart.setMinutes(0, 0, 0);
    scheduledStart.setSeconds(0, 0);
    scheduledStart.setMilliseconds(0);
    scheduledStart.setHours(scheduledStart.getHours() + 1);
  }

  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setHours(scheduledEnd.getHours() + 1);

  return { targetDate, scheduledStart, scheduledEnd };
}
