import clsx from "clsx";
import { Check } from "lucide-react";
import type { SelectableOption } from "@/components/onboarding/onboardingTypes";

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
        "flex w-full items-start gap-3 rounded-[12px] border px-4 py-3.5 text-left transition-colors",
        isSelected
          ? "border-[#17140f] bg-[rgba(23,20,15,0.03)]"
          : "border-[rgba(23,20,15,0.12)] bg-white hover:border-[rgba(23,20,15,0.25)]",
      )}
    >
      <span
        className={clsx(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] border",
          isSelected
            ? "border-[#17140f] bg-[#17140f] text-white"
            : "border-[rgba(23,20,15,0.2)] bg-transparent",
        )}
      >
        {isSelected ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
      </span>

      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-[#17140f]">{option.title}</span>
        <span className="text-sm text-[rgba(23,20,15,0.55)]">{option.subtitle}</span>
      </span>
    </button>
  );
}
