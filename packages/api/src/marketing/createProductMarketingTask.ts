import prisma, {
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db";
import { ORPCError } from "@orpc/server";
import { buildTaskPreviewTitle } from "./buildTaskPreviewTitle";
import { normalizeMarketingTaskSubtasks, serializeMarketingTaskSubtasks } from "./marketingTaskSubtasks";

interface Props {
  productId: string;
  title?: string | null;
  summary?: string | null;
  description: string;
  taskType: MarketingTaskType;
  contentType: MarketingTaskContentType;
  network: MarketingTaskNetwork;
  subtasks?: Array<{ id?: string; text: string; done?: boolean }>;
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

  const subtasks = normalizeMarketingTaskSubtasks({
    taskType: input.taskType,
    subtasks: input.subtasks ?? [],
  });

  const description = input.description.trim();
  const title = input.title?.trim() || buildTaskPreviewTitle({ description });
  const summary = input.summary?.trim() || null;

  return await prisma.productMarketingTask.create({
    data: {
      productId: input.productId,
      title,
      summary,
      description,
      taskType: input.taskType,
      contentType: input.contentType,
      network: input.network,
      subtasks: serializeMarketingTaskSubtasks(subtasks) as never,
      priority: input.priority,
      targetDate: input.targetDate,
      scheduledStart: input.scheduledStart,
      scheduledEnd: input.scheduledEnd,
      trendId: input.trendId ?? null,
    },
  });
}
