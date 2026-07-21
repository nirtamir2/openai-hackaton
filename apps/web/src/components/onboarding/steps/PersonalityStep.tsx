import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { personalityOptions } from "@/components/onboarding/onboardingMockData";
import { SelectableOptionRow } from "@/components/onboarding/SelectableOptionRow";

interface Props {
  selectedIds: Array<string>;
  onChange: (selectedIds: Array<string>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PersonalityStep({ selectedIds, onChange, onBack, onContinue }: Props) {
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
        stepNumber={3}
        totalSteps={7}
        title="What's your brand personality?"
        subtitle="Pick the voices that fit — I generated these from your website."
        showAiBadge
      />

      <div className="flex flex-col gap-2.5">
        {personalityOptions.map((option) => (
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
