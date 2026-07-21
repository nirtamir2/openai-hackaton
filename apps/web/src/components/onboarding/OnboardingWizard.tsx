import { MOCK_PRODUCT_ID } from "@app-template/db/mockProductId";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getCompanyNameFromUrl } from "@/components/growth-agent/growthAgentMockData";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { createInitialOnboardingState } from "@/components/onboarding/onboardingMockData";
import { onboardingSteps } from "@/components/onboarding/onboardingSteps";
import { saveOnboardingCompanyName } from "@/components/onboarding/onboardingStorage";
import type { OnboardingState } from "@/components/onboarding/onboardingTypes";
import { CapacityStep } from "@/components/onboarding/steps/CapacityStep";
import { ChannelsStep } from "@/components/onboarding/steps/ChannelsStep";
import { IntegrationStep } from "@/components/onboarding/steps/IntegrationStep";
import { PersonalityStep } from "@/components/onboarding/steps/PersonalityStep";
import { ReportStep } from "@/components/onboarding/steps/ReportStep";
import { TargetMarketStep } from "@/components/onboarding/steps/TargetMarketStep";
import { WebsiteInputStep } from "@/components/onboarding/steps/WebsiteInputStep";

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<OnboardingState>(createInitialOnboardingState);

  const currentStepId = onboardingSteps[currentStepIndex].id;

  function handleOnboardingComplete() {
    const companyName = getCompanyNameFromUrl({ url: state.website.url });
    saveOnboardingCompanyName({ companyName });

    void navigate({
      to: "/products/$productId/feed",
      params: { productId: MOCK_PRODUCT_ID },
    });
  }

  function goToNextStep() {
    setCurrentStepIndex((index) => Math.min(index + 1, onboardingSteps.length - 1));
  }

  function goToPreviousStep() {
    setCurrentStepIndex((index) => Math.max(index - 1, 0));
  }

  function renderStep() {
    switch (currentStepId) {
      case "website": {
        return (
          <WebsiteInputStep
            data={state.website}
            onChange={(website) => {
              setState((previous) => ({ ...previous, website }));
            }}
            onContinue={goToNextStep}
          />
        );
      }
      case "target-market": {
        return (
          <TargetMarketStep
            selectedIds={state.targetMarkets}
            onChange={(targetMarkets) => {
              setState((previous) => ({ ...previous, targetMarkets }));
            }}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      }
      case "personality": {
        return (
          <PersonalityStep
            selectedIds={state.personality}
            onChange={(personality) => {
              setState((previous) => ({ ...previous, personality }));
            }}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      }
      case "channels": {
        return (
          <ChannelsStep
            selectedIds={state.channels}
            onChange={(channels) => {
              setState((previous) => ({ ...previous, channels }));
            }}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      }
      case "capacity": {
        return (
          <CapacityStep
            selectedId={state.capacity}
            onChange={(capacity) => {
              setState((previous) => ({ ...previous, capacity }));
            }}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      }
      case "integration": {
        return (
          <IntegrationStep
            integrations={state.integrations}
            onChange={(integrations) => {
              setState((previous) => ({ ...previous, integrations }));
            }}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      }
      case "report": {
        return (
          <ReportStep
            state={state}
            onBack={goToPreviousStep}
            onComplete={handleOnboardingComplete}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  return <OnboardingLayout currentStepId={currentStepId}>{renderStep()}</OnboardingLayout>;
}
