import { chat } from "@tanstack/ai";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { z } from "zod";
import { MarketingTaskType } from "@app-template/db";
import { env } from "@app-template/env/server";
import type { ProductSentimentContext } from "../sentiment/getProductSentimentContext";
import { buildMarketingTaskSystemPrompt } from "./buildMarketingTaskSystemPrompt";

interface Props {
  context: ProductSentimentContext;
}

interface MarketingTask {
  description: string;
  taskType: MarketingTaskType;
  priority: number;
  targetDate: Date;
  scheduledStart: Date;
  scheduledEnd: Date;
}

const marketingTaskSchema = z.object({
  description: z.string().min(20).max(500).meta({
    description:
      "A concrete marketing action with a channel or asset, audience, and product-specific evidence. Do not include customer names or URLs.",
  }),
  taskType: z.enum(MarketingTaskType).meta({
    description:
      "SHORT for a focused task completed within 14 days; LONG for a multi-step initiative requiring more than 14 days.",
  }),
  priority: z.number().int().min(1).max(5).meta({
    description: "Urgency from 1 (highest) through 5 (lowest).",
  }),
  targetDate: z.iso.date().meta({
    description: "A future target date in YYYY-MM-DD format, no more than 90 days from today.",
  }),
});

const marketingTaskPlanSchema = z.object({
  tasks: z.array(marketingTaskSchema).length(3),
});

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getLatestTargetDate({ today }: { today: string }) {
  const latestTargetDate = new Date(`${today}T00:00:00.000Z`);
  latestTargetDate.setUTCDate(latestTargetDate.getUTCDate() + 90);
  return latestTargetDate;
}

function isDuplicateDescription({
  description,
  descriptions,
}: {
  description: string;
  descriptions: Set<string>;
}) {
  return descriptions.has(description.trim().toLowerCase());
}

export async function generateMarketingTasks({ context }: Props): Promise<MarketingTask[]> {
  const today = getToday();
  const latestTargetDate = getLatestTargetDate({ today });
  const generatedPlan = await chat({
    adapter: createOpenaiChat("gpt-5-mini", env.OPENAI_API_KEY),
    systemPrompts: [buildMarketingTaskSystemPrompt({ context, today })],
    messages: [
      {
        role: "user",
        content: "Generate the marketing task plan now.",
      },
    ],
    outputSchema: marketingTaskPlanSchema,
    modelOptions: {
      max_output_tokens: 1_200,
    },
  });

  const existingDescriptions = new Set(
    context.marketingTasks.map(({ description }) => description.trim().toLowerCase()),
  );
  const generatedDescriptions = new Set<string>();

  return generatedPlan.tasks.map((task) => {
    const description = task.description.trim();
    const targetDate = new Date(`${task.targetDate}T09:00:00.000Z`);

    if (
      description.length === 0 ||
      Number.isNaN(targetDate.getTime()) ||
      task.targetDate <= today ||
      targetDate > latestTargetDate ||
      isDuplicateDescription({ description, descriptions: existingDescriptions }) ||
      isDuplicateDescription({ description, descriptions: generatedDescriptions })
    ) {
      throw new Error("The generated marketing-task plan did not meet the database contract.");
    }

    generatedDescriptions.add(description.toLowerCase());

    const scheduledStart = targetDate;
    const scheduledEnd = new Date(scheduledStart.getTime() + 60 * 60 * 1000);

    return {
      description,
      taskType: task.taskType,
      priority: task.priority,
      targetDate,
      scheduledStart,
      scheduledEnd,
    };
  });
}
