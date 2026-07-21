import { MarketingAIService } from "@app-template/ai";
import prisma from "@app-template/db";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in the environment. Please add it to apps/web/.env and restart the worker.");
  process.exit(1);
}

const aiService = new MarketingAIService();

async function processLatestTrend() {
  // Find the most recently created trend
  const latestTrend = await prisma.trend.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!latestTrend) {
    console.log("[TaskWorker] No trends found. Waiting...");
    return;
  }

  let products = await prisma.product.findMany({ take: 5 });
  
  if (products.length === 0) {
    console.log("[TaskWorker] No products found. Creating a mock product for testing.");
    const mockProduct = await prisma.product.create({
      data: {
        generalDescription: "A revolutionary AI-powered task manager for busy professionals.",
        plusSides: "Saves time, intelligent prioritization",
        minusSides: "High learning curve",
        mainCompetitors: "Todoist, Notion",
      }
    });
    products = [mockProduct];
  }

  // Run asynchronously for all products
  await Promise.all(products.map(async (product) => {
    // Check if task already exists for this trend and product
    const existingTask = await prisma.productMarketingTask.findFirst({
      where: {
        productId: product.id,
        trendId: latestTrend.id,
      }
    });

    if (existingTask) {
      // We already created a task for this product and trend
      return;
    }

    try {
      const generated = await aiService.generateTaskForProduct(latestTrend.description, product.generalDescription);
      if (!generated) return;

      const task = await prisma.productMarketingTask.create({
        data: {
          productId: product.id,
          trendId: latestTrend.id,
          description: generated.description,
          taskType: generated.taskType,
          priority: generated.priority,
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });

      console.log(`[TaskWorker] Created task for product ${product.id}: ${task.description.substring(0, 50)}...`);
    } catch (err) {
      console.error(`[TaskWorker] Failed to create task for product ${product.id}:`, err);
    }
  }));
}

import { createWorkerLoop } from "@app-template/worker-runner";

const worker = createWorkerLoop({
  name: "TaskWorker",
  intervalMs: 10000,
  setup: async () => {
    console.log("Task worker running on OpenAI (gpt-4o)...");
  },
  task: async () => {
    await processLatestTrend();
  }
});

worker.start();
