import {
  generateMarketingTaskDraftContent,
  type MarketingTaskDraftContent,
  type MarketingTaskGenerationContext,
} from "@app-template/ai";
import { getMarketingTaskFeedItemType } from "@app-template/db";
import type { ProductMarketingTaskModel } from "@app-template/db";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readDraftFields(payload: unknown) {
  if (!isRecord(payload)) {
    return {};
  }

  return {
    quote: readString(payload, "quote"),
    reply: readString(payload, "reply"),
    threadUrl: readString(payload, "threadUrl"),
    draftBody: readString(payload, "draftBody"),
    headline: readString(payload, "headline"),
    body: readString(payload, "body"),
    format: readString(payload, "format"),
    platform: readString(payload, "platform"),
    budget: readString(payload, "budget"),
    creativeLabel: readString(payload, "creativeLabel"),
  };
}

function hasDraftContent({
  task,
  payload,
}: {
  task: ProductMarketingTaskModel;
  payload: Record<string, unknown>;
}) {
  const draftFields = readDraftFields(payload);
  const feedItemType = getMarketingTaskFeedItemType({
    network: task.network,
    contentType: task.contentType,
  });

  if (feedItemType === "reddit") {
    return draftFields.quote != null && draftFields.reply != null;
  }

  if (feedItemType === "ad") {
    return (
      draftFields.headline != null &&
      draftFields.body != null &&
      draftFields.format != null &&
      draftFields.platform != null &&
      draftFields.budget != null &&
      draftFields.creativeLabel != null
    );
  }

  return draftFields.draftBody != null;
}

function applyDraftContent({
  payload,
  draftContent,
  task,
}: {
  payload: Record<string, unknown>;
  draftContent: MarketingTaskDraftContent;
  task: ProductMarketingTaskModel;
}) {
  const feedItemType = getMarketingTaskFeedItemType({
    network: task.network,
    contentType: task.contentType,
  });

  if (feedItemType === "reddit" && "quote" in draftContent && "reply" in draftContent) {
    return {
      ...payload,
      quote: draftContent.quote,
      reply: draftContent.reply,
    };
  }

  if (feedItemType === "ad" && "headline" in draftContent) {
    return {
      ...payload,
      headline: draftContent.headline,
      body: draftContent.body,
      format: draftContent.format,
      platform: draftContent.platform,
      budget: draftContent.budget,
      creativeLabel: draftContent.creativeLabel,
    };
  }

  if ("draftBody" in draftContent) {
    return {
      ...payload,
      draftBody: draftContent.draftBody,
    };
  }

  return payload;
}

function mergeDraftFields({
  payload,
  existingPayload,
}: {
  payload: Record<string, unknown>;
  existingPayload: unknown;
}) {
  const draftFields = readDraftFields(existingPayload);

  return {
    ...payload,
    ...(draftFields.quote != null ? { quote: draftFields.quote } : {}),
    ...(draftFields.reply != null ? { reply: draftFields.reply } : {}),
    ...(draftFields.threadUrl != null ? { threadUrl: draftFields.threadUrl } : {}),
    ...(draftFields.draftBody != null ? { draftBody: draftFields.draftBody } : {}),
    ...(draftFields.headline != null ? { headline: draftFields.headline } : {}),
    ...(draftFields.body != null ? { body: draftFields.body } : {}),
    ...(draftFields.format != null ? { format: draftFields.format } : {}),
    ...(draftFields.platform != null ? { platform: draftFields.platform } : {}),
    ...(draftFields.budget != null ? { budget: draftFields.budget } : {}),
    ...(draftFields.creativeLabel != null ? { creativeLabel: draftFields.creativeLabel } : {}),
  };
}

export async function enrichMarketingTaskFeedPayload({
  task,
  payload,
  existingPayload,
  context,
}: {
  task: ProductMarketingTaskModel;
  payload: Record<string, unknown>;
  existingPayload: unknown;
  context: MarketingTaskGenerationContext | null;
}) {
  let nextPayload = mergeDraftFields({ payload, existingPayload });

  if (hasDraftContent({ task, payload: nextPayload }) || context == null) {
    return nextPayload;
  }

  try {
    const draftContent = await generateMarketingTaskDraftContent({
      description: task.description,
      contentType: task.contentType,
      network: task.network,
      context,
    });

    return applyDraftContent({
      payload: nextPayload,
      draftContent,
      task,
    });
  } catch {
    return nextPayload;
  }
}
