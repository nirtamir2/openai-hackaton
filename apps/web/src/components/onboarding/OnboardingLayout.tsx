import type { ReactNode } from "react";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import type { OnboardingStepId } from "@/components/onboarding/onboardingTypes";

interface Props {
  currentStepId: OnboardingStepId;
  children: ReactNode;
}

export function OnboardingLayout({ currentStepId, children }: Props) {
  return (
    <div className="signal-home min-h-screen bg-[#f7f5f1] font-sans text-[#17140f]">
      <div className="mx-auto flex min-h-screen w-full max-w-[800px] flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12">
        <header className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-[8px] bg-[#ff5a1f] text-sm font-bold text-white">
              S
            </span>
            <span className="text-xl font-semibold tracking-[-0.3px]">Signal</span>
          </div>

          <OnboardingStepper currentStepId={currentStepId} />
        </header>

        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
