import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SignalButton } from "@/components/home/SignalButton";

interface Props {
  onBack: (() => void) | null;
  onContinue: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
}

export function OnboardingFooter({
  onBack,
  onContinue,
  continueLabel = "Continue",
  isContinueDisabled = false,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(23,20,15,0.1)] pt-6">
      {onBack == null ? (
        <div />
      ) : (
        <SignalButton variant="tertiary" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </SignalButton>
      )}

      <SignalButton variant="primary" onClick={onContinue} disabled={isContinueDisabled}>
        {continueLabel}
        <ArrowRight className="size-4" />
      </SignalButton>
    </div>
  );
}

export function OnboardingCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex flex-col gap-8 rounded-[16px] border border-[rgba(23,20,15,0.1)] bg-white p-6 shadow-[0_4px_24px_rgba(23,20,15,0.06)] sm:p-8"
    >
      {children}
    </div>
  );
}
