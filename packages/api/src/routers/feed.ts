import prisma, { GrowthFeedEntryKind, GrowthIdeaStatus } from "@app-template/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { mapGrowthFeedEntries } from "../feed/mapGrowthFeedEntries";
import { publicProcedure } from "../index";

const productIdSchema = z.object({
  productId: z.uuid(),
});

const entryReferenceSchema = z.object({
  productId: z.uuid(),
  entryId: z.string().trim().min(1).max(100),
});

function readTodoDone(value: unknown) {
  if (typeof value !== "object" || value == null || Array.isArray(value)) {
    return {};
  }

  const todoDone: Record<string, boolean> = {};

  for (const [key, done] of Object.entries(value)) {
    if (typeof done === "boolean") {
      todoDone[key] = done;
    }
  }

  return todoDone;
}

async function findGrowthFeedEntry({
  productId,
  entryId,
}: {
  productId: string;
  entryId: string;
}) {
  const entry = await prisma.productGrowthFeedEntry.findFirst({
    where: {
      productId,
      externalId: entryId,
    },
  });

  if (entry == null) {
    throw new ORPCError("NOT_FOUND");
  }

  return entry;
}

export const feedRouter = {
  getFeed: publicProcedure.input(productIdSchema).handler(async ({ input }) => {
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      select: { id: true },
    });

    if (product == null) {
      throw new ORPCError("NOT_FOUND");
    }

    const entries = await prisma.productGrowthFeedEntry.findMany({
      where: { productId: input.productId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return mapGrowthFeedEntries(entries);
  }),
  setItemCompleted: publicProcedure
    .input(
      entryReferenceSchema.extend({
        completed: z.boolean(),
      }),
    )
    .handler(async ({ input }) => {
      await findGrowthFeedEntry({
        productId: input.productId,
        entryId: input.entryId,
      });

      await prisma.productGrowthFeedEntry.updateMany({
        where: {
          productId: input.productId,
          externalId: input.entryId,
        },
        data: {
          completed: input.completed,
        },
      });

      return { entryId: input.entryId, completed: input.completed };
    }),
  setIdeaStatus: publicProcedure
    .input(
      entryReferenceSchema.extend({
        status: z.enum(GrowthIdeaStatus),
      }),
    )
    .handler(async ({ input }) => {
      const entry = await findGrowthFeedEntry({
        productId: input.productId,
        entryId: input.entryId,
      });

      if (entry.kind !== GrowthFeedEntryKind.IDEA) {
        throw new ORPCError("BAD_REQUEST", { message: "Entry is not an idea." });
      }

      await prisma.productGrowthFeedEntry.updateMany({
        where: {
          productId: input.productId,
          externalId: input.entryId,
        },
        data: {
          ideaStatus: input.status,
        },
      });

      return { entryId: input.entryId, status: input.status };
    }),
  setTodoDone: publicProcedure
    .input(
      entryReferenceSchema.extend({
        todoId: z.string().trim().min(1).max(100),
        done: z.boolean(),
      }),
    )
    .handler(async ({ input }) => {
      const entry = await findGrowthFeedEntry({
        productId: input.productId,
        entryId: input.entryId,
      });

      const todoDone = readTodoDone(entry.todoDone);
      todoDone[`${input.entryId}:${input.todoId}`] = input.done;

      await prisma.productGrowthFeedEntry.updateMany({
        where: {
          productId: input.productId,
          externalId: input.entryId,
        },
        data: {
          todoDone,
        },
      });

      return {
        entryId: input.entryId,
        todoId: input.todoId,
        done: input.done,
      };
    }),
};
