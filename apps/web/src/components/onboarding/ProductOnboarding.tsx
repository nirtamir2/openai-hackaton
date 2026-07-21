import type { ReactNode, SyntheticEvent } from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Globe2, Search, Sparkles } from "lucide-react";
import { GlobalHeaderControls } from "@/components/layout/GlobalHeaderControls";
import { ProductProfileEditor } from "@/components/onboarding/ProductProfileEditor";
import { ProductResearchMap } from "@/components/onboarding/ProductResearchMap";
import { SavedProductProfile } from "@/components/onboarding/SavedProductProfile";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type { client } from "@/utils/orpc";
import { orpc } from "@/utils/orpc";

type ProductProfile = NonNullable<Awaited<ReturnType<typeof client.productProfile.get>>>;
type ProductProfileDraft = Awaited<ReturnType<typeof client.productProfile.analyze>>;

interface Props {
  initialProfile: ProductProfile | null;
}

export function ProductOnboarding({ initialProfile }: Props) {
  const queryClient = useQueryClient();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [draft, setDraft] = useState<ProductProfileDraft | null>(null);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [isCreatingProfile, setIsCreatingProfile] = useState(initialProfile == null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const analyzeMutation = useMutation(
    orpc.productProfile.analyze.mutationOptions({
      onSuccess: (profile) => {
        setDraft(profile);
        setInputError(null);
      },
    }),
  );

  const saveMutation = useMutation(
    orpc.productProfile.save.mutationOptions({
      onSuccess: (profile) => {
        setSavedProfile(profile);
        setDraft(null);
        setSaveError(null);
        setIsCreatingProfile(false);
        queryClient.setQueryData(orpc.productProfile.get.queryKey(), profile);
      },
    }),
  );

  function handleAnalyze(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedWebsiteUrl = websiteUrl.trim();

    if (trimmedWebsiteUrl.length === 0) {
      setInputError("Enter your product website to continue.");
      return;
    }

    setInputError(null);
    analyzeMutation.mutate({ websiteUrl: trimmedWebsiteUrl });
  }

  function handleSave() {
    if (draft == null) {
      return;
    }

    setSaveError(null);
    saveMutation.mutate(draft, {
      onError: () => {
        setSaveError("Your edits are still here. Try saving the profile again.");
      },
    });
  }

  function handleStartOver() {
    setWebsiteUrl("");
    setDraft(null);
    setInputError(null);
    setSaveError(null);
    setIsCreatingProfile(true);
    analyzeMutation.reset();
    saveMutation.reset();
  }

  function handleReturnToSavedProfile() {
    setDraft(null);
    setInputError(null);
    setIsCreatingProfile(false);
    analyzeMutation.reset();
  }

  let workspace: ReactNode = null;

  if (analyzeMutation.isPending) {
    workspace = <AnalyzingView websiteUrl={websiteUrl} />;
  } else if (draft != null) {
    workspace = (
      <WorkspaceWithSteps activeStep="review">
        <ProductProfileEditor
          errorMessage={saveError}
          isSaving={saveMutation.isPending}
          profile={draft}
          onChange={setDraft}
          onSave={handleSave}
          onStartOver={handleStartOver}
        />
      </WorkspaceWithSteps>
    );
  } else if (savedProfile != null && !isCreatingProfile) {
    workspace = (
      <WorkspaceWithSteps activeStep="complete">
        <SavedProductProfile profile={savedProfile} onStartOver={handleStartOver} />
      </WorkspaceWithSteps>
    );
  } else {
    workspace = (
      <StartView
        errorMessage={inputError ?? analyzeMutation.error?.message ?? null}
        hasSavedProfile={savedProfile != null}
        websiteUrl={websiteUrl}
        onAnalyze={handleAnalyze}
        onReturnToSavedProfile={handleReturnToSavedProfile}
        onWebsiteUrlChange={(value) => {
          setWebsiteUrl(value);
          setInputError(null);
          analyzeMutation.reset();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <header className="border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Button variant="link" render={<a href="/" aria-label="Product Atlas home" />}>
            Product Atlas
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <GlobalHeaderControls />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col px-3 py-5 sm:px-6 sm:py-8">
        {workspace}
      </main>
    </div>
  );
}

function StartView({
  errorMessage,
  hasSavedProfile,
  websiteUrl,
  onAnalyze,
  onReturnToSavedProfile,
  onWebsiteUrlChange,
}: {
  errorMessage: string | null;
  hasSavedProfile: boolean;
  websiteUrl: string;
  onAnalyze: (event: SyntheticEvent<HTMLFormElement>) => void;
  onReturnToSavedProfile: () => void;
  onWebsiteUrlChange: (value: string) => void;
}) {
  return (
    <section className="grid min-h-[min(680px,calc(100vh-8rem))] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="max-w-2xl text-4xl/tight tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Start with the source.
            </h1>
          </CardTitle>
          <CardDescription>
            Add your website. We’ll research its public footprint and prepare an editable product
            profile.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">Step 1 of 2</Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form className="flex max-w-2xl flex-col gap-4" onSubmit={onAnalyze} noValidate>
            <Field
              label="Product website"
              htmlFor="website-url"
              error={errorMessage ?? undefined}
              helperText={
                errorMessage == null
                  ? "We’ll review your site and corroborating public sources."
                  : undefined
              }
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="website-url"
                  name="websiteUrl"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="yourproduct.com"
                  value={websiteUrl}
                  onChange={(event) => {
                    onWebsiteUrlChange(event.target.value);
                  }}
                  aria-invalid={errorMessage == null ? undefined : true}
                />
                <Button type="submit">
                  Build profile
                  <ArrowRight />
                </Button>
              </div>
            </Field>

            {hasSavedProfile ? (
              <div>
                <Button type="button" variant="ghost" size="sm" onClick={onReturnToSavedProfile}>
                  <ArrowLeft />
                  Back to saved profile
                </Button>
              </div>
            ) : null}
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">Website</Badge>
            <ArrowRight className="size-3" />
            <Badge variant="secondary">Search</Badge>
            <ArrowRight className="size-3" />
            <Badge variant="secondary">Product profile</Badge>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research map</CardTitle>
          <CardDescription>
            One URL becomes a structured view of your product, audience, and capabilities.
          </CardDescription>
          <CardAction>
            <Search className="size-4 text-muted-foreground" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid min-h-80 place-items-center rounded-lg bg-muted/60 p-6">
            <ProductResearchMap isActive={false} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function AnalyzingView({ websiteUrl }: { websiteUrl: string }) {
  let hostname = websiteUrl;

  try {
    ({ hostname } = new URL(websiteUrl.includes("://") ? websiteUrl : `https://${websiteUrl}`));
  } catch {
    hostname = websiteUrl;
  }

  const progressItems = [
    { label: "Reading the submitted domain", icon: <Globe2 />, width: "34%" },
    { label: "Cross-checking public sources", icon: <Search />, width: "54%" },
    { label: "Drafting structured fields", icon: <Sparkles />, width: "42%" },
  ];

  return (
    <section
      className="grid min-h-[min(680px,calc(100vh-8rem))] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)]"
      aria-live="polite"
      aria-busy="true"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-3xl tracking-tight text-balance sm:text-4xl">
              Building your product map.
            </h1>
          </CardTitle>
          <CardDescription>
            TanStack AI is using web search to identify the product and support the profile with
            public evidence.
          </CardDescription>
          <CardAction>
            <Badge variant="secondary">{hostname}</Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <ol className="flex flex-col gap-3">
            {progressItems.map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                <span className="grid size-8 shrink-0 place-items-center text-muted-foreground [&>svg]:size-4">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
                <Skeleton style={{ height: "0.25rem", width: item.width }} />
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research in progress</CardTitle>
          <CardDescription>Searching the web and organizing evidence.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid min-h-80 place-items-center rounded-lg bg-muted/60 p-6">
            <ProductResearchMap isActive />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function WorkspaceWithSteps({
  activeStep,
  children,
}: {
  activeStep: "review" | "complete";
  children: ReactNode;
}) {
  return (
    <section className="grid min-h-[min(720px,calc(100vh-8rem))] items-start gap-4 md:grid-cols-[11rem_minmax(0,1fr)]">
      <aside>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Product Atlas</CardTitle>
            <CardDescription>Workspace setup</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex gap-2 text-xs md:flex-col">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">
                  <Check data-icon="inline-start" />
                  Website
                </Badge>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant={activeStep === "complete" ? "secondary" : "default"}>
                  {activeStep === "complete" ? <Check data-icon="inline-start" /> : null}
                  {activeStep === "complete" ? "Saved" : "Review"}
                </Badge>
              </li>
            </ol>
          </CardContent>
        </Card>
      </aside>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
