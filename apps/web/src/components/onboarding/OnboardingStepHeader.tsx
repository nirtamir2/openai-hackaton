import type { ReactNode } from "react";
import { AiGeneratedBadge } from "@/components/onboarding/AiGeneratedBadge";

interface Props {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  showAiBadge?: boolean;
  children?: ReactNode;
}

export function OnboardingStepHeader({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  showAiBadge = false,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-mono text-[11px] font-semibold tracking-[0.3px] text-[#ff5a1f] uppercase">
        Step {stepNumber} of {totalSteps}
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-[#17140f] sm:text-[26px]">
            {title}
          </h1>
          {showAiBadge ? <AiGeneratedBadge /> : null}
        </div>
        <p className="text-sm/6 text-[rgba(23,20,15,0.55)] sm:text-base">{subtitle}</p>
      </div>

      {children}
    </div>
  );
}
