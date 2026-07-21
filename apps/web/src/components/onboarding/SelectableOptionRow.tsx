import clsx from "clsx";
import { Check } from "lucide-react";
import type { SelectableOption } from "@/components/onboarding/onboardingMockData";

interface Props {
  option: SelectableOption;
  isSelected: boolean;
  onToggle: () => void;
}

export function SelectableOptionRow({ option, isSelected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left text-sm font-medium transition-colors",
        isSelected ? "border-transparent text-white" : "border-[rgba(23,20,15,0.12)] bg-white text-[#17140f]",
      )}
      style={isSelected ? { backgroundColor: option.selectedColor } : undefined}
    >
      <span
        className={clsx(
          "flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
          isSelected
            ? "border-white/30 bg-white/20"
            : "border-[rgba(23,20,15,0.2)] bg-transparent",
        )}
      >
        {isSelected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
      </span>
      {option.label}
    </button>
  );
}
