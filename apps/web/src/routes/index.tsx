import { createFileRoute } from "@tanstack/react-router";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { appName } from "@/utils/appName";
import { buildSeo } from "@/utils/buildSeo";

export const Route = createFileRoute("/")({
  head: () => {
    const seo = buildSeo({
      title: appName(),
      description: "Set up Signal — your AI marketing agent.",
      pathname: "/",
    });

    return {
      meta: [
        ...seo.meta,
        { name: "theme-color", content: "#f7f5f1" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
        },
      ],
    };
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  return <OnboardingWizard />;
}
