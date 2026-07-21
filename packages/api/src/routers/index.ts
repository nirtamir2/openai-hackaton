import type { RouterClient } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { generateMarketingTasks } from "@app-template/ai";
import prisma from "@app-template/db";
import { publicProcedure } from "../index";
import { syncMarketingTaskToGrowthFeed } from "../feed/syncMarketingTasksToGrowthFeed";
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
      }),
    )
    .handler(async ({ input }) => {
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
      });
      const marketingTasks = await Promise.all(
        generatedTasks.map(async (task) =>
          createProductMarketingTask({
            ...task,
            productId: marketSentiment.product.id,
            trendId: input.trendId ?? null,
          }),
        ),
      );

      await Promise.all(
        marketingTasks.map(async (task) => syncMarketingTaskToGrowthFeed(task)),
      );

      return {
        productId: marketSentiment.product.id,
        sentimentWindow: {
          start: marketSentiment.windowStart,
          end: marketSentiment.windowEnd,
        },
        marketingTasks,
      };
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
