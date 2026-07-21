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
import { buildTaskPreviewTitle } from "../marketing/buildTaskPreviewTitle";
import { enrichMarketingTaskFeedPayload } from "./enrichMarketingTaskFeedPayload";
import { getMarketingTaskExternalId } from "./marketingTaskFeedIds";
import { isScheduledForToday } from "../marketing/marketingTaskDates";
import { getProductSentimentContext } from "../sentiment/getProductSentimentContext";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function getDayKeyFromDate(date: Date) {
  return dayKeys[date.getDay()] ?? "mon";
}

function buildShortTaskFeedPayload(task: ProductMarketingTaskModel) {
  const description = task.description.trim();
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
    title: buildTaskPreviewTitle({ description }),
    description,
    meta: `AI generated · Priority ${String(task.priority)}`,
    marketingTaskId: task.id,
    isVideo: task.contentType === MarketingTaskContentType.VIDEO,
  };
}

function buildLongTaskFeedPayload(task: ProductMarketingTaskModel) {
  const description = task.description.trim();
  const subtasks = parseMarketingTaskSubtasks(task.subtasks);

  return {
    tag: "PROJECT",
    color: "#6a3fd1",
    colorBg: "rgba(106,63,209,0.1)",
    title: buildTaskPreviewTitle({ description }),
    description,
    meta: `Ongoing project · Priority ${String(task.priority)}`,
    marketingTaskId: task.id,
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
    ? buildLongTaskFeedPayload(task)
    : buildShortTaskFeedPayload(task);
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
      payload,
    },
    update: {
      kind: isLongTask ? GrowthFeedEntryKind.PROJECT : GrowthFeedEntryKind.FEED_ITEM,
      dayKey: isLongTask ? null : getDayKeyFromDate(task.scheduledStart),
      sortOrder: 1_000 + task.priority,
      payload,
    },
  });
}

export async function syncMarketingTasksToGrowthFeed({ productId }: { productId: string }) {
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

  const sentimentContext = await getProductSentimentContext({ productId });
  const draftContext =
    sentimentContext == null
      ? null
      : {
          product: sentimentContext.product,
          marketingProfile: sentimentContext.marketingProfile,
          marketingTasks: sentimentContext.marketingTasks,
          sentiments: sentimentContext.sentiments,
          trend: null,
        };

  await Promise.all(
    tasksToSync.map((task) => syncMarketingTaskToGrowthFeed(task, draftContext)),
  );
}
