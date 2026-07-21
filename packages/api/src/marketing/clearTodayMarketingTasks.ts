import { clearMarketingTasksForDay, getMarketingTaskDayKeyFromDate } from "./clearMarketingTasksForDay";

export async function clearTodayMarketingTasks({ productId }: { productId: string }) {
  await clearMarketingTasksForDay({
    productId,
    dayKey: getMarketingTaskDayKeyFromDate({ date: new Date() }),
  });
}
