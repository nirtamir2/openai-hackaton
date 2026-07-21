import clsx from "clsx";
import { Check } from "lucide-react";
import { onboardingSteps } from "@/components/onboarding/onboardingSteps";
import type { OnboardingStepId } from "@/components/onboarding/onboardingTypes";

interface Props {
  currentStepId: OnboardingStepId;
}

export function OnboardingStepper({ currentStepId }: Props) {
  const currentIndex = onboardingSteps.findIndex((step) => step.id === currentStepId);

  return (
    <nav
      aria-label="Onboarding progress"
      className="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
    >
      {onboardingSteps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === onboardingSteps.length - 1;

        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <div
              className={clsx(
                "flex items-center gap-2 rounded-full px-2 py-1.5 sm:px-3",
                isActive && "bg-[#fff0e8]",
              )}
            >
              <span
                className={clsx(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted && "bg-[#2f6f4e] text-white",
                  isActive && !isCompleted && "bg-[#ff5a1f] text-white",
                  !isCompleted && !isActive && "bg-[rgba(23,20,15,0.08)] text-[rgba(23,20,15,0.4)]",
                )}
              >
                {isCompleted ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
              </span>
              <span
                className={clsx(
                  "hidden text-xs font-medium sm:inline",
                  isActive && "text-[#17140f]",
                  isCompleted && "text-[rgba(23,20,15,0.45)]",
                  !isActive && !isCompleted && "text-[rgba(23,20,15,0.35)]",
                )}
              >
                {step.label}
              </span>
            </div>

            {isLast ? null : (
              <span className="text-[rgba(23,20,15,0.2)]" aria-hidden="true">
                →
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
