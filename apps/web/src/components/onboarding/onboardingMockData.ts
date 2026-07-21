import type { OnboardingState } from "@/components/onboarding/onboardingTypes";

export interface SelectableOption {
  id: string;
  label: string;
  selectedColor: string;
  unselectedBorderColor: string;
  unselectedTextColor: string;
}

export const targetMarketOptions: Array<SelectableOption> = [
  {
    id: "busy-professionals",
    label: "Busy professionals",
    selectedColor: "#c84e1a",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "travelers",
    label: "Travelers",
    selectedColor: "#3262d4",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "heritage-speakers",
    label: "Heritage speakers",
    selectedColor: "#6a3fd1",
    unselectedBorderColor: "#c4b5fd",
    unselectedTextColor: "#6a3fd1",
  },
  {
    id: "college-students",
    label: "College students",
    selectedColor: "#2e6b47",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "expats",
    label: "Expats",
    selectedColor: "#b8860b",
    unselectedBorderColor: "#d4a574",
    unselectedTextColor: "#a67c3d",
  },
];

export const personalityOptions: Array<SelectableOption> = [
  {
    id: "friendly-expert",
    label: "Friendly expert",
    selectedColor: "#3262d4",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "bold-challenger",
    label: "Bold challenger",
    selectedColor: "#c84e1a",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "empathetic-coach",
    label: "Empathetic coach",
    selectedColor: "#2e6b47",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
  {
    id: "witty-conversationalist",
    label: "Witty conversationalist",
    selectedColor: "#6a3fd1",
    unselectedBorderColor: "#c4b5fd",
    unselectedTextColor: "#6a3fd1",
  },
  {
    id: "no-nonsense-pragmatist",
    label: "No-nonsense pragmatist",
    selectedColor: "#17140f",
    unselectedBorderColor: "rgba(23,20,15,0.15)",
    unselectedTextColor: "#17140f",
  },
];

export const channelOptions = [
  { id: "replies-reddit", label: "Replies (Reddit)" },
  { id: "founder-stories-linkedin", label: "Founder Stories (LinkedIn)" },
  { id: "founder-stories-x", label: "Founder Stories (X)" },
  { id: "founder-stories-reddit", label: "Founder Stories (Reddit)" },
  { id: "paid-ads-meta", label: "Paid Ads (Meta)" },
  { id: "organic-content-meta", label: "Organic Content (Meta)" },
] as const;

export const capacityOptions = [
  { id: "light", label: "1–2 hours / week", description: "Light touch — a few high-impact moves." },
  {
    id: "moderate",
    label: "3–5 hours / week",
    description: "Steady cadence across channels.",
  },
  {
    id: "intensive",
    label: "6–10 hours / week",
    description: "Aggressive growth — multiple channels active.",
  },
  {
    id: "full-time",
    label: "10+ hours / week",
    description: "Full marketing push with daily activity.",
  },
] as const;

export const defaultTargetMarkets = ["busy-professionals", "travelers", "college-students"];

export const defaultPersonality = ["friendly-expert", "empathetic-coach"];

export const defaultChannels = ["replies-reddit", "founder-stories-linkedin", "paid-ads-meta"];

export function createEmptyWebsiteData() {
  return {
    url: "",
    companyDescription: "",
    keyDifferentiators: "",
    competitors: "",
    subreddits: "",
    searchKeywordsX: "",
    searchKeywordsGoogle: "",
    searchKeywordsSeo: "",
  };
}

export function createInitialOnboardingState(): OnboardingState {
  return {
    website: createEmptyWebsiteData(),
    targetMarkets: [...defaultTargetMarkets],
    personality: [...defaultPersonality],
    channels: [...defaultChannels],
    capacity: "moderate",
    integrations: {
      stripe: false,
      mixpanel: false,
      metaAds: false,
    },
  };
}
