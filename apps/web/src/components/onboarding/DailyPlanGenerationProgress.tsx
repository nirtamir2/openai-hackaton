import clsx from "clsx";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  capacityOptions,
  channelOptions,
} from "@/components/onboarding/onboardingMockData";
import { OnboardingCard } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import type { OnboardingState } from "@/components/onboarding/onboardingTypes";
import { useGenerationEta } from "@/hooks/useGenerationEta";

interface Props {
  state: OnboardingState;
  canNavigate: boolean;
  onComplete: () => void;
}

const stepAdvanceMs = 650;
const completionDelayMs = 300;
const estimatedGenerationDurationMs = 45_000;

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function buildPlanSteps(state: OnboardingState) {
  const selectedChannels = channelOptions
    .filter((option) => state.channels.includes(option.id))
    .map((option) => option.title);

  const channelLabel =
    selectedChannels.length > 0 ? selectedChannels.slice(0, 3).join(", ") : "your channels";

  const capacityLabel =
    capacityOptions.find((option) => option.id === state.capacity)?.label ?? "your time budget";

  return [
    "Reading your growth profile",
    `Prioritizing ${channelLabel}`,
    `Calibrating to ${capacityLabel}`,
    "Preparing your feed",
  ] as const;
}

function buildPlanPreviews(state: OnboardingState) {
  const selectedChannels = channelOptions.filter((option) => state.channels.includes(option.id));
  const previews: Array<string> = [];

  if (selectedChannels.some((option) => option.id === "paid-ads-meta")) {
    previews.push("Drafting a Meta ad angle for today");
  }

  if (selectedChannels.some((option) => option.id === "organic-content-meta")) {
    previews.push("Planning an organic Meta post");
  }

  if (selectedChannels.some((option) => option.id === "replies-reddit")) {
    previews.push("Finding a Reddit thread to join");
  }

  if (selectedChannels.some((option) => option.id === "founder-stories-linkedin")) {
    previews.push("Outlining a LinkedIn founder update");
  }

  if (selectedChannels.some((option) => option.id === "founder-stories-x")) {
    previews.push("Shaping an X post for today");
  }

  if (selectedChannels.some((option) => option.id === "founder-stories-reddit")) {
    previews.push("Drafting a Reddit founder story");
  }

  if (previews.length === 0) {
    previews.push("Selecting your first growth move");
  }

  previews.push("Ranking tasks by expected impact");

  return previews.slice(0, 4);
}

