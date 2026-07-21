import { useState } from "react";
import { GrowthAgentFeed } from "@/components/growth-agent/GrowthAgentFeed";
import { GrowthAgentLayout, type GrowthAgentTab } from "@/components/growth-agent/GrowthAgentLayout";
import { GrowthAgentOverview } from "@/components/growth-agent/GrowthAgentOverview";
import { growthAgentFeedItems } from "@/components/growth-agent/growthAgentMockData";

interface Props {
  companyName: string;
}

export function GrowthAgentDashboard({ companyName }: Props) {
  const [activeTab, setActiveTab] = useState<GrowthAgentTab>("feed");
  const [openTaskCount, setOpenTaskCount] = useState(
    growthAgentFeedItems.filter((item) => item.defaultCompleted !== true).length,
  );

  return (
    <GrowthAgentLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      openTaskCount={openTaskCount}
      companyName={companyName}
    >
      {activeTab === "feed" ? (
        <GrowthAgentFeed
          onOpenCountChange={(count) => {
            setOpenTaskCount(count);
          }}
        />
      ) : null}
      {activeTab === "overview" ? <GrowthAgentOverview /> : null}
    </GrowthAgentLayout>
  );
}
