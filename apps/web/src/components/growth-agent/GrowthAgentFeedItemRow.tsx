import clsx from "clsx";
import { Check } from "lucide-react";
import type { GrowthAgentFeedItem } from "@/components/growth-agent/growthAgentTypes";

interface Props {
  item: GrowthAgentFeedItem;
  completed: boolean;
  onToggle: () => void;
  onOpen: () => void;
}

export function GrowthAgentFeedItemRow({ item, completed, onToggle, onOpen }: Props) {
  const status = completed
    ? "Completed"
    : item.live === true
      ? "Ready to publish"
      : "Scheduled";

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
      className={clsx(
        "flex cursor-pointer items-center gap-3.5 rounded-[10px] border border-[rgba(23,20,15,0.1)] bg-white px-[18px] py-3.5 shadow-[0_1px_2px_rgba(23,20,15,0.03)]",
        completed ? "opacity-55" : "opacity-100",
      )}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={clsx(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px]",
          completed
            ? "border-[#2f6f4e] bg-[#2f6f4e]"
            : "border-[rgba(23,20,15,0.25)] bg-transparent",
        )}
      >
        {completed ? <Check className="size-[11px] stroke-[3] text-white" /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-[3px] flex min-w-0 items-center gap-[7px]">
          <span
            className="inline-block size-[5px] shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span
            className="shrink-0 font-mono text-[10px] font-semibold tracking-[0.3px]"
            style={{ color: item.color }}
          >
            {item.tag}
          </span>
          <span className="min-w-0 truncate text-[11.5px] text-[rgba(23,20,15,0.4)]">
            {item.meta}
          </span>
        </div>
        <p
          className={clsx(
            "truncate text-[14.5px] font-medium text-[rgba(23,20,15,0.88)]",
            completed ? "line-through" : "no-underline",
          )}
        >
          {item.title}
        </p>
      </div>

      <span
        className={clsx(
          "flex shrink-0 items-center gap-[5px] rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
          completed
            ? "bg-[rgba(47,111,78,0.1)] text-[#2f6f4e]"
            : item.live === true
              ? "bg-[rgba(255,90,31,0.12)] text-[#c9440e]"
              : "bg-[rgba(23,20,15,0.06)] text-[rgba(23,20,15,0.5)]",
        )}
      >
        {completed ? <Check className="size-[9px] stroke-[3]" /> : null}
        {status}
      </span>
    </div>
  );
}
