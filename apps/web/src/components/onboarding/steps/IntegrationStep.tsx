import clsx from "clsx";
import { Check, ExternalLink } from "lucide-react";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import type { OnboardingIntegrations } from "@/components/onboarding/onboardingTypes";
import { SignalButton } from "@/components/home/SignalButton";

interface Props {
  integrations: OnboardingIntegrations;
  onChange: (integrations: OnboardingIntegrations) => void;
  onBack: () => void;
  onContinue: () => void;
}

const integrationItems = [
  {
    id: "stripe" as const,
    name: "Stripe",
    description: "Revenue, subscriptions, and customer data.",
    color: "#635bff",
  },
  {
    id: "mixpanel" as const,
    name: "Mixpanel",
    description: "Product analytics and funnel tracking.",
    color: "#7856ff",
  },
  {
    id: "metaAds" as const,
    name: "Meta Ads",
    description: "Ad spend, campaigns, and attribution.",
    color: "#0081fb",
  },
];

export function IntegrationStep({ integrations, onChange, onBack, onContinue }: Props) {
  function toggleIntegration(id: keyof OnboardingIntegrations) {
    onChange({
      ...integrations,
      [id]: !integrations[id],
    });
  }

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={6}
        totalSteps={6}
        title="Connect your tools"
        subtitle="Link your accounts so Signal can track revenue and optimize campaigns."
      />

      <div className="flex flex-col gap-3">
        {integrationItems.map((item) => {
          const isConnected = integrations[item.id];

          return (
            <div
              key={item.id}
              className={clsx(
                "flex flex-wrap items-center justify-between gap-4 rounded-[12px] border p-4",
                isConnected
                  ? "border-[#2f6f4e] bg-[#f0f7f3]"
                  : "border-[rgba(23,20,15,0.12)] bg-white",
              )}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-[#17140f]">{item.name}</span>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#2f6f4e] px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                      <Check className="size-3" />
                      Connected
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-[rgba(23,20,15,0.55)]">{item.description}</p>
              </div>

              <SignalButton
                variant={isConnected ? "secondary" : "primary"}
                size="sm"
                onClick={() => {
                  toggleIntegration(item.id);
                }}
              >
                {isConnected ? "Disconnect" : "Connect"}
                <ExternalLink className="size-3.5" />
              </SignalButton>
            </div>
          );
        })}
      </div>

      <OnboardingFooter onBack={onBack} onContinue={onContinue} continueLabel="Generate today's plan" />
    </OnboardingCard>
  );
}
