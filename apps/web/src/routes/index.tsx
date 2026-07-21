import { createFileRoute } from "@tanstack/react-router";
import { GlobalHeaderControls } from "@/components/layout/GlobalHeaderControls";
import { PageLayout } from "@/components/layout/PageLayout";
import { MarketingWorkspace } from "@/components/marketing/MarketingWorkspace";
import { getUser } from "@/functions/getUser";
import { buildSeo } from "@/utils/buildSeo";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeo({
      title: "Market brief · AI marketing research",
      description: "Turn any company website into a focused market intelligence brief.",
      pathname: "/",
    }),
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <PageLayout
      title="Market brief"
      subtitle="Research before recommendations"
      headerControls={<GlobalHeaderControls />}
    >
      <MarketingWorkspace />
    </PageLayout>
  );
}
