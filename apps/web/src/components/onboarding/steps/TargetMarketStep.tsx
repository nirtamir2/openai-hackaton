import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import type { SelectableOption } from "@/components/onboarding/onboardingTypes";
import { SelectableOptionRow } from "@/components/onboarding/SelectableOptionRow";

interface Props {
  options: Array<SelectableOption>;
  selectedIds: Array<string>;
  onChange: (selectedIds: Array<string>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function TargetMarketStep({ options, selectedIds, onChange, onBack, onContinue }: Props) {
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
        stepNumber={2}
        totalSteps={6}
        title="Which target market do you want to focus on?"
        subtitle="Select the audiences you want to reach."
        showAiBadge
      />

      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <SelectableOptionRow
            key={option.id}
            option={option}
            isSelected={selectedIds.includes(option.id)}
            onToggle={() => {
              toggleOption(option.id);
            }}
          />
        ))}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onContinue={onContinue}
        isContinueDisabled={selectedIds.length === 0}
      />
    </OnboardingCard>
  );
}
