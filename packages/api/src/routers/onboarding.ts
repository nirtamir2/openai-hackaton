import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../index";
import { createProductFromOnboarding } from "../onboarding/createProductFromOnboarding";

const onboardingWebsiteSchema = z.object({
  url: z.string().trim().min(1).max(2_048),
  companyDescription: z.string().trim().min(1).max(10_000),
  keyDifferentiators: z.string().trim().min(1).max(10_000),
  competitors: z.string().trim().min(1).max(10_000),
  subreddits: z.string().trim().min(1).max(10_000),
  searchKeywordsX: z.string().trim().min(1).max(10_000),
  searchKeywordsGoogle: z.string().trim().min(1).max(10_000),
  searchKeywordsSeo: z.string().trim().min(1).max(10_000),
});

const onboardingIntegrationsSchema = z.object({
  stripe: z.boolean(),
  mixpanel: z.boolean(),
  metaAds: z.boolean(),
});

const completeOnboardingInputSchema = z.object({
  website: onboardingWebsiteSchema,
  targetMarkets: z.array(z.string().trim().min(1).max(100)).min(1),
  personality: z.array(z.string().trim().min(1).max(100)).min(1),
  channels: z.array(z.string().trim().min(1).max(100)).min(1),
  capacity: z.union([z.string().trim().min(1).max(100), z.null()]),
  integrations: onboardingIntegrationsSchema,
});

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
  completeOnboarding: publicProcedure
    .input(completeOnboardingInputSchema)
    .handler(async ({ input }) => {
      try {
        const product = await createProductFromOnboarding(input);

        return {
          productId: product.id,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to save onboarding configuration.";

        throw new ORPCError("BAD_REQUEST", { message });
      }
    }),
};
