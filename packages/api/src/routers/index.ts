import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { analyzeCompany } from "../functions/analyzeCompany";
import { protectedProcedure, publicProcedure } from "../index";
import { productProfileRouter } from "./productProfile";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  analyzeCompany: publicProcedure
    .input(
      z.object({
        website: z.url(),
      }),
    )
    .handler(async ({ input }) => {
      return await analyzeCompany({ website: input.website });
    }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session.user,
    };
  }),
  productProfile: productProfileRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
