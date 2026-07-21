import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/client";
import { MOCK_PRODUCT_ID, getMockProductData } from "./seed/mockProductData";
import { getMockGrowthFeedData } from "./seed/mockGrowthFeedData";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(currentDirectory, "../../../apps/web/.env"),
});

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl == null || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is missing. Set it in apps/web/.env or your shell environment.");
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({ adapter });
}

async function seedMockProduct() {
  const prisma = createPrismaClient();

  try {
    const mockProductData = getMockProductData();

    await prisma.$transaction(async (transaction) => {
      await transaction.productMarketingTask.deleteMany({
        where: { productId: MOCK_PRODUCT_ID },
      });
      await transaction.productSentiment.deleteMany({
        where: { productId: MOCK_PRODUCT_ID },
      });
      await transaction.product.deleteMany({
        where: { id: MOCK_PRODUCT_ID },
      });

      await transaction.product.create({
        data: {
          id: mockProductData.id,
          generalDescription: mockProductData.generalDescription,
          plusSides: mockProductData.plusSides,
          minusSides: mockProductData.minusSides,
          mainCompetitors: mockProductData.mainCompetitors,
          marketingTasks: {
            create: [...mockProductData.marketingTasks],
          },
          sentiments: {
            create: [...mockProductData.sentiments],
          },
          growthFeedEntries: {
            create: getMockGrowthFeedData().map((entry) => ({
              externalId: entry.externalId,
              kind: entry.kind,
              dayKey: entry.dayKey,
              sortOrder: entry.sortOrder,
              completed: entry.completed,
              ideaStatus: entry.ideaStatus,
              payload: entry.payload,
            })),
          },
        },
      });
    });
  } finally {
    await prisma.$disconnect();
  }
}

void seedMockProduct().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
