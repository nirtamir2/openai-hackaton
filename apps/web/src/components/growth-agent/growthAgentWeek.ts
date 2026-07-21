import type { GrowthAgentDay, GrowthAgentDayKey } from "@/components/growth-agent/growthAgentTypes";

const dayKeys: Array<GrowthAgentDayKey> = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const todayKeys: Array<GrowthAgentDayKey> = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getGrowthAgentToday(): GrowthAgentDayKey {
  return todayKeys[new Date().getDay()] ?? "sun";
}

export function getGrowthAgentDays(): Array<GrowthAgentDay> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - dayOfWeek);

  return dayKeys.map((key, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);

    return {
      key,
      label: dayLabels[index] ?? key.toUpperCase(),
      date: date.getDate(),
    };
  });
}
