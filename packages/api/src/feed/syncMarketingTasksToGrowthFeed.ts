import prisma, {
  GrowthFeedEntryKind,
  getMarketingTaskFeedItemType,
  getMarketingTaskNetworkColor,
  getMarketingTaskNetworkColorBg,
  getMarketingTaskTag,
  MarketingTaskContentType,
  MarketingTaskType,
  parseMarketingTaskSubtasks,
} from "@app-template/db";
import type { ProductMarketingTaskModel } from "@app-template/db";
import type { MarketingTaskGenerationContext } from "@app-template/ai";
import { buildIdeaDescription } from "../marketing/buildIdeaDescription";
import { buildTaskPreviewTitle } from "../marketing/buildTaskPreviewTitle";
import { enrichMarketingTaskFeedPayload } from "./enrichMarketingTaskFeedPayload";
import { getMarketingTaskExternalId } from "./marketingTaskFeedIds";
import { isScheduledForToday } from "../marketing/marketingTaskDates";
import { getProductSentimentContext } from "../sentiment/getProductSentimentContext";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value != null && !Array.isArray(value);
}

function readStoredVideoHook(payload: unknown) {
  if (!isRecord(payload)) {
    return null;
  }

  const videoHook = payload.videoHook;

  return typeof videoHook === "string" && videoHook.trim().length > 0 ? videoHook.trim() : null;
}

function getDayKeyFromDate(date: Date) {
  return dayKeys[date.getDay()] ?? "mon";
}

function resolveTaskDisplay({
  task,
  display,
}: {
  task: ProductMarketingTaskModel;
  display?: { title?: string; summary?: string };
}) {
  const description = task.description.trim();

  return {
    title:
      display?.title ??
      (task.title.length > 0 ? task.title : buildTaskPreviewTitle({ description })),
    summary:
      display?.summary ??
      (task.summary != null && task.summary.length > 0
        ? task.summary
        : buildIdeaDescription({ description })),
  };
}

function buildShortTaskFeedPayload({
  task,
  display,
}: {
  task: ProductMarketingTaskModel;
  display?: { title?: string; summary?: string };
}) {
  const description = task.description.trim();
  const resolvedDisplay = resolveTaskDisplay({ task, display });
  const tag = getMarketingTaskTag({
    network: task.network,
    contentType: task.contentType,
  });
  const color = getMarketingTaskNetworkColor({ network: task.network });
  const colorBg = getMarketingTaskNetworkColorBg({ network: task.network });
  const type = getMarketingTaskFeedItemType({
    network: task.network,
    contentType: task.contentType,
  });

  return {
    type,
    tag,
    color,
    colorBg,
    title: resolvedDisplay.title,
    description,
    meta: `Priority ${String(task.priority)}`,
    marketingTaskId: task.id,
    isVideo: task.contentType === MarketingTaskContentType.VIDEO,
  };
}

function buildLongTaskFeedPayload({
  task,
  display,
  videoHook,
}: {
  task: ProductMarketingTaskModel;
  display?: { title?: string; summary?: string };
  videoHook: string | null;
}) {
  const resolvedDisplay = resolveTaskDisplay({ task, display });
  const subtasks = parseMarketingTaskSubtasks(task.subtasks);

  return {
    tag: "PROJECT",
    color: "#6a3fd1",
    colorBg: "rgba(106,63,209,0.1)",
    title: resolvedDisplay.title,
    description: resolvedDisplay.summary,
    meta: `Idea · Priority ${String(task.priority)}`,
    marketingTaskId: task.id,
    isVideo: task.contentType === MarketingTaskContentType.VIDEO,
    videoHook,
    todos: subtasks.map((subtask) => ({
      id: subtask.id,
      text: subtask.text,
      done: subtask.done,
    })),
  };
}

