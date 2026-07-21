import prisma, { GrowthFeedEntryKind, GrowthIdeaStatus } from "@app-template/db";
import type {
  MarketingTaskContentType,
  MarketingTaskNetwork,
} from "@app-template/db";
import { buildIdeaDescription } from "../marketing/buildIdeaDescription";
import { buildTaskPreviewTitle } from "../marketing/buildTaskPreviewTitle";

interface TaskDraft {
  description: string;
  contentType: MarketingTaskContentType;
  network: MarketingTaskNetwork;
  videoHook: string;
  subtasks: Array<{ id: string; text: string; done: boolean }>;
  priority: number;
  targetDate: Date;
  scheduledStart: Date;
  scheduledEnd: Date;
  trendId: string | null;
}

interface Props {
  productId: string;
  task: TaskDraft;
}

export async function createGrowthFeedIdea({ productId, task }: Props) {
  const description = task.description.trim();
  const videoHook = task.videoHook.trim();
  const externalId = `idea-${crypto.randomUUID()}`;

  const payload = {
    title: buildTaskPreviewTitle({ description: videoHook }),
    meta: `Meta video ad · Priority ${String(task.priority)}`,
    description: buildIdeaDescription({ description }),
    videoHook,
    why: "Targets users frustrated with a competitor weakness your product solves.",
    todos: task.subtasks.map((subtask) => ({
      id: subtask.id,
      text: subtask.text,
      done: subtask.done,
    })),
    taskDraft: {
      description,
      contentType: task.contentType,
      network: task.network,
      videoHook,
      subtasks: task.subtasks,
      priority: task.priority,
      targetDate: task.targetDate.toISOString(),
      scheduledStart: task.scheduledStart.toISOString(),
      scheduledEnd: task.scheduledEnd.toISOString(),
      trendId: task.trendId,
    },
  };

  return await prisma.productGrowthFeedEntry.create({
    data: {
      productId,
      externalId,
      kind: GrowthFeedEntryKind.IDEA,
      dayKey: null,
      sortOrder: 500 + task.priority,
      completed: false,
      ideaStatus: GrowthIdeaStatus.PENDING,
      payload,
    },
  });
}
