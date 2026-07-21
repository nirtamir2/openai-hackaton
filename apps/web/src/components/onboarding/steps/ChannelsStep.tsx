import clsx from "clsx";
import { Check } from "lucide-react";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { channelOptions } from "@/components/onboarding/onboardingMockData";

interface Props {
  selectedIds: Array<string>;
  onChange: (selectedIds: Array<string>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ChannelsStep({ selectedIds, onChange, onBack, onContinue }: Props) {
  function toggleOption(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
      return;
    }

    onChange([...selectedIds, id]);
  }

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={4}
        totalSteps={7}
        title="Which channels should we run?"
        subtitle="Select the marketing channels you want Signal to manage."
      />

      <div className="flex flex-col gap-2.5">
        {channelOptions.map((option) => {
          const isSelected = selectedIds.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                toggleOption(option.id);
              }}
              className={clsx(
                "flex w-full items-center gap-3 rounded-[12px] border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                isSelected
                  ? "border-[#17140f] bg-[#17140f] text-white"
                  : "border-[rgba(23,20,15,0.12)] bg-white text-[#17140f] hover:border-[rgba(23,20,15,0.25)]",
              )}
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
        })}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onContinue={onContinue}
        isContinueDisabled={selectedIds.length === 0}
      />
    </OnboardingCard>
  );
}
