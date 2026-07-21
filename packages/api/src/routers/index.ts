import type { RouterClient } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { generateMarketingTasks } from "@app-template/ai";
import prisma, { MarketingTaskType } from "@app-template/db";
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
      }),
    )
    .handler(async ({ input }) => {
      if (input.forToday) {
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

      const generatedTasks = await generateMarketingTasks({
        context: {
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
        },
        taskCount: input.taskCount,
        forToday: input.forToday,
      });

      let longTasks = generatedTasks.filter(
        (task) => task.taskType === MarketingTaskType.LONG,
      );

      if (longTasks.length === 0) {
        const ideaTasks = await generateMarketingTasks({
          context: {
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
          },
          taskCount: 1,
          forToday: false,
        });

        longTasks = ideaTasks.filter((task) => task.taskType === MarketingTaskType.LONG);
      }

      const shortTasks = generatedTasks.filter(
        (task) => task.taskType === MarketingTaskType.SHORT,
      );

      const marketingTasks = await Promise.all(
        shortTasks.map(async (task) =>
          createProductMarketingTask({
            ...task,
            productId: marketSentiment.product.id,
            trendId: input.trendId ?? null,
          }),
        ),
      );

      const draftContext = {
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

      await Promise.all(
        marketingTasks.map(async (task) => syncMarketingTaskToGrowthFeed(task, draftContext)),
      );

      const ideas = await Promise.all(
        longTasks.map(async (task) =>
          createGrowthFeedIdea({
            productId: marketSentiment.product.id,
            task: {
              ...task,
              trendId: input.trendId ?? null,
            },
          }),
        ),
      );

      const lastGeneratedAt = new Date();

      await prisma.product.update({
        where: {
          id: marketSentiment.product.id,
        },
        data: {
          marketingTasksGeneratedAt: lastGeneratedAt,
        },
      });

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
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
