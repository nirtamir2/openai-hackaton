import type { SyntheticEvent } from "react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Loader2, Plus, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/Textarea";
import type { client } from "@/utils/orpc";

type Profile = Awaited<ReturnType<typeof client.productProfile.analyze>>;

interface Props {
  errorMessage: string | null;
  isSaving: boolean;
  profile: Profile;
  onChange: (profile: Profile) => void;
  onSave: () => void;
  onStartOver: () => void;
}

export function ProductProfileEditor({
  errorMessage,
  isSaving,
  profile,
  onChange,
  onSave,
  onStartOver,
}: Props) {
  const [featureFields, setFeatureFields] = useState(() =>
    profile.keyFeatures.map((value) => ({ id: globalThis.crypto.randomUUID(), value })),
  );

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  function updateFeature({ id, value }: { id: string; value: string }) {
    const nextFeatureFields = featureFields.map((field) =>
      field.id === id ? { ...field, value } : field,
    );
    setFeatureFields(nextFeatureFields);
    onChange({
      ...profile,
      keyFeatures: nextFeatureFields.map((field) => field.value),
    });
  }

  function removeFeature({ id }: { id: string }) {
    if (featureFields.length === 1) {
      return;
    }

    const nextFeatureFields = featureFields.filter((field) => field.id !== id);
    setFeatureFields(nextFeatureFields);
    onChange({
      ...profile,
      keyFeatures: nextFeatureFields.map((field) => field.value),
    });
  }

  return (
    <form className="min-w-0" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl tracking-tight sm:text-3xl">Here’s what we found.</h2>
          </CardTitle>
          <CardDescription>
            This is a first draft. Correct anything that does not sound like your product.
          </CardDescription>
          <CardAction>
            <Badge variant="outline">AI draft</Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product name" htmlFor="product-name">
              <Input
                id="product-name"
                value={profile.name}
                onChange={(event) => {
                  onChange({ ...profile, name: event.target.value });
                }}
                required
                maxLength={120}
              />
            </Field>

            <Field label="Category" htmlFor="product-category">
              <Input
                id="product-category"
                value={profile.category}
                onChange={(event) => {
                  onChange({ ...profile, category: event.target.value });
                }}
                required
                maxLength={120}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="What it does" htmlFor="product-description">
                <Textarea
                  id="product-description"
                  value={profile.description}
                  onChange={(event) => {
                    onChange({ ...profile, description: event.target.value });
                  }}
                  required
                  maxLength={600}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Primary audience" htmlFor="product-audience">
                <Input
                  id="product-audience"
                  value={profile.targetAudience}
                  onChange={(event) => {
                    onChange({ ...profile, targetAudience: event.target.value });
                  }}
                  required
                  maxLength={240}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field
                label="Key capabilities"
                htmlFor={`product-feature-${featureFields.at(0)?.id ?? "first"}`}
              >
                <div className="flex flex-col gap-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {featureFields.map((field) => (
                      <div key={field.id} className="flex min-w-0 items-center gap-2">
                        <Input
                          id={`product-feature-${field.id}`}
                          value={field.value}
                          onChange={(event) => {
                            updateFeature({ id: field.id, value: event.target.value });
                          }}
                          required
                          maxLength={100}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Remove ${field.value}`}
                          disabled={featureFields.length === 1}
                          onClick={() => {
                            removeFeature({ id: field.id });
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {featureFields.length < 8 ? (
                    <div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFeatureFields([
                            ...featureFields,
                            { id: globalThis.crypto.randomUUID(), value: "" },
                          ]);
                          onChange({ ...profile, keyFeatures: [...profile.keyFeatures, ""] });
                        }}
                      >
                        <Plus />
                        Add capability
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Field>
            </div>

            <div className="flex flex-col gap-3 md:col-span-2">
              <p className="text-sm font-medium">Sources reviewed</p>
              <div className="flex flex-wrap gap-2">
                {profile.sourceUrls.map((sourceUrl) => (
                  <Badge
                    key={sourceUrl}
                    variant="outline"
                    render={
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open source ${new URL(sourceUrl).hostname}`}
                      />
                    }
                  >
                    {new URL(sourceUrl).hostname}
                    <ExternalLink data-icon="inline-end" />
                  </Badge>
                ))}
              </div>
            </div>

            {errorMessage == null ? null : (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive md:col-span-2"
              >
                {errorMessage}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={onStartOver} disabled={isSaving}>
              <ArrowLeft />
              Analyze another site
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              Save product profile
              {isSaving ? null : <ArrowRight />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
