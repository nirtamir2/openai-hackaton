import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AiGeneratedBadge } from "@/components/onboarding/AiGeneratedBadge";
import { OnboardingCard, OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import type { OnboardingWebsiteData } from "@/components/onboarding/onboardingTypes";
import { SignalButton } from "@/components/home/SignalButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { client } from "@/utils/orpc";

interface Props {
  data: OnboardingWebsiteData;
  onChange: (data: OnboardingWebsiteData) => void;
  onContinue: () => void;
}

interface AiFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled: boolean;
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

function hasGeneratedWebsiteFields(data: OnboardingWebsiteData) {
  return (
    data.companyDescription.length > 0 ||
    data.keyDifferentiators.length > 0 ||
    data.competitors.length > 0 ||
    data.subreddits.length > 0 ||
    data.searchKeywordsX.length > 0 ||
    data.searchKeywordsGoogle.length > 0 ||
    data.searchKeywordsSeo.length > 0
  );
}

export function WebsiteInputStep({ data, onChange, onContinue }: Props) {
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
        subreddits: analysis.subreddits,
        searchKeywordsX: analysis.searchKeywordsX,
        searchKeywordsGoogle: analysis.searchKeywordsGoogle,
        searchKeywordsSeo: analysis.searchKeywordsSeo,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isAnalyzing = analyzeMutation.isPending;
  const hasGeneratedFields = hasGeneratedWebsiteFields(data);
  const canAnalyze = data.url.trim().length > 0 && !isAnalyzing;
  const canContinue = data.url.trim().length > 0 && hasGeneratedFields && !isAnalyzing;

  function handleAnalyze() {
    if (!canAnalyze) {
      return;
    }

    analyzeMutation.mutate({ url: data.url.trim() });
  }

  return (
    <OnboardingCard>
      <OnboardingStepHeader
        stepNumber={1}
        totalSteps={7}
        title="Tell us about your website"
        subtitle="Paste your URL and I'll draft the fields below — edit anything before we continue."
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="website-url" className="text-sm font-medium text-[#17140f]">
              Website URL
            </label>
            <Input
              id="website-url"
              value={data.url}
              disabled={isAnalyzing}
              onChange={(event) => {
                onChange({ ...data, url: event.target.value });
              }}
              placeholder="yourcompany.com"
            />
          </div>
          <SignalButton variant="primary" onClick={handleAnalyze} disabled={!canAnalyze}>
            {isAnalyzing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {hasGeneratedFields ? "Regenerate" : "Analyze"}
          </SignalButton>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center gap-2 rounded-[12px] bg-[#f7f5f1] px-4 py-3 text-sm text-[rgba(23,20,15,0.7)]">
            <Loader2 className="size-4 animate-spin" />
            Analyzing your website and drafting onboarding fields...
          </div>
        ) : null}

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

      <OnboardingFooter onBack={null} onContinue={onContinue} isContinueDisabled={!canContinue} />
    </OnboardingCard>
  );
}
