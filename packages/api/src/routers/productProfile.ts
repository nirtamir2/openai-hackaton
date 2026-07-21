import { ORPCError } from "@orpc/server";
import { z } from "zod";
import prisma from "@app-template/db";
import { analyzeWebsite } from "../analyzeWebsite";
import { protectedProcedure } from "../index";
import { normalizeWebsiteUrl } from "../normalizeWebsiteUrl";
import { productProfileSchema } from "../productProfileSchema";

const analyzeWebsiteInputSchema = z.object({
  websiteUrl: z.string().trim().min(1).max(2048),
});

function normalizeInputWebsiteUrl({ value }: { value: string }): string {
  try {
    return normalizeWebsiteUrl({ value });
  } catch (error) {
    throw new ORPCError("BAD_REQUEST", {
      message: error instanceof Error ? error.message : "Enter a valid website address.",
    });
  }
}

const getProductProfile = protectedProcedure.handler(async ({ context }) => {
  return await prisma.productProfile.findUnique({
    where: { userId: context.session.user.id },
  });
});

const analyzeProductWebsite = protectedProcedure
  .input(analyzeWebsiteInputSchema)
  .handler(async ({ input }) => {
    const websiteUrl = normalizeInputWebsiteUrl({ value: input.websiteUrl });

    try {
      return await analyzeWebsite({ websiteUrl });
    } catch {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "We could not build a reliable profile from that website. Try again shortly.",
      });
    }
  });

const saveProductProfile = protectedProcedure
  .input(productProfileSchema)
  .handler(async ({ context, input }) => {
    return await prisma.productProfile.upsert({
      where: { userId: context.session.user.id },
      create: {
        ...input,
        userId: context.session.user.id,
      },
      update: input,
    });
  });

export const productProfileRouter = {
  get: getProductProfile,
  analyze: analyzeProductWebsite,
  save: saveProductProfile,
};
