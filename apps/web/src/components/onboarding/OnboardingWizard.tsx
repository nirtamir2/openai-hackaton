import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getCompanyNameFromUrl } from "@/components/growth-agent/growthAgentTypes";
import { DailyPlanGenerationProgress } from "@/components/onboarding/DailyPlanGenerationProgress";
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
import { TargetMarketStep } from "@/components/onboarding/steps/TargetMarketStep";
import { WebsiteInputStep } from "@/components/onboarding/steps/WebsiteInputStep";
import { getOrpcErrorMessage } from "@/utils/getOrpcErrorMessage";
import { getGenerateMarketingTasksMutationOptions } from "@/utils/generateMarketingTasksMutation";
import { orpc } from "@/utils/orpc";

export function OnboardingWizard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [state, setState] = useState<OnboardingState>(createInitialOnboardingState);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [productIdForFeed, setProductIdForFeed] = useState<string | null>(null);

  const generateTasksMutation = useMutation(
    getGenerateMarketingTasksMutationOptions({
      onSuccess: async (_result, input) => {
        await queryClient.invalidateQueries({
          queryKey: orpc.feed.getFeed.key({ input: { productId: input.productId } }),
        });
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const completeOnboardingMutation = useMutation(
    orpc.onboarding.completeOnboarding.mutationOptions({
      onSuccess: (result, onboardingState) => {
        const companyName = getCompanyNameFromUrl({ url: onboardingState.website.url });
        saveOnboardingCompanyName({ companyName });
        saveOnboardingProductId({ productId: result.productId });
        setProductIdForFeed(result.productId);
        generateTasksMutation.mutate({
          productId: result.productId,
          forToday: true,
          taskCount: 3,
        });
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const currentStepId = onboardingSteps[currentStepIndex].id;

  function handleNavigateToFeed() {
    if (productIdForFeed == null) {
      return;
    }

    void navigate({
      to: "/products/$productId/feed",
      params: { productId: productIdForFeed },
    });
  }

  function startPlanGeneration() {
    if (state.personality == null) {
      return;
    }

    setIsGeneratingPlan(true);
    completeOnboardingMutation.mutate({
      website: state.website,
      targetMarkets: state.targetMarkets,
      personality: [state.personality],
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
    if (isGeneratingPlan) {
      return (
        <DailyPlanGenerationProgress
          state={state}
          canNavigate={productIdForFeed != null}
          onComplete={handleNavigateToFeed}
        />
      );
    }

    switch (currentStepId) {
      case "website": {
        return (
          <WebsiteInputStep
            data={state.website}
            onChange={(website) => {
              setState((previous) => ({ ...previous, website }));
            }}
            onAnalysisComplete={(analysis) => {
              setState((previous) => ({
                ...previous,
                targetMarketOptions: analysis.targetMarketOptions,
                targetMarkets: [],
                personalityOptions: analysis.personalityOptions,
                personality: null,
              }));
            }}
            onContinue={goToNextStep}
          />
        );
      }
      case "target-market": {
        return (
          <TargetMarketStep
            options={state.targetMarketOptions}
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
            options={state.personalityOptions}
            selectedId={state.personality}
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
            onContinue={startPlanGeneration}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  return (
    <OnboardingLayout
      currentStepId={isGeneratingPlan ? null : currentStepId}
      hideStepper={isGeneratingPlan}
    >
      {renderStep()}
    </OnboardingLayout>
  );
}