export async function syncMarketingTaskToGrowthFeed(
  task: ProductMarketingTaskModel,
  context: MarketingTaskGenerationContext | null = null,
  options: { videoHook?: string | null; display?: { title?: string; summary?: string } } = {},
) {
  const externalId = getMarketingTaskExternalId({ taskId: task.id });
  const isLongTask = task.taskType === MarketingTaskType.LONG;

  const existingEntry = await prisma.productGrowthFeedEntry.findUnique({
    where: {
      productId_externalId: {
        productId: task.productId,
        externalId,
      },
    },
    select: {
      payload: true,
    },
  });

  const basePayload = isLongTask
    ? buildLongTaskFeedPayload({
        task,
        display: options.display,
        videoHook: options.videoHook ?? readStoredVideoHook(existingEntry?.payload),
      })
    : buildShortTaskFeedPayload({ task, display: options.display });
  const payload = isLongTask
    ? basePayload
    : await enrichMarketingTaskFeedPayload({
        task,
        payload: basePayload,
        existingPayload: existingEntry?.payload,
        context,
      });

  return await prisma.productGrowthFeedEntry.upsert({
    where: {
      productId_externalId: {
        productId: task.productId,
        externalId,
      },
    },
    create: {
      productId: task.productId,
      externalId,
      kind: isLongTask ? GrowthFeedEntryKind.PROJECT : GrowthFeedEntryKind.FEED_ITEM,
      dayKey: isLongTask ? null : getDayKeyFromDate(task.scheduledStart),
      sortOrder: 1_000 + task.priority,
      completed: false,
      payload: payload as never,
    },
    update: {
      kind: isLongTask ? GrowthFeedEntryKind.PROJECT : GrowthFeedEntryKind.FEED_ITEM,
      dayKey: isLongTask ? null : getDayKeyFromDate(task.scheduledStart),
      sortOrder: 1_000 + task.priority,
      payload: payload as never,
    },
  });
}

export async function syncMarketingTasksToGrowthFeed({
  productId,
  enrich = true,
}: {
  productId: string;
  enrich?: boolean;
}) {
  const tasks = await prisma.productMarketingTask.findMany({
    where: { productId },
    orderBy: [{ scheduledStart: "asc" }],
  });

  const todayTasks = tasks.filter((task) =>
    isScheduledForToday({ date: task.scheduledStart }),
  );

  const todayExternalIds = new Set(
    todayTasks.map((task) => getMarketingTaskExternalId({ taskId: task.id })),
  );

  const longTaskExternalIds = new Set(
    tasks
      .filter((task) => task.taskType === MarketingTaskType.LONG)
      .map((task) => getMarketingTaskExternalId({ taskId: task.id })),
  );

  const marketingFeedEntries = await prisma.productGrowthFeedEntry.findMany({
    where: {
      productId,
      externalId: {
        startsWith: "marketing-task-",
      },
    },
    select: {
      externalId: true,
    },
  });

  const staleExternalIds = marketingFeedEntries
    .map((entry) => entry.externalId)
    .filter(
      (externalId) =>
        !todayExternalIds.has(externalId) && !longTaskExternalIds.has(externalId),
    );

  if (staleExternalIds.length > 0) {
    await prisma.productGrowthFeedEntry.deleteMany({
      where: {
        productId,
        externalId: { in: staleExternalIds },
      },
    });
  }

  const tasksToSync = [
    ...new Map(
      [
        ...todayTasks,
        ...tasks.filter((task) => task.taskType === MarketingTaskType.LONG),
      ].map((task) => [task.id, task]),
    ).values(),
  ];

  if (tasksToSync.length === 0) {
    return;
  }

  const draftContext = enrich
    ? await (async () => {
        const sentimentContext = await getProductSentimentContext({ productId });

        if (sentimentContext == null) {
          return null;
        }

        return {
          product: sentimentContext.product,
          marketingProfile: sentimentContext.marketingProfile,
          marketingTasks: sentimentContext.marketingTasks,
          sentiments: sentimentContext.sentiments,
          trend: null,
        };
      })()
    : null;

  await Promise.all(
    tasksToSync.map((task) => syncMarketingTaskToGrowthFeed(task, draftContext)),
  );
}
