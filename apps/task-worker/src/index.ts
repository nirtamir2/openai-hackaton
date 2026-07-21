import { generateMarketingTasks, type MarketingTaskGenerationContext } from "@app-template/ai";
import prisma from "@app-template/db";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "OPENAI_API_KEY is missing in the environment. Please add it to apps/web/.env and restart the worker.",
  );
  process.exit(1);
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

async function getTaskGenerationContext({
  productId,
  trend,
}: {
  productId: string;
  trend: {
    source: string;
    type: string;
    description: string;
    popularExamples: string[];
  };
}): Promise<MarketingTaskGenerationContext | null> {
  const since = new Date(Date.now() - TWENTY_FOUR_HOURS_MS);
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      sentiments: {
        where: {
          analyzedAt: {
            gte: since,
          },
        },
        orderBy: {
          analyzedAt: "desc",
        },
      },
      marketingTasks: {
        orderBy: [{ priority: "asc" }, { targetDate: "asc" }],
        take: 10,
      },
    },
  });

  if (product == null) {
    return null;
  }

  return {
    product: {
      generalDescription: product.generalDescription,
      plusSides: product.plusSides,
      minusSides: product.minusSides,
      mainCompetitors: product.mainCompetitors,
    },
    marketingTasks: product.marketingTasks.map((task) => ({
      description: task.description,
      taskType: task.taskType,
      priority: task.priority,
      targetDate: task.targetDate.toISOString(),
    })),
    sentiments: product.sentiments.map((sentiment) => ({
      content: sentiment.content,
      sentimentLabel: sentiment.sentimentLabel,
      sentimentScore: sentiment.sentimentScore,
      confidence: sentiment.confidence,
      source: sentiment.source,
      sourceUrl: sentiment.sourceUrl,
      customerName: sentiment.customerName,
      analyzedAt: sentiment.analyzedAt.toISOString(),
    })),
    trend,
  };
}

async function createTaskForProduct({
  productId,
  trend,
}: {
  productId: string;
  trend: {
    id: string;
    source: string;
    type: string;
    description: string;
    popularExamples: string[];
  };
}) {
  const existingTask = await prisma.productMarketingTask.findFirst({
    where: {
      productId,
      trendId: trend.id,
    },
  });

  if (existingTask != null) {
    return;
  }

  const context = await getTaskGenerationContext({ productId, trend });
  if (context == null) {
    return;
  }

  const [generatedTask] = await generateMarketingTasks({
    context,
    taskCount: 1,
  });

  if (generatedTask == null) {
    throw new Error("The task generator did not return a task.");
  }

  const task = await prisma.productMarketingTask.create({
    data: {
      ...generatedTask,
      productId,
      trendId: trend.id,
    },
  });

  console.log(
    `[TaskWorker] Created task for product ${productId}: ${task.description.substring(0, 50)}...`,
  );
}

async function processLatestTrend() {
  const latestTrend = await prisma.trend.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (latestTrend == null) {
    console.log("[TaskWorker] No trends found. Waiting...");
    return;
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
    },
    take: 5,
  });

  if (products.length === 0) {
    console.log("[TaskWorker] No products found. Waiting...");
    return;
  }

  await Promise.all(
    products.map(async ({ id }) => {
      try {
        await createTaskForProduct({
          productId: id,
          trend: latestTrend,
        });
      } catch (err) {
        console.error(`[TaskWorker] Failed to create task for product ${id}:`, err);
      }
    }),
  );
}

import { createWorkerLoop } from "@app-template/worker-runner";

const worker = createWorkerLoop({
  name: "TaskWorker",
  intervalMs: 10000,
  setup: async () => {
    console.log("Task worker running on OpenAI (gpt-5-mini)...");
  },
  task: async () => {
    await processLatestTrend();
  },
});

worker.start();
