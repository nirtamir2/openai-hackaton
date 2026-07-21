import { clsx } from "clsx";
import { Check, Globe2, Radar, Search, Sparkles } from "lucide-react";

const analysisSteps = [
  { icon: Globe2, label: "Reading the website" },
  { icon: Radar, label: "Mapping the market" },
  { icon: Search, label: "Finding audience signals" },
  { icon: Sparkles, label: "Building your report" },
] as const;

interface Props {
  compact: boolean;
}

export function AnalysisLoader({ compact }: Props) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className={clsx(
        "mx-auto flex w-full max-w-3xl flex-col items-center justify-center gap-8 text-center",
        compact ? "py-16" : "min-h-[68vh] py-12",
      )}
    >
      <div className="relative grid size-32 place-items-center" aria-hidden="true">
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-primary/30" />
        <div className="absolute inset-4 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-primary/15" />
        <span className="absolute top-0 size-3 rounded-full bg-primary shadow-[0_0_20px_rgba(0,0,0,0.28)]" />
        <span className="absolute right-3 bottom-5 size-2 rounded-full bg-muted-foreground" />
        <div className="grid size-16 place-items-center rounded-full border bg-card shadow-lg">
          <Radar className="size-7 animate-pulse text-primary" />
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
          We’re reading the company, market, communities, and search landscape. This usually takes
          less than a minute.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-4">
        {analysisSteps.map((step, index) => (
          <div
            key={step.label}
            className="flex items-center gap-2 rounded-lg border bg-card p-3 text-start shadow-xs"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted">
              {index === 0 ? (
                <Check className="size-3.5 text-primary" />
              ) : (
                <step.icon className="size-3.5 text-muted-foreground" />
              )}
            </span>
            <span className="text-xs font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
