import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Globe, Pencil, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";
import { AiGeneratedBadge } from "@/components/onboarding/AiGeneratedBadge";
import { OnboardingCard } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { WebsiteAnalysisProgress } from "@/components/onboarding/WebsiteAnalysisProgress";
import type { OnboardingWebsiteData } from "@/components/onboarding/onboardingTypes";
import type { SignalAccent } from "@/components/home/signalTheme";
import { SignalButton } from "@/components/home/SignalButton";
import { SignalTag } from "@/components/home/SignalTag";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { client } from "@/utils/orpc";

interface Props {
  data: OnboardingWebsiteData;
  onChange: (data: OnboardingWebsiteData) => void;
  onAnalysisComplete: (analysis: Awaited<ReturnType<typeof client.onboarding.analyzeWebsite>>) => void;
  onContinue: () => void;
}

type WebsiteStepPhase = "url" | "review" | "edit";

interface AiFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled: boolean;
}

interface ResultFieldProps {
  label: string;
  value: string;
  format?: "text" | "tags" | "bullets";
  tagAccent?: SignalAccent;
}

function parseListItems(value: string) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function AiGeneratedField({ id, label, value, onChange, rows = 3, disabled }: AiFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="text-sm font-medium text-[#17140f]">
          {label}
        </label>
        <AiGeneratedBadge />
      </div>
      <Textarea
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        rows={rows}
      />
    </div>
  );
}

