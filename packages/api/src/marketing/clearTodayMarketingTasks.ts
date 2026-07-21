import prisma from "@app-template/db";
import { getMarketingTaskExternalId } from "../feed/marketingTaskFeedIds";
import { isScheduledForToday } from "../marketing/marketingTaskDates";

export async function clearTodayMarketingTasks({ productId }: { productId: string }) {
  const tasks = await prisma.productMarketingTask.findMany({
    where: { productId },
    select: { id: true, scheduledStart: true },
  });

  const todayTaskIds = tasks
    .filter((task) => isScheduledForToday({ date: task.scheduledStart }))
    .map((task) => task.id);

  if (todayTaskIds.length === 0) {
    return;
  }

  const externalIds = todayTaskIds.map((taskId) => getMarketingTaskExternalId({ taskId }));

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
        id: { in: todayTaskIds },
      },
    }),
  ]);
}
