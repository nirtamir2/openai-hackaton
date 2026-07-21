import type { RouterClient } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { generateMarketingTasks } from "@app-template/ai";
import prisma from "@app-template/db";
import { protectedProcedure, publicProcedure } from "../index";
import { getProductSentimentContext } from "../sentiment/getProductSentimentContext";
import { calendarRouter } from "./calendar";
import { onboardingRouter } from "./onboarding";
import { sentimentRouter } from "./sentiment";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session.user,
    };
  }),
  calendar: calendarRouter,
  onboarding: onboardingRouter,
  sentiment: sentimentRouter,
  generateMarketingTasks: protectedProcedure
    .input(z.object({ productId: z.uuid() }))
    .handler(async ({ input }) => {
      const marketSentiment = await getProductSentimentContext({
        productId: input.productId,
      });

      if (marketSentiment == null) {
        throw new ORPCError("NOT_FOUND");
      }

      const generatedTasks = await generateMarketingTasks({
        context: {
          ...marketSentiment,
          trend: null,
        },
        taskCount: 3,
      });
      const marketingTasks = await prisma.productMarketingTask.createManyAndReturn({
        data: generatedTasks.map((task) => ({
          ...task,
          productId: marketSentiment.product.id,
        })),
      });

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
