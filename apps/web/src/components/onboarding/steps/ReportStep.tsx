import type { ReactNode } from "react";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import {
  capacityOptions,
  channelOptions,
  mockRevenueDashboard,
  personalityOptions,
  targetMarketOptions,
} from "@/components/onboarding/onboardingMockData";
import type { OnboardingState } from "@/components/onboarding/onboardingTypes";
import { SignalTag } from "@/components/home/SignalTag";

interface Props {
  state: OnboardingState;
  onBack: () => void;
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] border border-[rgba(23,20,15,0.1)] bg-[rgba(23,20,15,0.02)] p-4">
      <p className="font-mono text-[10px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
        {label}
      </p>
      <p className="text-xl font-semibold tracking-[-0.3px] text-[#17140f]">{value}</p>
    </div>
  );
}

export function ReportStep({ state, onBack }: Props) {
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

  const maxDailyRevenue = Math.max(
    ...mockRevenueDashboard.dailyRevenue.map((item) => item.amount),
  );

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={7}
        totalSteps={7}
        title="Your Signal report"
        subtitle="Here's your configuration summary and a preview of your revenue dashboard."
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

        <section className="flex flex-col gap-5">
          <h2 className="text-base font-semibold tracking-[-0.2px] text-[#17140f]">
            Revenue dashboard
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Revenue (30d)"
              value={mockRevenueDashboard.last30Days.revenue}
            />
            <MetricCard label="Ad spend (30d)" value={mockRevenueDashboard.last30Days.adSpend} />
            <MetricCard label="Profit (30d)" value={mockRevenueDashboard.last30Days.profit} />
            <MetricCard
              label="New customers (30d)"
              value={mockRevenueDashboard.last30Days.newCustomers}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#17140f]">Daily revenue</h3>
            <div className="flex items-end gap-2" style={{ height: 120 }}>
              {mockRevenueDashboard.dailyRevenue.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-[4px] bg-[#ff5a1f]"
                    style={{
                      height: `${String((item.amount / maxDailyRevenue) * 100)}%`,
                      minHeight: 8,
                    }}
                  />
                  <span className="font-mono text-[10px] text-[rgba(23,20,15,0.4)]">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#17140f]">Revenue by source</h3>
            {mockRevenueDashboard.revenueBySource.map((item) => (
              <div key={item.source} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#17140f]">{item.source}</span>
                  <span className="font-mono text-sm font-medium text-[#17140f]">{item.amount}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(23,20,15,0.08)]">
                  <div
                    className="h-full rounded-full bg-[#3262d4]"
                    style={{ width: `${String(item.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <OnboardingFooter onBack={onBack} onContinue={onBack} continueLabel="Done" />
    </OnboardingCard>
  );
}
