import clsx from "clsx";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { capacityOptions } from "@/components/onboarding/onboardingMockData";

interface Props {
  selectedId: string | null;
  onChange: (selectedId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function CapacityStep({ selectedId, onChange, onBack, onContinue }: Props) {
  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={5}
        totalSteps={6}
        title="How much time can you invest?"
        subtitle="This helps us calibrate how aggressively Signal runs your campaigns."
      />

      <div className="flex flex-col gap-2.5">
        {capacityOptions.map((option) => {
          const isSelected = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
              }}
              className={clsx(
                "flex w-full flex-col gap-1 rounded-[12px] border px-4 py-3.5 text-left transition-colors",
                isSelected
                  ? "border-[#ff5a1f] bg-[#fff0e8]"
                  : "border-[rgba(23,20,15,0.12)] bg-white hover:border-[rgba(23,20,15,0.25)]",
              )}
            >
              <span className="text-sm font-medium text-[#17140f]">
                {option.label}
              </span>
              <span className="text-sm text-[rgba(23,20,15,0.55)]">{option.description}</span>
            </button>
          );
        })}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onContinue={onContinue}
        isContinueDisabled={selectedId == null}
      />
    </OnboardingCard>
  );
}
