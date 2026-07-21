import { createServiceRouterClient } from "@app-template/api/createServiceRouterClient";
import prisma from "@app-template/db";
import { createWorkerLoop } from "@app-template/worker-runner";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  console.error(
    "OPENAI_API_KEY is missing in the environment. Please add it to apps/web/.env and restart the worker.",
  );
  process.exit(1);
}

const api = createServiceRouterClient();

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

  const result = await api.generateMarketingTasks({
    productId,
    trendId: trend.id,
    taskCount: 1,
  });

  const task = result.marketingTasks[0];

  if (task == null) {
    throw new Error("The task generator did not return a task.");
  }

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
