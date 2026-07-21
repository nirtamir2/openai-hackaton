import clsx from "clsx";
import type { GrowthAgentDay, GrowthAgentDayKey } from "@/components/growth-agent/growthAgentMockData";
import { growthAgentToday } from "@/components/growth-agent/growthAgentMockData";

interface Props {
  days: Array<GrowthAgentDay>;
  selectedDay: GrowthAgentDayKey;
  dayDots: Record<GrowthAgentDayKey, Array<string>>;
  onSelectDay: (day: GrowthAgentDayKey) => void;
}

export function GrowthAgentDayPicker({ days, selectedDay, dayDots, onSelectDay }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isActive = day.key === selectedDay;
        const isToday = day.key === growthAgentToday;

        return (
          <button
            key={day.key}
            type="button"
            onClick={() => {
              onSelectDay(day.key);
            }}
            className={clsx(
              "flex flex-col items-center rounded-[10px] border px-1.5 py-3 text-center transition-colors",
              isActive
                ? "border-[#17140f] bg-[#17140f]"
                : isToday
                  ? "border-[rgba(255,90,31,0.3)] bg-[rgba(255,90,31,0.08)]"
                  : "border-[rgba(23,20,15,0.1)] bg-white",
            )}
          >
            <span
              className={clsx(
                "font-mono text-[10px] font-semibold tracking-[0.4px]",
                isActive ? "text-white/50" : "text-[rgba(23,20,15,0.4)]",
              )}
            >
              {day.label}
            </span>
            <span
              className={clsx(
                "my-1 text-base font-semibold",
                isActive ? "text-white" : "text-[#17140f]",
              )}
            >
              {day.date}
            </span>
            <div className="flex min-h-[5px] justify-center gap-[3px]">
              {dayDots[day.key].map((color, index) => (
                <span
                  key={`${day.key}-${String(index)}`}
                  className="inline-block size-[5px] rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
