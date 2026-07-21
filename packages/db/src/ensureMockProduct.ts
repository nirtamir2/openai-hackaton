import type { PrismaClient } from "../prisma/generated/client";
import type { Prisma } from "../prisma/generated/client";
import { getMockGrowthFeedData } from "../prisma/seed/mockGrowthFeedData";
import { getMockProductData } from "../prisma/seed/mockProductData";
import { MOCK_PRODUCT_ID } from "./mockProductId";

interface Props {
  productId: string;
  prisma: PrismaClient;
}

export async function ensureMockProduct({ productId, prisma }: Props) {
  if (productId !== MOCK_PRODUCT_ID) {
    return false;
  }

  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (existingProduct != null) {
    return true;
  }

  const mockProductData = getMockProductData();

  await prisma.product.create({
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
          payload: entry.payload as Prisma.InputJsonValue,
        })),
      },
    },
  });

  return true;
}
