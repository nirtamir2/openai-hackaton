import type { OnboardingState, SelectableOption } from "@/components/onboarding/onboardingTypes";

export const defaultWebsiteUrl = "langotalk.com";

export const mockWebsiteData = {
  companyDescription:
    "An AI conversation partner that helps you actually speak a new language, not just tap through vocab drills.",
  keyDifferentiators: "Real spoken conversation practice, live correction, no gamified streaks.",
  competitors: "Duolingo, Babbel, Busuu",
  subreddits: "r/languagelearning, r/Spanish, r/duolingo, r/French",
  searchKeywordsX:
    "learn Spanish conversation, AI language tutor, speak French fluently, language practice app",
  searchKeywordsGoogle:
    "best app to learn Spanish speaking, AI language conversation partner, learn French by talking",
  searchKeywordsSeo:
    "how to practice speaking Spanish, conversational language learning, AI language coach",
} as const;

export const channelOptions: Array<SelectableOption> = [
  {
    id: "paid-ads-meta",
    title: "Meta paid ads",
    subtitle: "Launch and optimize paid campaigns on Facebook and Instagram.",
  },
  {
    id: "organic-content-meta",
    title: "Meta organic posts",
    subtitle: "Publish and manage unpaid posts on Facebook and Instagram.",
  },
  {
    id: "replies-reddit",
    title: "Reddit replies",
    subtitle: "Join relevant conversations with helpful, on-brand comments.",
  },
  {
    id: "founder-stories-linkedin",
    title: "LinkedIn posts",
    subtitle: "Share founder updates, lessons, and product milestones.",
  },
  {
    id: "founder-stories-x",
    title: "X posts",
    subtitle: "Post short updates, opinions, and build-in-public moments.",
  },
  {
    id: "founder-stories-reddit",
    title: "Reddit posts",
    subtitle: "Publish founder stories and updates in relevant subreddits.",
  },
];

export const defaultChannelIds = channelOptions.map((option) => option.id);

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
    targetMarketOptions: [],
    targetMarkets: [],
    personalityOptions: [],
    personality: null,
    channels: [...defaultChannelIds],
    capacity: null,
    integrations: {
      stripe: true,
      mixpanel: true,
      metaAds: true,
    },
  };
}

export const mockRevenueDashboard = {
  last30Days: {
    revenue: "$24,380",
    adSpend: "$6,120",
    profit: "$18,260",
    newCustomers: "142",
  },
  dailyRevenue: [
    { day: "Mon", amount: 680 },
    { day: "Tue", amount: 920 },
    { day: "Wed", amount: 740 },
    { day: "Thu", amount: 1100 },
    { day: "Fri", amount: 890 },
    { day: "Sat", amount: 620 },
    { day: "Sun", amount: 540 },
  ],
  revenueBySource: [
    { source: "Reddit (agent replies)", amount: "$8,420", percent: 35 },
    { source: "Meta Ads", amount: "$7,100", percent: 29 },
    { source: "Google Search Ads", amount: "$4,860", percent: 20 },
    { source: "Direct / unattributed", amount: "$4,000", percent: 16 },
  ],
} as const;
