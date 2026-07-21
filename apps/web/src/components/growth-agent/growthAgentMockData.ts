export {
  getCompanyNameFromUrl,
  growthAgentDayNames,
  type GrowthAgentDay,
  type GrowthAgentDayKey,
  type GrowthAgentFeedItem,
  type GrowthAgentFeedItemType,
  type GrowthAgentIdea,
  type GrowthAgentProject,
} from "@/components/growth-agent/growthAgentTypes";

export const growthAgentDailyRevenue = [
  180, 210, 195, 260, 240, 310, 290, 330, 355, 300, 410, 380, 390, 460,
];

export const growthAgentRevenueSources = [
  {
    name: "Reddit (agent replies)",
    utm: "utm_source=reddit&utm_medium=organic",
    revenue: 2980,
    spend: 0,
    customers: 35,
    color: "#c9440e",
    note: "organic · agent-sourced",
  },
  {
    name: "Meta Ads",
    utm: "utm_source=meta&utm_campaign=tired_of_gamified",
    revenue: 2340,
    spend: 620,
    customers: 28,
    color: "#2f5fd6",
    note: "3.8x ROAS",
  },
  {
    name: "Google Search Ads",
    utm: "utm_source=google&utm_campaign=duolingo_alternatives",
    revenue: 1860,
    spend: 530,
    customers: 21,
    color: "#6a3fd1",
    note: "3.5x ROAS",
  },
  {
    name: "Direct / unattributed",
    utm: "no UTM captured",
    revenue: 1240,
    spend: 0,
    customers: 12,
    color: "rgba(23,20,15,0.35)",
    note: "unknown source",
  },
];