export function DailyPlanGenerationProgress({ state, canNavigate, onComplete }: Props) {
  const planSteps = useMemo(() => buildPlanSteps(state), [state]);
  const planPreviews = useMemo(() => buildPlanPreviews(state), [state]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [visiblePreviewCount, setVisiblePreviewCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStepIndex((currentIndex) => {
        if (currentIndex >= planSteps.length - 1) {
          return currentIndex;
        }

        return currentIndex + 1;
      });
    }, stepAdvanceMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [planSteps.length]);

  useEffect(() => {
    const previewIntervalId = window.setInterval(() => {
      setVisiblePreviewCount((currentCount) => {
        if (currentCount >= planPreviews.length) {
          return currentCount;
        }

        return currentCount + 1;
      });
    }, 850);

    return () => {
      window.clearInterval(previewIntervalId);
    };
  }, [planPreviews.length]);

  useEffect(() => {
    if (activeStepIndex < planSteps.length - 1) {
      return;
    }

    const completeTimeoutId = window.setTimeout(() => {
      setIsComplete(true);
    }, completionDelayMs);

    return () => {
      window.clearTimeout(completeTimeoutId);
    };
  }, [activeStepIndex, planSteps.length]);

  useEffect(() => {
    if (!isComplete || !canNavigate) {
      return;
    }

    const navigateTimeoutId = window.setTimeout(() => {
      onComplete();
    }, 250);

    return () => {
      window.clearTimeout(navigateTimeoutId);
    };
  }, [isComplete, canNavigate, onComplete]);

  const progressPercent = isComplete
    ? 100
    : Math.min(96, Math.round(((activeStepIndex + 1) / planSteps.length) * 100));
  const generationEta = useGenerationEta({
    estimatedDurationMs: estimatedGenerationDurationMs,
    isComplete: canNavigate,
  });

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={6}
        totalSteps={6}
        title="Building your plan for today"
        subtitle="I'm turning your choices into a focused set of moves you can run right now."
      />

      <div className="relative overflow-hidden rounded-[16px] border border-[rgba(23,20,15,0.08)] bg-[linear-gradient(145deg,rgba(255,90,31,0.07)_0%,rgba(47,95,214,0.04)_38%,rgba(255,255,255,0.92)_100%)] px-6 py-8">
        <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[rgba(255,90,31,0.1)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-[rgba(47,95,214,0.08)] blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="relative flex size-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(255,90,31,0.14)]" />
            <span className="absolute inset-2 rounded-full bg-[rgba(255,90,31,0.08)]" />
            <span className="relative flex size-12 items-center justify-center rounded-full bg-[#17140f] text-white shadow-[0_8px_24px_rgba(23,20,15,0.18)]">
              <Sparkles className="size-5" />
            </span>
          </div>

          <div className="flex max-w-md flex-col gap-2">
            <p className="text-base font-medium tracking-[-0.2px] text-[#17140f]">
              Generating today&apos;s growth plan
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[rgba(23,20,15,0.55)]">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>{getTodayLabel()}</span>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.2px] text-[rgba(23,20,15,0.45)] uppercase">
              <span>Progress</span>
              <span>
                {canNavigate ? null : (
                  <span className="normal-case tracking-normal">
                    Est. {generationEta.label} left ·{" "}
                  </span>
                )}
                {progressPercent}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(23,20,15,0.08)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff5a1f_0%,#2f5fd6_55%,#17140f_100%)] transition-[width] duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-2.5">
            {planSteps.map((stepLabel, index) => {
              const isStepComplete = index < activeStepIndex || isComplete;
              const isActive = index === activeStepIndex && !isComplete;

              return (
                <div
                  key={stepLabel}
                  className={clsx(
                    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-[background-color,opacity] duration-500",
                    isActive ? "bg-white/80" : null,
                    !isStepComplete && !isActive ? "opacity-45" : null,
                  )}
                >
                  <span
                    className={clsx(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                      isStepComplete
                        ? "border-[#17140f] bg-[#17140f] text-white"
                        : isActive
                          ? "border-[#ff5a1f] bg-[#fff0e8]"
                          : "border-[rgba(23,20,15,0.15)] bg-transparent",
                    )}
                  >
                    {isStepComplete ? (
                      <Check className="size-3" strokeWidth={2.5} />
                    ) : isActive ? (
                      <span className="size-2 animate-pulse rounded-full bg-[#ff5a1f]" />
                    ) : null}
                  </span>

                  <span
                    className={clsx(
                      "text-sm transition-colors duration-500",
                      isActive || isStepComplete
                        ? "font-medium text-[#17140f]"
                        : "text-[rgba(23,20,15,0.65)]",
                    )}
                  >
                    {stepLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-[12px] border border-[rgba(23,20,15,0.08)] bg-white/70 p-4">
            <p className="font-mono text-[10px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
              Today&apos;s plan preview
            </p>

            <div className="flex flex-col gap-2.5">
              {planPreviews.map((preview, index) => {
                const isVisible = index < visiblePreviewCount || isComplete;

                return (
                  <div
                    key={preview}
                    className={clsx(
                      "rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[rgba(23,20,15,0.02)] px-3 py-2.5 transition-[opacity,transform] duration-500",
                      isVisible ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ff5a1f]" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-[#17140f]">{preview}</p>
                        <p className="text-xs text-[rgba(23,20,15,0.45)]">
                          {isComplete ? "Ready" : "Generating..."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </OnboardingCard>
  );
}
