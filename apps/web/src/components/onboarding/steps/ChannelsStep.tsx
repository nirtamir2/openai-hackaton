import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { channelOptions } from "@/components/onboarding/onboardingMockData";
import { ToggleOptionRow } from "@/components/onboarding/ToggleOptionRow";

interface Props {
  selectedIds: Array<string>;
  onChange: (selectedIds: Array<string>) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ChannelsStep({ selectedIds, onChange, onBack, onContinue }: Props) {
  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={4}
        totalSteps={6}
        title="Which channels should Signal run?"
        subtitle="All channels are on by default — turn off any you don't want us to manage."
      />

      <div className="flex flex-col gap-2.5">
        {channelOptions.map((option) => (
          <ToggleOptionRow
            key={option.id}
            option={option}
            isEnabled={selectedIds.includes(option.id)}
            onChange={(enabled) => {
              if (enabled) {
                if (!selectedIds.includes(option.id)) {
                  onChange([...selectedIds, option.id]);
                }
                return;
              }

              onChange(selectedIds.filter((item) => item !== option.id));
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
