import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Globe2, Loader2, Sparkles } from "lucide-react";
import { AnalysisLoader } from "@/components/marketing/AnalysisLoader";
import { CompanyReport } from "@/components/marketing/CompanyReport";
import { OnboardingQuestions } from "@/components/marketing/OnboardingQuestions";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { orpc } from "@/utils/orpc";

type Phase = "website" | "analyzing" | "report" | "preparing" | "onboarding";
const protocolPattern = /^https?:\/\//i;

export function MarketingWorkspace() {
  const [phase, setPhase] = useState<Phase>("website");
  const analysisMutation = useMutation(orpc.analyzeCompany.mutationOptions());
  const websiteForm = useForm({
    defaultValues: { website: "" },
    onSubmit: async ({ value }) => {
      setPhase("analyzing");
      try {
        await analysisMutation.mutateAsync({ website: normalizeWebsite(value.website) });
        setPhase("report");
      } catch {
        setPhase("website");
      }
    },
  });

  if (phase === "analyzing" || phase === "preparing") {
    return <AnalysisLoader compact={phase === "preparing"} />;
  }

  if (phase === "report" && analysisMutation.data != null) {
    return (
      <CompanyReport
        analysis={analysisMutation.data}
        onStartOver={() => {
          analysisMutation.reset();
          setPhase("website");
        }}
        onApprove={() => {
          setPhase("preparing");
          setTimeout(setPhase, 800, "onboarding");
        }}
      />
    );
  }

  if (phase === "onboarding" && analysisMutation.data != null) {
    return (
      <OnboardingQuestions
        companyName={analysisMutation.data.companyName}
        questions={analysisMutation.data.onboardingQuestions}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center gap-10 py-10 text-center">
      <div className="flex max-w-3xl flex-col items-center gap-5">
        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-xs">
          <Sparkles className="size-3.5" /> AI-powered market intelligence
        </div>
        <h2 className="text-4xl/tight font-semibold tracking-tight sm:text-6xl/tight">
          Your best marketing plan starts with understanding the business.
        </h2>
        <p className="max-w-2xl text-base/7 text-muted-foreground sm:text-lg/8">
          Share a company website. We’ll map its positioning, competitors, communities, and search
          opportunities before asking two focused questions.
        </p>
      </div>

      <form
        className="flex w-full max-w-2xl flex-col gap-3 rounded-xl border bg-card p-3 text-start shadow-lg sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void websiteForm.handleSubmit();
        }}
      >
        <websiteForm.Field
          name="website"
          validators={{
            onSubmit: ({ value }) =>
              isWebsite(value) ? null : "Enter a valid company website, like acme.com",
          }}
        >
          {(field) => (
            <Field
              label="Company website"
              htmlFor={field.name}
              error={field.state.meta.errors.map(String).join(", ")}
            >
              <div className="relative">
                <Globe2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  placeholder="yourcompany.com"
                  autoComplete="url"
                  inputMode="url"
                  aria-invalid={field.state.meta.errors.length > 0}
                  leadingIcon
                />
              </div>
            </Field>
          )}
        </websiteForm.Field>
        <websiteForm.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting ? "Analyzing" : "Analyze company"}
              {isSubmitting ? null : <ArrowRight />}
            </Button>
          )}
        </websiteForm.Subscribe>
      </form>

      {analysisMutation.error == null ? null : (
        <p role="alert" className="text-sm text-destructive">
          {analysisMutation.error.message}
        </p>
      )}

      <div className="grid w-full gap-px overflow-hidden rounded-xl border bg-border text-start sm:grid-cols-3">
        {[
          ["01", "Analyze", "Company, positioning, and competitive landscape"],
          ["02", "Review", "A transparent brief you approve before continuing"],
          ["03", "Personalize", "Two tailored questions, then your custom plan"],
        ].map(([number, title, description]) => (
          <div key={number} className="flex flex-col gap-2 bg-card p-4">
            <span className="font-mono text-xs text-muted-foreground">{number}</span>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm/6 text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function normalizeWebsite(value: string) {
  const trimmedValue = value.trim();
  return protocolPattern.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
}

function isWebsite(value: string) {
  try {
    const url = new URL(normalizeWebsite(value));
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}
