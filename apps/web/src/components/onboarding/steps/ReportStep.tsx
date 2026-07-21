import type { ReactNode } from "react";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import {
  capacityOptions,
  channelOptions,
  personalityOptions,
  targetMarketOptions,
} from "@/components/onboarding/onboardingMockData";
import type { OnboardingState } from "@/components/onboarding/onboardingTypes";
import { SignalTag } from "@/components/home/SignalTag";

interface Props {
  state: OnboardingState;
  onBack: () => void;
  onComplete: () => void;
  isCompleting?: boolean;
}

function getLabels({
  ids,
  options,
}: {
  ids: Array<string>;
  options: Array<{ id: string; label: string }>;
}) {
  return options.filter((option) => ids.includes(option.id)).map((option) => option.label);
}

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-[10px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
        {title}
      </h3>
      <div className="text-sm/6 text-[#17140f]">{children}</div>
    </div>
  );
}

export function ReportStep({ state, onBack, onComplete, isCompleting = false }: Props) {
  const targetMarketLabels = getLabels({
    ids: state.targetMarkets,
    options: targetMarketOptions,
  });
  const personalityLabels = getLabels({
    ids: state.personality,
    options: personalityOptions,
  });
  const channelLabels = getLabels({
    ids: state.channels,
    options: [...channelOptions],
  });
  const capacityLabel =
    capacityOptions.find((option) => option.id === state.capacity)?.label ?? "—";

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={7}
        totalSteps={7}
        title="Your Signal report"
        subtitle="Here's your configuration summary. When you're ready, launch your growth feed."
      />

      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-5">
          <h2 className="text-base font-semibold tracking-[-0.2px] text-[#17140f]">
            Configuration summary
          </h2>

          <div className="flex flex-col gap-4 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-[rgba(23,20,15,0.02)] p-5">
            <SummarySection title="Website">
              <p>{state.website.url}</p>
            </SummarySection>

            <SummarySection title="What the company does">
              <p>{state.website.companyDescription}</p>
            </SummarySection>

            <SummarySection title="Key differentiators">
              <p>{state.website.keyDifferentiators}</p>
            </SummarySection>

            <SummarySection title="Competitors">
              <p>{state.website.competitors}</p>
            </SummarySection>

            <SummarySection title="Relevant subreddits">
              <p>{state.website.subreddits}</p>
            </SummarySection>

            <SummarySection title="Search keywords">
              <div className="flex flex-col gap-2">
                <p>
                  <span className="font-medium">X:</span> {state.website.searchKeywordsX}
                </p>
                <p>
                  <span className="font-medium">Paid Google:</span>{" "}
                  {state.website.searchKeywordsGoogle}
                </p>
                <p>
                  <span className="font-medium">SEO:</span> {state.website.searchKeywordsSeo}
                </p>
              </div>
            </SummarySection>

            <SummarySection title="Target markets">
              <div className="flex flex-wrap gap-2">
                {targetMarketLabels.map((label) => (
                  <SignalTag key={label} label={label} accent="accent" />
                ))}
              </div>
            </SummarySection>

            <SummarySection title="Personality">
              <div className="flex flex-wrap gap-2">
                {personalityLabels.map((label) => (
                  <SignalTag key={label} label={label} accent="idea" />
                ))}
              </div>
            </SummarySection>

            <SummarySection title="Channels">
              <div className="flex flex-wrap gap-2">
                {channelLabels.map((label) => (
                  <SignalTag key={label} label={label} accent="info" />
                ))}
              </div>
            </SummarySection>

            <SummarySection title="Capacity">
              <p>{capacityLabel}</p>
            </SummarySection>

            <SummarySection title="Integrations">
              <div className="flex flex-wrap gap-2">
                {state.integrations.stripe ? (
                  <SignalTag label="Stripe" accent="success" />
                ) : null}
                {state.integrations.mixpanel ? (
                  <SignalTag label="Mixpanel" accent="idea" />
                ) : null}
                {state.integrations.metaAds ? <SignalTag label="Meta Ads" accent="info" /> : null}
                {!state.integrations.stripe &&
                !state.integrations.mixpanel &&
                !state.integrations.metaAds ? (
                  <p className="text-[rgba(23,20,15,0.55)]">No integrations connected</p>
                ) : null}
              </div>
            </SummarySection>
          </div>
        </section>
      </div>

      <OnboardingFooter
        onBack={onBack}
        onContinue={onComplete}
        continueLabel={isCompleting ? "Saving..." : "Launch feed"}
        isContinueDisabled={isCompleting}
        isBackDisabled={isCompleting}
      />
    </OnboardingCard>
  );
}
