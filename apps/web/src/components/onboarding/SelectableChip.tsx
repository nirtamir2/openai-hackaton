import clsx from "clsx";
import { Check } from "lucide-react";
import type { SelectableOption } from "@/components/onboarding/onboardingMockData";

interface Props {
  option: SelectableOption;
  isSelected: boolean;
  onToggle: () => void;
}

export function SelectableChip({ option, isSelected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        isSelected ? "border-transparent text-white" : "bg-white",
      )}
      style={
        isSelected
          ? { backgroundColor: option.selectedColor }
          : {
              borderColor: option.unselectedBorderColor,
              color: option.unselectedTextColor,
            }
      }
    >
      {isSelected ? (
        <span className="flex size-4 items-center justify-center rounded-[4px] bg-white/20">
          <Check className="size-3" strokeWidth={2.5} />
        </span>
      ) : null}
      {option.label}
    </button>
  );
}
