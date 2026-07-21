import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import type { SelectableOption } from "@/components/onboarding/onboardingTypes";
import { SelectableOptionRow } from "@/components/onboarding/SelectableOptionRow";

interface Props {
  options: Array<SelectableOption>;
  selectedId: string | null;
  onChange: (selectedId: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PersonalityStep({ options, selectedId, onChange, onBack, onContinue }: Props) {
  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={3}
        totalSteps={6}
        title="Which brand personality do you want to lead with?"
        subtitle="Pick the voice that best fits how you want to show up."
        showAiBadge
      />

      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <SelectableOptionRow
            key={option.id}
            option={option}
            isSelected={selectedId === option.id}
            onToggle={() => {
              onChange(option.id);
            }}
          />
        ))}
      </div>

      <OnboardingFooter
        onBack={onBack}
        onContinue={onContinue}
        isContinueDisabled={selectedId == null}
      />
    </OnboardingCard>
  );
}
