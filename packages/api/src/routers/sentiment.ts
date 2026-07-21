import { z } from "zod";
import { publicProcedure } from "../index";

export const sentimentRouter = {
  getProductContext: publicProcedure
    .input(
      z.object({
        productId: z.uuid(),
      }),
    )
    .handler(async ({ input }) => {
      const { getProductSentimentContext } = await import(
        "../sentiment/getProductSentimentContext"
      );
      const context = await getProductSentimentContext({ productId: input.productId });

      if (context == null) {
        return null;
      }

      return {
        product: context.product,
        sentimentCount: context.sentiments.length,
        windowStart: context.windowStart,
        windowEnd: context.windowEnd,
        sentiments: context.sentiments,
        marketingTasks: context.marketingTasks,
      };
    }),
};
