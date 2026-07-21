import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { targetMarketOptions } from "@/components/onboarding/onboardingMockData";
import { SelectableChip } from "@/components/onboarding/SelectableChip";

interface Props {
  selectedIds: Array<string>;
  onChange: (selectedIds: Array<string>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function TargetMarketStep({ selectedIds, onChange, onBack, onContinue }: Props) {
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
        totalSteps={7}
        title="Who's your target market?"
        subtitle="Select all that apply — I generated these from your website."
        showAiBadge
      />

      <div className="flex flex-wrap gap-2.5">
        {targetMarketOptions.map((option) => (
          <SelectableChip
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
