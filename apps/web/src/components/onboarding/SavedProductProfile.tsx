import { ArrowRight, ExternalLink, Globe2 } from "lucide-react";
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
import type { client } from "@/utils/orpc";

type ProductProfile = NonNullable<Awaited<ReturnType<typeof client.productProfile.get>>>;

interface Props {
  profile: ProductProfile;
  onStartOver: () => void;
}

export function SavedProductProfile({ profile, onStartOver }: Props) {
  const supportingSources = profile.sourceUrls.filter(
    (sourceUrl) => sourceUrl !== profile.websiteUrl,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl tracking-tight sm:text-3xl">{profile.name}</h2>
        </CardTitle>
        <CardDescription>{profile.description}</CardDescription>
        <CardAction>
          <Badge variant="secondary">Saved</Badge>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-7">
          <dl className="grid gap-3 md:grid-cols-2">
            <ProfileFact label="Category" value={profile.category} />
            <ProfileFact label="Primary audience" value={profile.targetAudience} />
          </dl>

          <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Key capabilities</h3>
              <ul className="flex flex-wrap gap-2">
                {profile.keyFeatures.map((feature) => (
                  <li key={feature}>
                    <Badge variant="secondary">{feature}</Badge>
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Research trail</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  fullWidth
                  render={
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${new URL(profile.websiteUrl).hostname}`}
                    />
                  }
                >
                  <Globe2 />
                  <span className="min-w-0 flex-1 truncate text-start">
                    {new URL(profile.websiteUrl).hostname}
                  </span>
                  <ExternalLink />
                </Button>
                {supportingSources.map((sourceUrl) => (
                  <Button
                    key={sourceUrl}
                    variant="outline"
                    fullWidth
                    render={
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open source ${new URL(sourceUrl).hostname}`}
                      />
                    }
                  >
                    <span className="min-w-0 flex-1 truncate text-start">
                      {new URL(sourceUrl).hostname}
                    </span>
                    <ExternalLink />
                  </Button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Last updated {profile.updatedAt.toLocaleDateString()}
          </p>
          <Button type="button" onClick={onStartOver}>
            Analyze another site
            <ArrowRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function ProfileFact({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>
          <dt>{label}</dt>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dd className="font-medium">{value}</dd>
      </CardContent>
    </Card>
  );
}
