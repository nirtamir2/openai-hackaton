import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../index";

export const onboardingRouter = {
  analyzeWebsite: publicProcedure
    .input(
      z.object({
        url: z.string().trim().min(3).max(2_048),
      }),
    )
    .handler(async ({ input }) => {
      try {
        const { analyzeWebsite } = await import("../onboarding/analyzeWebsite");
        const analysis = await analyzeWebsite({ url: input.url });

        return {
          url: input.url.trim(),
          ...analysis,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Website analysis failed.";

        throw new ORPCError("BAD_REQUEST", { message });
      }
    }),
};
