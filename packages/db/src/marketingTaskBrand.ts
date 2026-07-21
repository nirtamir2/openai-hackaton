import {
  MarketingTaskContentType,
  MarketingTaskNetwork,
} from "../prisma/generated/enums";

const networkLabels: Record<MarketingTaskNetwork, string> = {
  [MarketingTaskNetwork.X]: "X",
  [MarketingTaskNetwork.REDDIT]: "REDDIT",
  [MarketingTaskNetwork.LINKEDIN]: "LINKEDIN",
  [MarketingTaskNetwork.YOUTUBE]: "YOUTUBE",
};

const contentTypeLabels: Record<MarketingTaskContentType, string> = {
  [MarketingTaskContentType.REPLY]: "REPLY",
  [MarketingTaskContentType.POST]: "POST",
  [MarketingTaskContentType.VIDEO]: "VIDEO",
  [MarketingTaskContentType.IMAGE]: "IMAGE",
};

const networkColors: Record<MarketingTaskNetwork, string> = {
  [MarketingTaskNetwork.X]: "#17140f",
  [MarketingTaskNetwork.REDDIT]: "#c9440e",
  [MarketingTaskNetwork.LINKEDIN]: "#0a66c2",
  [MarketingTaskNetwork.YOUTUBE]: "#ff0000",
};

const networkColorBackgrounds: Record<MarketingTaskNetwork, string> = {
  [MarketingTaskNetwork.X]: "rgba(23,20,15,0.08)",
  [MarketingTaskNetwork.REDDIT]: "rgba(255,90,31,0.1)",
  [MarketingTaskNetwork.LINKEDIN]: "rgba(10,102,194,0.1)",
  [MarketingTaskNetwork.YOUTUBE]: "rgba(255,0,0,0.1)",
};

export interface MarketingTaskSubtask {
  id: string;
  text: string;
  done: boolean;
}

export function getMarketingTaskTag({
  network,
  contentType,
}: {
  network: MarketingTaskNetwork;
  contentType: MarketingTaskContentType;
}) {
  return `${networkLabels[network]} ${contentTypeLabels[contentType]}`;
}

export function getMarketingTaskNetworkColor({ network }: { network: MarketingTaskNetwork }) {
  return networkColors[network];
}

export function getMarketingTaskNetworkColorBg({ network }: { network: MarketingTaskNetwork }) {
  return networkColorBackgrounds[network];
}

export function getMarketingTaskFeedItemType({
  network,
  contentType,
}: {
  network: MarketingTaskNetwork;
  contentType: MarketingTaskContentType;
}) {
  if (contentType === MarketingTaskContentType.REPLY && network === MarketingTaskNetwork.REDDIT) {
    return "reddit";
  }

  if (contentType === MarketingTaskContentType.VIDEO) {
    return "ad";
  }

  return "post";
}

export function parseMarketingTaskSubtasks(value: unknown): Array<MarketingTaskSubtask> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((subtask) => {
    if (typeof subtask !== "object" || subtask == null) {
      return [];
    }

    const record = subtask as Record<string, unknown>;
    const id = record.id;
    const text = record.text;
    const done = record.done;

    if (typeof id !== "string" || typeof text !== "string") {
      return [];
    }

    return [
      {
        id,
        text,
        done: typeof done === "boolean" ? done : false,
      },
    ];
  });
}

export function createMarketingTaskSubtaskId() {
  return `subtask-${crypto.randomUUID()}`;
}
