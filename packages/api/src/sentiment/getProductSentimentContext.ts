import prisma from "@app-template/db";
import { readProductMarketingProfile } from "../marketing/readProductMarketingProfile";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export async function getProductSentimentContext({ productId }: { productId: string }) {
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
      id: product.id,
      generalDescription: product.generalDescription,
      plusSides: product.plusSides,
      minusSides: product.minusSides,
      mainCompetitors: product.mainCompetitors,
      competitorWeaknesses: product.competitorWeaknesses,
    },
    marketingProfile: readProductMarketingProfile({
      websiteUrl: product.websiteUrl,
      onboardingConfig: product.onboardingConfig,
    }),
    marketingTasks: product.marketingTasks.map((task) => ({
      description: task.description,
      taskType: task.taskType,
      contentType: task.contentType,
      network: task.network,
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
    windowStart: since.toISOString(),
    windowEnd: new Date().toISOString(),
  };
}

export type ProductSentimentContext = NonNullable<
  Awaited<ReturnType<typeof getProductSentimentContext>>
>;
