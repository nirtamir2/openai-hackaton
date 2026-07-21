import prisma from "@app-template/db";

interface OnboardingWebsiteInput {
  url: string;
  companyDescription: string;
  keyDifferentiators: string;
  competitors: string;
  competitorWeaknesses: string;
  subreddits: string;
  searchKeywordsX: string;
  searchKeywordsGoogle: string;
  searchKeywordsSeo: string;
}

interface OnboardingIntegrationsInput {
  stripe: boolean;
  mixpanel: boolean;
  metaAds: boolean;
}

interface Props {
  website: OnboardingWebsiteInput;
  targetMarkets: Array<string>;
  personality: Array<string>;
  channels: Array<string>;
  capacity: string | null;
  integrations: OnboardingIntegrationsInput;
}

export async function createProductFromOnboarding(input: Props) {
  const onboardingConfig = {
    subreddits: input.website.subreddits,
    searchKeywordsX: input.website.searchKeywordsX,
    searchKeywordsGoogle: input.website.searchKeywordsGoogle,
    searchKeywordsSeo: input.website.searchKeywordsSeo,
    targetMarkets: input.targetMarkets,
    personality: input.personality,
    channels: input.channels,
    capacity: input.capacity,
    integrations: {
      stripe: input.integrations.stripe,
      mixpanel: input.integrations.mixpanel,
      metaAds: input.integrations.metaAds,
    },
  };

  return await prisma.product.create({
    data: {
      generalDescription: input.website.companyDescription.trim(),
      plusSides: input.website.keyDifferentiators.trim(),
      minusSides: "Not specified yet.",
      mainCompetitors: input.website.competitors.trim(),
      competitorWeaknesses: input.website.competitorWeaknesses.trim(),
      websiteUrl: input.website.url.trim(),
      onboardingConfig,
    },
  });
}
