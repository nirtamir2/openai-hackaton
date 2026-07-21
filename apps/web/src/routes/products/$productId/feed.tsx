import { createFileRoute } from "@tanstack/react-router";
import { GrowthAgentDashboard } from "@/components/growth-agent/GrowthAgentDashboard";
import { getCompanyNameFromUrl } from "@/components/growth-agent/growthAgentTypes";
import { getOnboardingCompanyName } from "@/components/onboarding/onboardingStorage";
import { buildSeo, withAppName } from "@/utils/buildSeo";

export const Route = createFileRoute("/products/$productId/feed")({
  head: () => {
    const seo = buildSeo({
      title: withAppName({ title: "Growth Feed" }),
      description: "Your weekly growth tasks and marketing feed.",
      pathname: "/products/$productId/feed",
      noIndex: true,
    });

    return {
      meta: [...seo.meta, { name: "theme-color", content: "#f7f5f1" }],
      links: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
        },
      ],
    };
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      context.orpc.feed.getFeed.queryOptions({
        input: { productId: params.productId },
      }),
    );
  },
  component: GrowthAgentFeedPage,
});

function GrowthAgentFeedPage() {
  const { productId } = Route.useParams();
  const storedCompanyName = getOnboardingCompanyName();
  const companyName =
    storedCompanyName.length > 0 ? storedCompanyName : getCompanyNameFromUrl({ url: "" });

  return (
    <GrowthAgentDashboard
      companyName={companyName}
      productId={productId}
    />
  );
}
