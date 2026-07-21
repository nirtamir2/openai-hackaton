import prisma, {
  GrowthFeedEntryKind,
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db";
import { ORPCError } from "@orpc/server";
import { createProductMarketingTask } from "../marketing/createProductMarketingTask";
import { syncMarketingTaskToGrowthFeed } from "./syncMarketingTasksToGrowthFeed";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function readString(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "string" ? value : null;
}

function readNumber(payload: Record<string, unknown>, key: string) {
  const value = payload[key];
  return typeof value === "number" ? value : null;
}

function readSubtasks(payload: Record<string, unknown>) {
  const rawSubtasks = payload.subtasks;

  if (!Array.isArray(rawSubtasks)) {
    return [];
  }

  return rawSubtasks.flatMap((subtask) => {
    if (!isRecord(subtask)) {
      return [];
    }

    const id = readString(subtask, "id");
    const text = readString(subtask, "text");

    if (id == null || text == null) {
      return [];
    }

    const done = subtask.done === true;

    return [{ id, text, done }];
  });
}

function readTaskDraft(payload: Record<string, unknown>) {
  const draft = payload.taskDraft;

  if (!isRecord(draft)) {
    return null;
  }

  const description = readString(draft, "description");
  const contentType = readString(draft, "contentType");
  const network = readString(draft, "network");
  const videoHook = readString(draft, "videoHook");
  const priority = readNumber(draft, "priority");
  const targetDate = readString(draft, "targetDate");
  const scheduledStart = readString(draft, "scheduledStart");
  const scheduledEnd = readString(draft, "scheduledEnd");
  const subtasks = readSubtasks(draft);
  const trendId = readString(draft, "trendId");

  if (
    description == null ||
    contentType == null ||
    network == null ||
    videoHook == null ||
    priority == null ||
    targetDate == null ||
    scheduledStart == null ||
    scheduledEnd == null ||
    subtasks.length < 4
  ) {
    return null;
  }

  if (
    contentType !== MarketingTaskContentType.VIDEO ||
    !Object.values(MarketingTaskNetwork).includes(network as MarketingTaskNetwork)
  ) {
    return null;
  }

  return {
    description,
    contentType: contentType as MarketingTaskContentType,
    network: network as MarketingTaskNetwork,
    videoHook,
    subtasks,
    priority,
    targetDate: new Date(targetDate),
    scheduledStart: new Date(scheduledStart),
    scheduledEnd: new Date(scheduledEnd),
    trendId,
  };
}

interface Props {
  productId: string;
  entryId: string;
}

export async function approveGrowthFeedIdea({ productId, entryId }: Props) {
  const entry = await prisma.productGrowthFeedEntry.findFirst({
    where: {
      productId,
      externalId: entryId,
      kind: GrowthFeedEntryKind.IDEA,
    },
  });

  if (entry == null) {
    throw new ORPCError("NOT_FOUND");
  }

  if (!isRecord(entry.payload)) {
    throw new ORPCError("BAD_REQUEST", { message: "Idea payload is invalid." });
  }

  const existingMarketingTaskId = readString(entry.payload, "marketingTaskId");

  if (existingMarketingTaskId != null) {
    return { marketingTaskId: existingMarketingTaskId };
  }

  const taskDraft = readTaskDraft(entry.payload);

  if (taskDraft == null) {
    throw new ORPCError("BAD_REQUEST", { message: "Idea is missing task details." });
  }

  const marketingTask = await createProductMarketingTask({
    productId,
    description: taskDraft.description,
    taskType: MarketingTaskType.LONG,
    contentType: taskDraft.contentType,
    network: taskDraft.network,
    subtasks: taskDraft.subtasks,
    priority: taskDraft.priority,
    targetDate: taskDraft.targetDate,
    scheduledStart: taskDraft.scheduledStart,
    scheduledEnd: taskDraft.scheduledEnd,
    trendId: taskDraft.trendId,
  });

  await syncMarketingTaskToGrowthFeed(marketingTask, null, {
    videoHook: taskDraft.videoHook,
  });

  await prisma.productGrowthFeedEntry.delete({
    where: { id: entry.id },
  });

  return { marketingTaskId: marketingTask.id };
}
