import { ArrowRight, CheckCircle2, ExternalLink, Search, Sparkles, UsersRound } from "lucide-react";
import type { CompanyAnalysis } from "@app-template/api/schemas/companyAnalysis";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Props {
  analysis: CompanyAnalysis;
  onApprove: () => void;
  onStartOver: () => void;
}

export function CompanyReport({ analysis, onApprove, onStartOver }: Props) {
  const keywordGroups = [
    { label: "X conversations", items: analysis.xSearchKeywords },
    { label: "Google Ads", items: analysis.googleAdsKeywords },
    { label: "SEO opportunities", items: analysis.seoKeywords },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-4 sm:py-8">
      <section className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-3xl flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              <CheckCircle2 /> Analysis complete
            </Badge>
            <span className="text-xs text-muted-foreground">Review before we personalize</span>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {analysis.companyName} market brief
            </h2>
            <a
              href={analysis.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {new URL(analysis.website).hostname}
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onStartOver}>
            Analyze another site
          </Button>
          <Button onClick={onApprove}>
            Approve & personalize
            <ArrowRight />
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>What the company does</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-base/7 text-muted-foreground">{analysis.companySummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Key differentiators</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3">
              {analysis.keyDifferentiators.map((item, index) => (
                <li key={item} className="flex items-start gap-3 rounded-lg bg-muted/55 p-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm/6">{item}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competitive set</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {analysis.competitors.map((competitor) => (
                <a
                  key={competitor.website}
                  href={competitor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{competitor.name}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {new URL(competitor.website).hostname}
                    <ExternalLink className="size-3" />
                  </span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Relevant communities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.relevantSubreddits.map((subreddit) => (
                <Badge key={subreddit} variant="outline">
                  <UsersRound /> r/{subreddit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 md:grid-cols-3">
              {keywordGroups.map((group) => (
                <div key={group.label} className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <Search className="size-3.5" /> {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((keyword) => (
                      <Badge key={keyword} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-muted/40 p-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">Does this capture the business?</h3>
            <p className="text-sm text-muted-foreground">
              Approve the brief to unlock two tailored onboarding questions.
            </p>
          </div>
        </div>
        <Button onClick={onApprove}>
          Looks right
          <ArrowRight />
        </Button>
      </section>
    </div>
  );
}
