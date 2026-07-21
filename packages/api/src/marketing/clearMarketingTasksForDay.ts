import prisma, { GrowthFeedEntryKind } from "@app-template/db";
import {
  getMarketingTaskExternalId,
  parseMarketingTaskIdFromExternalId,
} from "../feed/marketingTaskFeedIds";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export type MarketingTaskDayKey = (typeof dayKeys)[number];

export function getMarketingTaskDayKeyFromDate({ date }: { date: Date }): MarketingTaskDayKey {
  return dayKeys[date.getDay()] ?? "mon";
}

export async function clearMarketingTasksForDay({
  productId,
  dayKey,
}: {
  productId: string;
  dayKey: MarketingTaskDayKey;
}) {
  const feedEntries = await prisma.productGrowthFeedEntry.findMany({
    where: {
      productId,
      dayKey,
      kind: GrowthFeedEntryKind.FEED_ITEM,
    },
    select: {
      externalId: true,
    },
  });

  const taskIds = feedEntries.flatMap((entry) => {
    const taskId = parseMarketingTaskIdFromExternalId({ externalId: entry.externalId });

    return taskId == null ? [] : [taskId];
  });

  if (taskIds.length === 0) {
    return { removedCount: 0 };
  }

  const externalIds = taskIds.map((taskId) => getMarketingTaskExternalId({ taskId }));

  await prisma.$transaction([
    prisma.productGrowthFeedEntry.deleteMany({
      where: {
        productId,
        externalId: { in: externalIds },
      },
    }),
    prisma.productMarketingTask.deleteMany({
      where: {
        productId,
        id: { in: taskIds },
      },
    }),
  ]);

  return { removedCount: taskIds.length };
}
