import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/client";
import { getMockSentimentData } from "./seed/mockSentimentData";
import { getMockTrendData } from "./seed/mockTrendData";
import { SEED_PRODUCT_ID } from "./seed/seedProductId";

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

async function seedTrends(prisma: PrismaClient) {
  const mockTrendData = getMockTrendData();

  await prisma.trend.deleteMany();

  await prisma.trend.createMany({
    data: mockTrendData.map((trend) => ({
      source: trend.source,
      type: trend.type,
      description: trend.description,
      popularExamples: [...trend.popularExamples],
    })),
  });
}

async function seedMarketSentiment(prisma: PrismaClient) {
  const mockSentimentData = getMockSentimentData();

  await prisma.$transaction(async (transaction) => {
    await transaction.productSentiment.deleteMany({
      where: { productId: SEED_PRODUCT_ID },
    });
    await transaction.product.deleteMany({
      where: { id: SEED_PRODUCT_ID },
    });

    await transaction.product.create({
      data: {
        id: SEED_PRODUCT_ID,
        generalDescription:
          "Nimbus Analytics is a B2B product analytics platform that helps growth teams track user journeys, build conversion funnels, and surface retention insights without writing SQL.",
        plusSides:
          "Fast onboarding, intuitive funnel builder, strong cohort analysis, and a generous free tier for early-stage startups.",
        minusSides:
          "Limited mobile SDK coverage, advanced segmentation is locked behind higher tiers, and export options are basic on lower plans.",
        mainCompetitors: "Mixpanel, Amplitude, Heap, PostHog",
        competitorWeaknesses:
          "Mixpanel has a steep learning curve for non-technical teams, Amplitude locks advanced cohort analysis behind expensive enterprise tiers, Heap requires heavy implementation before insights appear, PostHog self-hosting adds operational overhead for small teams",
        sentiments: {
          create: [...mockSentimentData],
        },
      },
    });
  });
}

async function seedDatabase() {
  const prisma = createPrismaClient();

  try {
    await seedTrends(prisma);
    await seedMarketSentiment(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

void seedDatabase().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
