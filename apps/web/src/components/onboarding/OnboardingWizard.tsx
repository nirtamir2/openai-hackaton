import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getCompanyNameFromUrl } from "@/components/growth-agent/growthAgentTypes";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { createInitialOnboardingState } from "@/components/onboarding/onboardingMockData";
import { onboardingSteps } from "@/components/onboarding/onboardingSteps";
import {
  saveOnboardingCompanyName,
  saveOnboardingProductId,
} from "@/components/onboarding/onboardingStorage";
import type { OnboardingState } from "@/components/onboarding/onboardingTypes";
import { CapacityStep } from "@/components/onboarding/steps/CapacityStep";
import { ChannelsStep } from "@/components/onboarding/steps/ChannelsStep";
import { IntegrationStep } from "@/components/onboarding/steps/IntegrationStep";
import { PersonalityStep } from "@/components/onboarding/steps/PersonalityStep";
import { ReportStep } from "@/components/onboarding/steps/ReportStep";
import { TargetMarketStep } from "@/components/onboarding/steps/TargetMarketStep";
import { WebsiteInputStep } from "@/components/onboarding/steps/WebsiteInputStep";
import { getOrpcErrorMessage } from "@/utils/getOrpcErrorMessage";
import { orpc } from "@/utils/orpc";

export function OnboardingWizard() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<OnboardingState>(createInitialOnboardingState);

  const completeOnboardingMutation = useMutation(
    orpc.onboarding.completeOnboarding.mutationOptions({
      onSuccess: (result, onboardingState) => {
        const companyName = getCompanyNameFromUrl({ url: onboardingState.website.url });
        saveOnboardingCompanyName({ companyName });
        saveOnboardingProductId({ productId: result.productId });
        toast.success("Onboarding saved.");

        void navigate({
          to: "/products/$productId/feed",
          params: { productId: result.productId },
        });
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const currentStepId = onboardingSteps[currentStepIndex].id;

  function handleOnboardingComplete() {
    completeOnboardingMutation.mutate({
      website: state.website,
      targetMarkets: state.targetMarkets,
      personality: state.personality,
      channels: state.channels,
      capacity: state.capacity,
      integrations: state.integrations,
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
            isCompleting={completeOnboardingMutation.isPending}
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
