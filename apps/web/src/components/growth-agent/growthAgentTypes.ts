export type GrowthAgentDayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type GrowthAgentFeedItemType = "reddit" | "post" | "ad" | "newsjack";

export interface GrowthAgentFeedItem {
  id: string;
  day: GrowthAgentDayKey;
  type: GrowthAgentFeedItemType;
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  live?: boolean;
  defaultCompleted?: boolean;
  why?: string;
  quote?: string;
  reply?: string;
  threadUrl?: string;
  draftBody?: string;
  draftBodyX?: string;
  draftBodyLinkedIn?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  isVideo?: boolean;
}

export interface GrowthAgentProject {
  id: string;
  type?: "ad";
  tag: string;
  color: string;
  colorBg: string;
  title: string;
  meta: string;
  defaultCompleted?: boolean;
  doneLabel?: string;
  isVideo?: boolean;
  description?: string;
  why?: string;
  headline?: string;
  body?: string;
  format?: string;
  platform?: string;
  budget?: string;
  creativeLabel?: string;
  todos: Array<{
    id: string;
    text: string;
    done: boolean;
    hireUrl?: string;
  }>;
}

export interface GrowthAgentIdea {
  id: string;
  title: string;
  meta: string;
  description: string;
  why?: string;
  references?: Array<{ label: string; url: string }>;
  materials?: Array<{ label: string }>;
  todos: Array<{ id: string; text: string; done: boolean }>;
}

export interface GrowthAgentDay {
  key: GrowthAgentDayKey;
  label: string;
  date: number;
}

export const growthAgentDayNames: Record<GrowthAgentDayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export function getCompanyNameFromUrl({ url }: { url: string }) {
  if (url.length === 0) {
    return "Your product";
  }

  const normalized = url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? url;
  const namePart = normalized.split(".")[0] ?? normalized;

  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
}
