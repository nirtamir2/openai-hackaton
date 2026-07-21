import { useState } from "react";
import { GrowthAgentFeed } from "@/components/growth-agent/GrowthAgentFeed";
import { GrowthAgentLayout, type GrowthAgentTab } from "@/components/growth-agent/GrowthAgentLayout";
import { GrowthAgentOverview } from "@/components/growth-agent/GrowthAgentOverview";

interface Props {
  companyName: string;
  productId: string;
}

export function GrowthAgentDashboard({ companyName, productId }: Props) {
  const [activeTab, setActiveTab] = useState<GrowthAgentTab>("feed");
  const [openTaskCount, setOpenTaskCount] = useState(0);

  return (
    <GrowthAgentLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      openTaskCount={openTaskCount}
      companyName={companyName}
    >
      {activeTab === "feed" ? (
        <GrowthAgentFeed
          productId={productId}
          onOpenCountChange={(count) => {
            setOpenTaskCount(count);
          }}
        />
      ) : null}
      {activeTab === "overview" ? <GrowthAgentOverview /> : null}
    </GrowthAgentLayout>
  );
}
