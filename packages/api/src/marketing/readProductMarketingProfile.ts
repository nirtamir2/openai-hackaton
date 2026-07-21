import {
  resolveCapacityLabel,
  resolveChannelLabels,
  resolvePersonalityLabels,
  resolveTargetMarketLabels,
} from "./onboardingOptionLabels";

export interface ProductMarketingProfile {
  websiteUrl: string;
  channels: Array<string>;
  targetMarkets: Array<string>;
  personality: Array<string>;
  capacity: string | null;
  subreddits: string;
  searchKeywordsX: string;
  searchKeywordsGoogle: string;
  searchKeywordsSeo: string;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

export function readProductMarketingProfile({
  websiteUrl,
  onboardingConfig,
}: {
  websiteUrl: string;
  onboardingConfig: unknown;
}): ProductMarketingProfile {
  const config = isRecord(onboardingConfig) ? onboardingConfig : {};

  const channelIds = readStringArray(config.channels);
  const targetMarketIds = readStringArray(config.targetMarkets);
  const personalityIds = readStringArray(config.personality);
  const capacityId = readString(config.capacity);

  return {
    websiteUrl: websiteUrl.trim(),
    channels: resolveChannelLabels({ channelIds }),
    targetMarkets: resolveTargetMarketLabels({ targetMarketIds }),
    personality: resolvePersonalityLabels({ personalityIds }),
    capacity: resolveCapacityLabel({ capacityId }),
    subreddits: readString(config.subreddits),
    searchKeywordsX: readString(config.searchKeywordsX),
    searchKeywordsGoogle: readString(config.searchKeywordsGoogle),
    searchKeywordsSeo: readString(config.searchKeywordsSeo),
  };
}
