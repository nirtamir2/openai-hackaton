import type { GrowthAgentDay, GrowthAgentDayKey } from "@/components/growth-agent/growthAgentTypes";

const dayKeys: Array<GrowthAgentDayKey> = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const todayKeys: Array<GrowthAgentDayKey> = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function getGrowthAgentToday(): GrowthAgentDayKey {
  return todayKeys[new Date().getDay()] ?? "mon";
}

export function getGrowthAgentDays(): Array<GrowthAgentDay> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

  return dayKeys.map((key, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);

    return {
      key,
      label: dayLabels[index] ?? key.toUpperCase(),
      date: date.getDate(),
    };
  });
}
