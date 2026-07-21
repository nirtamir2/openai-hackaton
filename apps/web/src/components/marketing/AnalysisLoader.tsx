import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { Check, Globe2, Loader2, Radar, Search, Sparkles } from "lucide-react";

const analysisSteps = [
  { icon: Globe2, label: "Reading the website", threshold: 8 },
  { icon: Radar, label: "Understanding the company", threshold: 28 },
  { icon: Search, label: "Finding competitors and channels", threshold: 52 },
  { icon: Sparkles, label: "Preparing your report", threshold: 76 },
] as const;

interface Props {
  compact: boolean;
}

export function AnalysisLoader({ compact }: Props) {
  const [progress, setProgress] = useState(compact ? 74 : 6);
  const activeStepIndex = useMemo(
    () => getActiveStepIndex({ progress }),
    [progress]
  );

  useEffect(() => {
    const intervalId = globalThis.setInterval(
      () => {
        setProgress((currentProgress) => {
          if (currentProgress >= 94) {
            return currentProgress;
          }

          const increment = currentProgress < 72 ? 1.7 : 0.45;
          return Math.min(94, currentProgress + increment);
        });
      },
      compact ? 180 : 420
    );

    return () => {
      globalThis.clearInterval(intervalId);
    };
  }, [compact]);

  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className={clsx(
        "mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-8 text-center",
        compact ? "py-16" : "min-h-[68vh] py-12"
      )}
    >
      <div
        className="relative grid size-24 place-items-center"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-2 animate-[spin_9s_linear_infinite] rounded-full border border-dashed border-primary/35" />
        <div className="grid size-14 place-items-center rounded-full border bg-card shadow-lg">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      </div>

      <div className="flex max-w-xl flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Market intelligence in progress
        </p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Turning public signals into a clear brief
        </h2>
        <p className="text-sm/6 text-muted-foreground">
          We’re reading the company, market, communities, and search landscape.
          This usually takes less than a minute.
        </p>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="h-3 overflow-hidden rounded-full border bg-muted">
            <div
              className="relative h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress.toFixed(2)}%` }}
            >
              <span className="absolute inset-0 animate-[loader-shine_1.4s_linear_infinite] bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.42)_35%,transparent_70%)]" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(progress)}%</span>
            <span>Analyzing live public signals</span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {analysisSteps.map((step, index) => (
            <div
              key={step.label}
              className={stepClassName({
                isActive: index === activeStepIndex,
                isComplete: index < activeStepIndex,
              })}
            >
              <span
                className={stepIconClassName({
                  isActive: index === activeStepIndex,
                  isComplete: index < activeStepIndex,
                })}
              >
                {index < activeStepIndex ? (
                  <Check className="size-3.5" />
                ) : (
                  <step.icon
                    className={clsx(
                      "size-3.5",
                      index === activeStepIndex ? "animate-pulse" : null
                    )}
                  />
                )}
              </span>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getActiveStepIndex({ progress }: { progress: number }) {
  const activeStepIndex = analysisSteps.findLastIndex(
    (step) => progress >= step.threshold
  );
  return Math.max(0, activeStepIndex);
}

function stepClassName({
  isActive,
  isComplete,
}: {
  isActive: boolean;
  isComplete: boolean;
}) {
  return clsx(
    "flex min-h-20 items-center gap-2 rounded-lg border bg-card p-3 text-start shadow-xs transition-colors duration-300",
    isActive ? "border-primary/45 bg-primary/5" : null,
    isComplete ? "border-primary/20 text-muted-foreground" : null
  );
}

function stepIconClassName({
  isActive,
  isComplete,
}: {
  isActive: boolean;
  isComplete: boolean;
}) {
  return clsx(
    "grid size-7 shrink-0 place-items-center rounded-md transition-colors duration-300",
    isActive ? "bg-primary text-primary-foreground" : null,
    isComplete ? "bg-primary/10 text-primary" : null,
    !isActive && !isComplete ? "bg-muted text-muted-foreground" : null
  );
}
