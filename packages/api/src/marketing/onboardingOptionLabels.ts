const channelLabels: Record<string, string> = {
  "replies-reddit": "Replies (Reddit)",
  "founder-stories-linkedin": "Founder Stories (LinkedIn)",
  "founder-stories-x": "Founder Stories (X)",
  "founder-stories-reddit": "Founder Stories (Reddit)",
  "paid-ads-meta": "Paid Ads (Meta)",
  "organic-content-meta": "Organic Content (Meta)",
};

const targetMarketLabels: Record<string, string> = {
  "busy-professionals": "Busy professionals",
  travelers: "Travelers",
  "heritage-speakers": "Heritage speakers",
  "college-students": "College students",
  expats: "Expats",
};

const personalityLabels: Record<string, string> = {
  "friendly-expert": "Friendly expert",
  "bold-challenger": "Bold challenger",
  "empathetic-coach": "Empathetic coach",
  "witty-conversationalist": "Witty conversationalist",
  "no-nonsense-pragmatist": "No-nonsense pragmatist",
};

const capacityLabels: Record<string, string> = {
  light: "1–2 hours / week",
  moderate: "3–5 hours / week",
  intensive: "6–10 hours / week",
  "full-time": "10+ hours / week",
};

function resolveLabels({ ids, labels }: { ids: Array<string>; labels: Record<string, string> }) {
  return ids.map((id) => labels[id] ?? id);
}

export function resolveChannelLabels({ channelIds }: { channelIds: Array<string> }) {
  return resolveLabels({ ids: channelIds, labels: channelLabels });
}

export function resolveTargetMarketLabels({ targetMarketIds }: { targetMarketIds: Array<string> }) {
  return resolveLabels({ ids: targetMarketIds, labels: targetMarketLabels });
}

export function resolvePersonalityLabels({ personalityIds }: { personalityIds: Array<string> }) {
  return resolveLabels({ ids: personalityIds, labels: personalityLabels });
}

export function resolveCapacityLabel({ capacityId }: { capacityId: string | null }) {
  if (capacityId == null || capacityId.length === 0) {
    return null;
  }

  return capacityLabels[capacityId] ?? capacityId;
}
