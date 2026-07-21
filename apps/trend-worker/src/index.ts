import { MarketingAIService } from "@app-template/ai";
import prisma from "@app-template/db";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in the environment. Please add it to apps/web/.env and restart the worker.");
  process.exit(1);
}

const aiService = new MarketingAIService();

async function createTrend() {
  console.log("[TrendWorker] Generating new trend...");
  const generated = await aiService.generateTrend();

  if (!generated) {
    console.log("[TrendWorker] Failed to generate trend.");
    return null;
  }

  const trend = await prisma.trend.create({
    data: {
      source: generated.source,
      type: generated.type,
      description: generated.description,
      popularExamples: generated.popularExamples,
    },
  });

  console.log(`[TrendWorker] Created new trend: ${trend.description.substring(0, 50)}...`);
  return trend;
}

async function cleanupOldTrends() {
  const twoMinutesAgo = new Date(Date.now() - 120 * 1000);
  const deleted = await prisma.trend.deleteMany({
    where: {
      createdAt: {
        lt: twoMinutesAgo,
      },
    },
  });

  if (deleted.count > 0) {
    console.log(`[TrendWorker] Cleanup: Deleted ${deleted.count} old trends.`);
  }
}

import { createWorkerLoop } from "@app-template/worker-runner";

const worker = createWorkerLoop({
  name: "TrendWorker",
  intervalMs: 10000,
  setup: async () => {
    console.log("Trend worker running on OpenAI (gpt-4o)...");
  },
  task: async () => {
    await cleanupOldTrends();
    await createTrend();
  }
});

worker.start();