function ResultField({ label, value, format = "text", tagAccent = "info" }: ResultFieldProps) {
  const items = parseListItems(value);

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-[rgba(23,20,15,0.02)] px-4 py-3">
      <h3 className="font-mono text-[10px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
        {label}
      </h3>

      {value.length === 0 ? (
        <p className="text-sm/6 text-[#17140f]">—</p>
      ) : null}

      {format === "text" && value.length > 0 ? (
        <p className="text-sm/6 whitespace-pre-wrap text-[#17140f]">{value}</p>
      ) : null}

      {format === "bullets" && items.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm/6 text-[#17140f]">
              <span className="text-[rgba(23,20,15,0.35)]">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {format === "tags" && items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <SignalTag key={item} label={item} accent={tagAccent} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function hasGeneratedWebsiteFields(data: OnboardingWebsiteData) {
  return (
    data.companyDescription.length > 0 ||
    data.keyDifferentiators.length > 0 ||
    data.competitors.length > 0 ||
    data.competitorWeaknesses.length > 0 ||
    data.subreddits.length > 0 ||
    data.searchKeywordsX.length > 0 ||
    data.searchKeywordsGoogle.length > 0 ||
    data.searchKeywordsSeo.length > 0
  );
}

function getInitialPhase(data: OnboardingWebsiteData): WebsiteStepPhase {
  return hasGeneratedWebsiteFields(data) ? "review" : "url";
}

export function WebsiteInputStep({ data, onChange, onAnalysisComplete, onContinue }: Props) {
  const [phase, setPhase] = useState<WebsiteStepPhase>(() => getInitialPhase(data));

  const analyzeMutation = useMutation({
    mutationFn: async (input: { url: string }) => {
      return await client.onboarding.analyzeWebsite(input);
    },
    onSuccess: (analysis) => {
      onChange({
        url: analysis.url,
        companyDescription: analysis.companyDescription,
        keyDifferentiators: analysis.keyDifferentiators,
        competitors: analysis.competitors,
        competitorWeaknesses: analysis.competitorWeaknesses,
        subreddits: analysis.subreddits,
        searchKeywordsX: analysis.searchKeywordsX,
        searchKeywordsGoogle: analysis.searchKeywordsGoogle,
        searchKeywordsSeo: analysis.searchKeywordsSeo,
      });
      onAnalysisComplete(analysis);
      setPhase("review");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isAnalyzing = analyzeMutation.isPending;
  const canAnalyze = data.url.trim().length > 0 && !isAnalyzing;

  function handleAnalyze() {
    if (!canAnalyze) {
      return;
    }

    analyzeMutation.mutate({ url: data.url.trim() });
  }

  function handleBackToUrl() {
    setPhase("url");
  }

  function handleEdit() {
    setPhase("edit");
  }

  function handleBackToReview() {
    setPhase("review");
  }

  if (phase === "url" && isAnalyzing) {
    return <WebsiteAnalysisProgress url={data.url} />;
  }

  if (phase === "url") {
    return (
      <OnboardingCard>
        <OnboardingStepHeader
          stepNumber={1}
          totalSteps={6}
          title="What's your website?"
          subtitle="Paste your URL and I'll analyze it to draft your growth profile."
        />

        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            handleAnalyze();
          }}
        >
          <div className="flex flex-col gap-3 rounded-[12px] border border-[rgba(23,20,15,0.1)] bg-[rgba(23,20,15,0.02)] p-5">
            <div className="flex items-center gap-2 text-[rgba(23,20,15,0.55)]">
              <Globe className="size-4 shrink-0" />
              <span className="text-sm font-medium">Website URL</span>
            </div>
            <Input
              id="website-url"
              value={data.url}
              onChange={(event) => {
                onChange({ ...data, url: event.target.value });
              }}
              placeholder="yourcompany.com"
            />
          </div>

          <div className="flex w-full sm:w-auto sm:self-start">
            <SignalButton type="submit" variant="primary" disabled={!canAnalyze}>
              <Sparkles className="size-4" />
              Analyze website
            </SignalButton>
          </div>
        </form>
      </OnboardingCard>
    );
  }

  if (phase === "review") {
    return (
      <OnboardingCard>
        <OnboardingStepHeader
          stepNumber={1}
          totalSteps={6}
          title="Review your profile"
          subtitle="I analyzed your website and drafted these fields. Accept to continue, or edit anything first."
          showAiBadge
        />

        <div className="flex flex-col gap-3">
          <ResultField label="Website" value={data.url} />
          <ResultField label="What the company does" value={data.companyDescription} />
          <ResultField label="Key differentiators" value={data.keyDifferentiators} format="bullets" />
          <ResultField label="Competitors" value={data.competitors} format="tags" tagAccent="accent" />
          <ResultField
            label="Competitor weaknesses"
            value={data.competitorWeaknesses}
            format="bullets"
          />
          <ResultField label="Relevant subreddits" value={data.subreddits} format="tags" tagAccent="reddit" />
          <ResultField label="Search keywords (X)" value={data.searchKeywordsX} format="tags" tagAccent="info" />
          <ResultField
            label="Search keywords (Paid Google)"
            value={data.searchKeywordsGoogle}
            format="tags"
            tagAccent="idea"
          />
          <ResultField label="Search keywords (SEO)" value={data.searchKeywordsSeo} format="tags" tagAccent="success" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(23,20,15,0.1)] pt-6">
          <SignalButton variant="tertiary" onClick={handleBackToUrl}>
            <ArrowLeft className="size-4" />
            Change URL
          </SignalButton>

          <div className="flex flex-wrap items-center gap-3">
            <SignalButton variant="secondary" onClick={handleEdit}>
              <Pencil className="size-4" />
              Edit
            </SignalButton>
            <SignalButton variant="primary" onClick={onContinue}>
              Accept & continue
              <ArrowRight className="size-4" />
            </SignalButton>
          </div>
        </div>
      </OnboardingCard>
    );
  }

  if (phase === "edit" && isAnalyzing) {
    return <WebsiteAnalysisProgress url={data.url} variant="regenerate" />;
  }

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={1}
        totalSteps={6}
        title="Edit your profile"
        subtitle="Update any field below, then accept when you're ready to continue."
        showAiBadge
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="website-url-edit" className="text-sm font-medium text-[#17140f]">
            Website URL
          </label>
          <form
            className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              handleAnalyze();
            }}
          >
            <Input
              id="website-url-edit"
              value={data.url}
              disabled={isAnalyzing}
              onChange={(event) => {
                onChange({ ...data, url: event.target.value });
              }}
              placeholder="yourcompany.com"
            />
            <SignalButton type="submit" variant="secondary" disabled={!canAnalyze}>
              <Sparkles className="size-4" />
              Regenerate
            </SignalButton>
          </form>
        </div>

        <div className={clsx("flex flex-col gap-6", isAnalyzing ? "pointer-events-none opacity-50" : null)}>
          <AiGeneratedField
            id="company-description"
            label="What the company does"
            value={data.companyDescription}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, companyDescription: value });
            }}
          />

          <AiGeneratedField
            id="key-differentiators"
            label="Key differentiators"
            value={data.keyDifferentiators}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, keyDifferentiators: value });
            }}
          />

          <AiGeneratedField
            id="competitors"
            label="Competitors"
            value={data.competitors}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, competitors: value });
            }}
            rows={2}
          />

          <AiGeneratedField
            id="competitor-weaknesses"
            label="Competitor weaknesses"
            value={data.competitorWeaknesses}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, competitorWeaknesses: value });
            }}
            rows={3}
          />

          <AiGeneratedField
            id="subreddits"
            label="Relevant subreddits"
            value={data.subreddits}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, subreddits: value });
            }}
            rows={2}
          />

          <AiGeneratedField
            id="search-keywords-x"
            label="Relevant search keywords (X)"
            value={data.searchKeywordsX}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, searchKeywordsX: value });
            }}
          />

          <AiGeneratedField
            id="search-keywords-google"
            label="Relevant search keywords (Paid Google)"
            value={data.searchKeywordsGoogle}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, searchKeywordsGoogle: value });
            }}
          />

          <AiGeneratedField
            id="search-keywords-seo"
            label="Relevant search keywords (SEO)"
            value={data.searchKeywordsSeo}
            disabled={isAnalyzing}
            onChange={(value) => {
              onChange({ ...data, searchKeywordsSeo: value });
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(23,20,15,0.1)] pt-6">
        <SignalButton variant="tertiary" onClick={handleBackToReview} disabled={isAnalyzing}>
          <ArrowLeft className="size-4" />
          Back to review
        </SignalButton>

        <SignalButton variant="primary" onClick={onContinue} disabled={isAnalyzing}>
          Accept & continue
          <ArrowRight className="size-4" />
        </SignalButton>
      </div>
    </OnboardingCard>
  );
}
