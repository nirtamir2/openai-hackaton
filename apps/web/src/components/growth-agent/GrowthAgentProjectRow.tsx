import { Check } from "lucide-react";
import type { GrowthAgentProject } from "@/components/growth-agent/growthAgentMockData";

interface Props {
  project: GrowthAgentProject;
  doneCount: number;
  onOpen: () => void;
}

export function GrowthAgentProjectRow({ project, doneCount, onOpen }: Props) {
  const total = project.todos.length;
  const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const isAdRow = project.type === "ad";
  const isCompleted = project.defaultCompleted === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="flex cursor-pointer items-center gap-3.5 rounded-[10px] border border-[rgba(23,20,15,0.1)] bg-white px-[18px] py-3.5 shadow-[0_1px_2px_rgba(23,20,15,0.03)]"
    >
      <span
        className="inline-block size-2 shrink-0 rounded-full"
        style={{ backgroundColor: isAdRow ? project.color : "#6a3fd1" }}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-medium text-[rgba(23,20,15,0.88)]">
          {project.title}
        </p>
        <p className="mt-0.5 text-xs text-[rgba(23,20,15,0.42)]">{project.meta}</p>
      </div>

      {isAdRow && isCompleted ? (
        <span className="flex shrink-0 items-center gap-[5px] rounded-md bg-[rgba(47,111,78,0.1)] px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-[#2f6f4e]">
          <Check className="size-[9px] stroke-[3]" />
          {project.doneLabel ?? "Live"}
        </span>
      ) : null}

      {!isAdRow && total > 0 ? (
        <div className="flex shrink-0 items-center gap-2">
          <div className="h-[5px] w-[60px] overflow-hidden rounded-[3px] bg-[rgba(23,20,15,0.08)]">
            <div
              className="h-full bg-[#6a3fd1]"
              style={{ width: `${String(progressPct)}%` }}
            />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap text-[rgba(23,20,15,0.5)]">
            {doneCount} of {total} done
          </span>
        </div>
      ) : null}
    </div>
  );
}
