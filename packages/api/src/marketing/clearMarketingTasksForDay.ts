import prisma, { GrowthFeedEntryKind } from "@app-template/db";
import {
  getMarketingTaskExternalId,
  parseMarketingTaskIdFromExternalId,
} from "../feed/marketingTaskFeedIds";
import {
  getDayKeyFromDate,
  type MarketingTaskDayKey,
} from "./marketingTaskDates";

export type { MarketingTaskDayKey };

export function getMarketingTaskDayKeyFromDate({ date }: { date: Date }): MarketingTaskDayKey {
  return getDayKeyFromDate({ date });
}

export async function clearMarketingTasksForDay({
  productId,
  dayKey,
}: {
  productId: string;
  dayKey: MarketingTaskDayKey;
}) {
  const [feedEntries, ideaEntries, projectEntries] = await Promise.all([
    prisma.productGrowthFeedEntry.findMany({
      where: {
        productId,
        dayKey,
        kind: GrowthFeedEntryKind.FEED_ITEM,
      },
      select: {
        externalId: true,
      },
    }),
    prisma.productGrowthFeedEntry.findMany({
      where: {
        productId,
        kind: GrowthFeedEntryKind.IDEA,
      },
      select: {
        externalId: true,
      },
    }),
    prisma.productGrowthFeedEntry.findMany({
      where: {
        productId,
        kind: GrowthFeedEntryKind.PROJECT,
      },
      select: {
        externalId: true,
      },
    }),
  ]);

  const shortTaskIds = feedEntries.flatMap((entry) => {
    const taskId = parseMarketingTaskIdFromExternalId({ externalId: entry.externalId });

    return taskId == null ? [] : [taskId];
  });

  const longTaskIds = projectEntries.flatMap((entry) => {
    const taskId = parseMarketingTaskIdFromExternalId({ externalId: entry.externalId });

    return taskId == null ? [] : [taskId];
  });

  const marketingTaskIds = [...shortTaskIds, ...longTaskIds];
  const feedExternalIds = [
    ...marketingTaskIds.map((taskId) => getMarketingTaskExternalId({ taskId })),
    ...ideaEntries.map((entry) => entry.externalId),
  ];

  const removedCount = feedEntries.length + ideaEntries.length + projectEntries.length;

  if (removedCount === 0) {
    return { removedCount: 0 };
  }

  const operations = [
    prisma.productGrowthFeedEntry.deleteMany({
      where: {
        productId,
        externalId: { in: feedExternalIds },
      },
    }),
  ];

  if (marketingTaskIds.length > 0) {
    operations.push(
      prisma.productMarketingTask.deleteMany({
        where: {
          productId,
          id: { in: marketingTaskIds },
        },
      }),
    );
  }

  await prisma.$transaction(operations);

  return { removedCount };
}
