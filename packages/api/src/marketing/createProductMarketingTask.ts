import prisma, { MarketingTaskType } from "@app-template/db";
import { ORPCError } from "@orpc/server";

interface Props {
  productId: string;
  description: string;
  taskType: MarketingTaskType;
  priority: number;
  targetDate: Date;
  scheduledStart: Date;
  scheduledEnd: Date;
  trendId?: string | null;
}

export async function createProductMarketingTask(input: Props) {
  if (input.scheduledStart >= input.scheduledEnd) {
    throw new ORPCError("BAD_REQUEST", {
      message: "scheduledEnd must be after scheduledStart.",
    });
  }

  const product = await prisma.product.findUnique({
    where: {
      id: input.productId,
    },
    select: {
      id: true,
    },
  });

  if (product == null) {
    throw new ORPCError("NOT_FOUND");
  }

  return await prisma.productMarketingTask.create({
    data: {
      productId: input.productId,
      description: input.description.trim(),
      taskType: input.taskType,
      priority: input.priority,
      targetDate: input.targetDate,
      scheduledStart: input.scheduledStart,
      scheduledEnd: input.scheduledEnd,
      trendId: input.trendId ?? null,
    },
  });
}
