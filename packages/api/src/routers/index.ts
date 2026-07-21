import type { RouterClient } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import type { GeneratedMarketingTask } from "@app-template/ai";
import { generateMarketingTasks } from "@app-template/ai";
import prisma, { MarketingTaskContentType, MarketingTaskType } from "@app-template/db";
import { publicProcedure } from "../index";
import { createGrowthFeedIdea } from "../feed/createGrowthFeedIdea";
import { syncMarketingTaskToGrowthFeed } from "../feed/syncMarketingTasksToGrowthFeed";
import { clearTodayMarketingTasks } from "../marketing/clearTodayMarketingTasks";
import { createProductMarketingTask } from "../marketing/createProductMarketingTask";
import { getProductSentimentContext } from "../sentiment/getProductSentimentContext";
import { calendarRouter } from "./calendar";
import { feedRouter } from "./feed";
import { onboardingRouter } from "./onboarding";
import { sentimentRouter } from "./sentiment";

function isVideoIdeaTask(task: GeneratedMarketingTask) {
  return (
    task.taskType === MarketingTaskType.LONG &&
    task.contentType === MarketingTaskContentType.VIDEO &&
    task.videoHook != null &&
    task.videoHook.length >= 10
  );
}

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: publicProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user ?? null,
    };
  }),
  calendar: calendarRouter,
  feed: feedRouter,
  onboarding: onboardingRouter,
  sentiment: sentimentRouter,
  generateMarketingTasks: publicProcedure
    .input(
      z.object({
        productId: z.uuid(),
        trendId: z.uuid().optional(),
        taskCount: z.union([z.literal(1), z.literal(3)]).default(3),
        forToday: z.boolean().default(true),
        scope: z.enum(["all", "tasks", "ideas"]).default("all"),
      }),
    )
    .handler(async ({ input }) => {
      try {
      const shouldGenerateTasks = input.scope === "all" || input.scope === "tasks";
      const shouldGenerateIdeas = input.scope === "all" || input.scope === "ideas";

      if (input.forToday && shouldGenerateTasks) {
        await clearTodayMarketingTasks({ productId: input.productId });
      }

      const marketSentiment = await getProductSentimentContext({
        productId: input.productId,
      });

      if (marketSentiment == null) {
        throw new ORPCError("NOT_FOUND");
      }

      const trend =
        input.trendId == null
          ? null
          : await prisma.trend.findUnique({
              where: {
                id: input.trendId,
              },
            });

      if (input.trendId != null && trend == null) {
        throw new ORPCError("NOT_FOUND");
      }

      const generationContext = {
        product: marketSentiment.product,
        marketingProfile: marketSentiment.marketingProfile,
        marketingTasks: marketSentiment.marketingTasks,
        sentiments: marketSentiment.sentiments,
        trend:
          trend == null
            ? null
            : {
                source: trend.source,
                type: trend.type,
                description: trend.description,
                popularExamples: trend.popularExamples,
              },
      };

      const [generatedTasks, ideaTasks] = await Promise.all([
        shouldGenerateTasks
          ? generateMarketingTasks({
              context: generationContext,
              taskCount: input.taskCount,
              forToday: input.forToday,
            })
          : Promise.resolve([]),
        shouldGenerateIdeas
          ? generateMarketingTasks({
              context: generationContext,
              taskCount: input.taskCount,
              forIdea: true,
            })
          : Promise.resolve([]),
      ]);

      const shortTasks = generatedTasks.filter(
        (task) => task.taskType === MarketingTaskType.SHORT,
      );
      const longTasks = ideaTasks.filter((task) => isVideoIdeaTask(task));

      if (shouldGenerateTasks && shortTasks.length !== input.taskCount) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `Expected ${String(input.taskCount)} tasks but generated ${String(shortTasks.length)}.`,
        });
      }

      if (shouldGenerateIdeas && longTasks.length !== input.taskCount) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: `Expected ${String(input.taskCount)} ideas but generated ${String(longTasks.length)}.`,
        });
      }

      const marketingTasks = shouldGenerateTasks
        ? await Promise.all(
            shortTasks.map(async (task) =>
              createProductMarketingTask({
                productId: marketSentiment.product.id,
                title: task.title,
                description: task.description,
                taskType: task.taskType,
                contentType: task.contentType,
                network: task.network,
                subtasks: task.subtasks,
                priority: task.priority,
                targetDate: task.targetDate,
                scheduledStart: task.scheduledStart,
                scheduledEnd: task.scheduledEnd,
                trendId: input.trendId ?? null,
              }),
            ),
          )
        : [];

      if (shouldGenerateTasks) {
        await Promise.all(
          marketingTasks.map(async (task) => syncMarketingTaskToGrowthFeed(task, null)),
        );
      }

      const ideas = shouldGenerateIdeas
        ? await Promise.all(
            longTasks.map(async (task) =>
              createGrowthFeedIdea({
                productId: marketSentiment.product.id,
                task: {
                  title: task.title,
                  description: task.description,
                  contentType: task.contentType,
                  network: task.network,
                  videoHook: task.videoHook ?? "",
                  subtasks: task.subtasks,
                  priority: task.priority,
                  targetDate: task.targetDate,
                  scheduledStart: task.scheduledStart,
                  scheduledEnd: task.scheduledEnd,
                  trendId: input.trendId ?? null,
                },
              }),
            ),
          )
        : [];

      const lastGeneratedAt = new Date();

      if (shouldGenerateTasks) {
        await prisma.product.update({
          where: {
            id: marketSentiment.product.id,
          },
          data: {
            marketingTasksGeneratedAt: lastGeneratedAt,
          },
        });
      }

      return {
        productId: marketSentiment.product.id,
        sentimentWindow: {
          start: marketSentiment.windowStart,
          end: marketSentiment.windowEnd,
        },
        marketingTasks,
        ideas,
        lastGeneratedAt: lastGeneratedAt.toISOString(),
      };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Marketing task generation failed.";

        throw new ORPCError("INTERNAL_SERVER_ERROR", { message });
      }
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
