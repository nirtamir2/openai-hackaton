import prisma, { GrowthFeedEntryKind, MarketingTaskType } from "@app-template/db";
import type { ProductMarketingTaskModel } from "@app-template/db";
import { getMarketingTaskExternalId } from "./marketingTaskFeedIds";
import { isScheduledForToday } from "../marketing/marketingTaskDates";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function getDayKeyFromDate(date: Date) {
  return dayKeys[date.getDay()] ?? "mon";
}

function getTaskTitle(description: string) {
  const firstSentence = description.split(/[.!?]/)[0]?.trim() ?? description;

  if (firstSentence.length <= 100) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, 97)}...`;
}

function buildMarketingTaskFeedPayload(task: ProductMarketingTaskModel) {
  const tag =
    task.taskType === MarketingTaskType.SHORT ? "SHORT-TERM TASK" : "LONG-TERM TASK";

  return {
    type: "post",
    tag,
    color: "#2f6f4e",
    colorBg: "rgba(47,111,78,0.1)",
    title: getTaskTitle(task.description),
    meta: `AI generated · Priority ${String(task.priority)}`,
    why: task.description,
    marketingTaskId: task.id,
  };
}

export async function syncMarketingTaskToGrowthFeed(task: ProductMarketingTaskModel) {
  const externalId = getMarketingTaskExternalId({ taskId: task.id });

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
      kind: GrowthFeedEntryKind.FEED_ITEM,
      dayKey: getDayKeyFromDate(task.scheduledStart),
      sortOrder: 1_000 + task.priority,
      completed: false,
      payload: buildMarketingTaskFeedPayload(task),
    },
    update: {
      dayKey: getDayKeyFromDate(task.scheduledStart),
      sortOrder: 1_000 + task.priority,
      payload: buildMarketingTaskFeedPayload(task),
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
    .filter((externalId) => !todayExternalIds.has(externalId));

  if (staleExternalIds.length > 0) {
    await prisma.productGrowthFeedEntry.deleteMany({
      where: {
        productId,
        externalId: { in: staleExternalIds },
      },
    });
  }

  if (todayTasks.length === 0) {
    return;
  }

  const existingEntries = await prisma.productGrowthFeedEntry.findMany({
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

  const existingExternalIds = new Set(existingEntries.map((entry) => entry.externalId));
  const tasksToSync = todayTasks.filter(
    (task) => !existingExternalIds.has(getMarketingTaskExternalId({ taskId: task.id })),
  );

  await Promise.all(tasksToSync.map((task) => syncMarketingTaskToGrowthFeed(task)));
}
