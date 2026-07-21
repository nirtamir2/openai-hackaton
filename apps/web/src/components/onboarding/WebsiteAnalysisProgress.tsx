import clsx from "clsx";
import { Check, Globe, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { OnboardingCard } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";

interface Props {
  url: string;
  variant?: "initial" | "regenerate";
}

const analysisSteps = [
  "Fetching your website",
  "Reading page content",
  "Understanding your positioning",
  "Drafting company profile",
  "Generating audience segments",
  "Building brand voice options",
] as const;

const stepAdvanceMs = 2_200;

export function WebsiteAnalysisProgress({ url, variant = "initial" }: Props) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStepIndex((currentIndex) => {
        if (currentIndex >= analysisSteps.length - 1) {
          return currentIndex;
        }

        return currentIndex + 1;
      });
    }, stepAdvanceMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const progressPercent = Math.min(
    94,
    Math.round(((activeStepIndex + 1) / analysisSteps.length) * 100),
  );

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={1}
        totalSteps={6}
        title={variant === "regenerate" ? "Regenerating your profile" : "Analyzing your website"}
        subtitle={
          variant === "regenerate"
            ? "Hang tight — I'm refreshing your profile from your website."
            : "I'm reading your site and building your growth profile. This usually takes a moment."
        }
      />

      <div className="relative overflow-hidden rounded-[16px] border border-[rgba(23,20,15,0.08)] bg-[linear-gradient(145deg,rgba(255,90,31,0.06)_0%,rgba(23,20,15,0.02)_45%,rgba(255,255,255,0.9)_100%)] px-6 py-8">
        <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[rgba(255,90,31,0.08)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-[rgba(23,20,15,0.04)] blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          <div className="relative flex size-16 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(255,90,31,0.15)]" />
            <span className="absolute inset-2 rounded-full bg-[rgba(255,90,31,0.08)]" />
            <span className="relative flex size-12 items-center justify-center rounded-full bg-[#17140f] text-white shadow-[0_8px_24px_rgba(23,20,15,0.18)]">
              <Sparkles className="size-5" />
            </span>
          </div>

          <div className="flex max-w-md flex-col gap-2">
            <p className="text-base font-medium tracking-[-0.2px] text-[#17140f]">
              Building your growth profile
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-[rgba(23,20,15,0.55)]">
              <Globe className="size-3.5 shrink-0" />
              <span className="truncate">{url}</span>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.2px] text-[rgba(23,20,15,0.45)] uppercase">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(23,20,15,0.08)]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#ff5a1f_0%,#17140f_100%)] transition-[width] duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-2.5">
          {analysisSteps.map((stepLabel, index) => {
            const isComplete = index < activeStepIndex;
            const isActive = index === activeStepIndex;

            return (
              <div
                key={stepLabel}
                className={clsx(
                  "flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-[background-color,opacity] duration-500",
                  isActive ? "bg-white/80" : null,
                  !isComplete && !isActive ? "opacity-45" : null,
                )}
              >
                <span
                  className={clsx(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                    isComplete
                      ? "border-[#17140f] bg-[#17140f] text-white"
                      : isActive
                        ? "border-[#ff5a1f] bg-[#fff0e8]"
                        : "border-[rgba(23,20,15,0.15)] bg-transparent",
                  )}
                >
                  {isComplete ? (
                    <Check className="size-3" strokeWidth={2.5} />
                  ) : isActive ? (
                    <span className="size-2 animate-pulse rounded-full bg-[#ff5a1f]" />
                  ) : null}
                </span>

                <span
                  className={clsx(
                    "text-sm transition-colors duration-500",
                    isActive ? "font-medium text-[#17140f]" : "text-[rgba(23,20,15,0.65)]",
                  )}
                >
                  {stepLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </OnboardingCard>
  );
}
