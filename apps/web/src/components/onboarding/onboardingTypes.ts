export interface OnboardingWebsiteData {
  url: string;
  companyDescription: string;
  keyDifferentiators: string;
  competitors: string;
  subreddits: string;
  searchKeywordsX: string;
  searchKeywordsGoogle: string;
  searchKeywordsSeo: string;
}

export interface OnboardingIntegrations {
  stripe: boolean;
  mixpanel: boolean;
  metaAds: boolean;
}

export interface OnboardingState {
  website: OnboardingWebsiteData;
  targetMarkets: Array<string>;
  personality: Array<string>;
  channels: Array<string>;
  capacity: string | null;
  integrations: OnboardingIntegrations;
}

export type OnboardingStepId =
  | "website"
  | "target-market"
  | "personality"
  | "channels"
  | "capacity"
  | "integration"
  | "report";
