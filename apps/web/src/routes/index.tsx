import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { GlobalHeaderControls } from "@/components/layout/GlobalHeaderControls";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductOnboarding } from "@/components/onboarding/ProductOnboarding";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getUser } from "@/functions/getUser";
import { buildSeo } from "@/utils/buildSeo";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeo({
      title: "Product Atlas",
      description: "Turn a product website into a clear, editable product profile.",
      pathname: "/",
    }),
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: async ({ context }) => {
    if (context.session?.user == null) {
      return null;
    }

    return await context.queryClient.ensureQueryData(orpc.productProfile.get.queryOptions());
  },
  component: HomeComponent,
});

function HomeComponent() {
  const initialProfile = Route.useLoaderData();

  return <ProductOnboarding initialProfile={initialProfile} />;
}

function PublicLanding() {
  return (
    <PageLayout headerControls={<GlobalHeaderControls />}>
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center gap-10 py-8">
        <section className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex max-w-3xl flex-col gap-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Sparkles className="size-4" />
              Product intelligence, from one URL
            </p>
            <h1 className="text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Understand any product’s public footprint.
            </h1>
            <p className="max-w-2xl text-base/7 text-muted-foreground sm:text-lg">
              Product Atlas researches a website, identifies what the product does, and creates an
              editable profile backed by public sources.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/auth/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button size="lg">
                Create account
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <LandingStep
            icon={<Search className="size-5" />}
            label="01 — Research"
            description="Search the website and corroborating public sources."
          />
          <LandingStep
            icon={<Sparkles className="size-5" />}
            label="02 — Review"
            description="Correct the AI draft before anything is saved."
          />
          <LandingStep
            icon={<ArrowRight className="size-5" />}
            label="03 — Use"
            description="Keep one clear product profile in your workspace."
          />
        </section>
      </div>
    </PageLayout>
  );
}

function LandingStep({
  description,
  icon,
  label,
}: {
  description: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="text-muted-foreground">{icon}</div>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
