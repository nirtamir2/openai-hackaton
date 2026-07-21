const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export type MarketingTaskDayKey = (typeof dayKeys)[number];

function pad(part: number) {
  return String(part).padStart(2, "0");
}

export function getLocalDateKey({ date }: { date: Date }) {
  return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayLocalDateKey() {
  return getLocalDateKey({ date: new Date() });
}

export function getDayKeyFromDate({ date }: { date: Date }): MarketingTaskDayKey {
  return dayKeys[date.getDay()] ?? "mon";
}

export function isScheduledForToday({ date }: { date: Date }) {
  return getLocalDateKey({ date }) === getTodayLocalDateKey();
}

export function isMarketingTaskTargetedForToday({ targetDate }: { targetDate: Date }) {
  return isScheduledForToday({ date: targetDate });
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

  const endOfTargetDay = new Date(targetDate);
  endOfTargetDay.setHours(23, 0, 0, 0);

  if (scheduledStart.getTime() > endOfTargetDay.getTime()) {
    scheduledStart.setTime(endOfTargetDay.getTime());
  }

  const scheduledEnd = new Date(scheduledStart);
  scheduledEnd.setHours(scheduledEnd.getHours() + 1);

  if (getLocalDateKey({ date: scheduledEnd }) !== getLocalDateKey({ date: targetDate })) {
    scheduledEnd.setHours(23, 59, 59, 999);
  }

  return { targetDate, scheduledStart, scheduledEnd };
}
