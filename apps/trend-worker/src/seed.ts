import { MarketingAIService } from "@app-template/ai";
import prisma from "@app-template/db";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing in the environment. Please add it to apps/web/.env and restart the worker.");
  process.exit(1);
}

const aiService = new MarketingAIService();

async function main() {
  console.log("Seeding 10 trends...");
  for (let i = 0; i < 10; i++) {
    console.log(`Generating trend ${i + 1}/10...`);
    const generated = await aiService.generateTrend();

    if (!generated) {
      console.log("Failed to generate trend.");
      continue;
    }

    const trend = await prisma.trend.create({
      data: {
        source: generated.source,
        type: generated.type,
        description: generated.description,
        popularExamples: generated.popularExamples,
      },
    });

    console.log(`Created new trend: ${trend.description.substring(0, 50)}...`);
  }
  console.log("Done seeding 10 trends.");
}

main().catch(console.error);
