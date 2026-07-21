import type { OnboardingStepId } from "@/components/onboarding/onboardingTypes";

export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  label: string;
}

export const onboardingSteps: Array<OnboardingStepDefinition> = [
  { id: "website", label: "Website Input" },
  { id: "target-market", label: "Target Market" },
  { id: "personality", label: "Personality" },
  { id: "channels", label: "Channels" },
  { id: "capacity", label: "Capacity" },
  { id: "integration", label: "Integration" },
];

export const onboardingStepCount = onboardingSteps.length;
