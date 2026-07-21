import { marketingTaskDescriptionMaxLength, marketingTaskSubtaskMaxLength } from "@app-template/ai";
import prisma, {
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { buildTaskPreviewTitle } from "../marketing/buildTaskPreviewTitle";
import { createProductMarketingTask } from "../marketing/createProductMarketingTask";
import { normalizeMarketingTaskSubtasks, serializeMarketingTaskSubtasks } from "../marketing/marketingTaskSubtasks";
import { publicProcedure } from "../index";

const taskTypesSchema = z.array(z.enum(MarketingTaskType)).min(1);
const contentTypesSchema = z.array(z.enum(MarketingTaskContentType)).min(1);
const networksSchema = z.array(z.enum(MarketingTaskNetwork)).min(1);
const prioritiesSchema = z.array(z.int().min(1).max(5)).min(1);
const taskDescriptionSchema = z.string().trim().min(1).max(marketingTaskDescriptionMaxLength);

const subtaskSchema = z.object({
  id: z.string().trim().min(1).max(100).optional(),
  text: z.string().trim().min(1).max(marketingTaskSubtaskMaxLength),
  done: z.boolean().optional(),
});

const calendarTasksSchema = z
  .object({
    productId: z.uuid(),
    from: z.coerce.date(),
    to: z.coerce.date(),
    taskTypes: taskTypesSchema.optional(),
    contentTypes: contentTypesSchema.optional(),
    networks: networksSchema.optional(),
    priorities: prioritiesSchema.optional(),
  })
  .refine(({ from, to }) => from < to, {
    message: "to must be after from.",
    path: ["to"],
  });

const createTaskSchema = z
  .object({
    productId: z.uuid(),
    description: taskDescriptionSchema,
    taskType: z.enum(MarketingTaskType),
    contentType: z.enum(MarketingTaskContentType),
    network: z.enum(MarketingTaskNetwork),
    subtasks: z.array(subtaskSchema).max(8).default([]),
    priority: z.int().min(1).max(5),
    targetDate: z.coerce.date(),
    scheduledStart: z.coerce.date(),
    scheduledEnd: z.coerce.date(),
  })
  .refine(({ scheduledStart, scheduledEnd }) => scheduledStart < scheduledEnd, {
    message: "scheduledEnd must be after scheduledStart.",
    path: ["scheduledEnd"],
  });

const updateTaskSchema = z
  .object({
    productId: z.uuid(),
    taskId: z.uuid(),
    description: taskDescriptionSchema.optional(),
    taskType: z.enum(MarketingTaskType).optional(),
    contentType: z.enum(MarketingTaskContentType).optional(),
    network: z.enum(MarketingTaskNetwork).optional(),
    subtasks: z.array(subtaskSchema).max(8).optional(),
    priority: z.int().min(1).max(5).optional(),
    targetDate: z.coerce.date().optional(),
    scheduledStart: z.coerce.date().optional(),
    scheduledEnd: z.coerce.date().optional(),
  })
  .superRefine((input, context) => {
    const hasScheduleStart = input.scheduledStart != null;
    const hasScheduleEnd = input.scheduledEnd != null;
    const hasTaskChanges =
      input.description != null ||
      input.taskType != null ||
      input.contentType != null ||
      input.network != null ||
      input.subtasks != null ||
      input.priority != null ||
      input.targetDate != null;

    if (!hasTaskChanges && !hasScheduleStart && !hasScheduleEnd) {
      context.addIssue({
        code: "custom",
        message: "Provide at least one task or schedule field to update.",
      });
    }

    if (hasScheduleStart !== hasScheduleEnd) {
      context.addIssue({
        code: "custom",
        message: "scheduledStart and scheduledEnd must be updated together.",
        path: hasScheduleStart ? ["scheduledEnd"] : ["scheduledStart"],
      });
    }

    const {scheduledStart} = input;
    const {scheduledEnd} = input;

    if (
      hasScheduleStart &&
      hasScheduleEnd &&
      scheduledStart != null &&
      scheduledEnd != null &&
      scheduledStart >= scheduledEnd
    ) {
      context.addIssue({
        code: "custom",
        message: "scheduledEnd must be after scheduledStart.",
        path: ["scheduledEnd"],
      });
    }
  });

const taskReferenceSchema = z.object({
  productId: z.uuid(),
  taskId: z.uuid(),
});

async function findProductMarketingTask({
  productId,
  taskId,
}: {
  productId: string;
  taskId: string;
}) {
  const task = await prisma.productMarketingTask.findFirst({
    where: {
      id: taskId,
      productId,
    },
  });

  if (task == null) {
    throw new ORPCError("NOT_FOUND");
  }

  return task;
}

export const calendarRouter = {
  getTasks: publicProcedure
    .input(calendarTasksSchema)
    .handler(async ({ input }) => {
      return await prisma.productMarketingTask.findMany({
        where: {
          productId: input.productId,
          scheduledStart: {
            lt: input.to,
          },
          scheduledEnd: {
            gt: input.from,
          },
          taskType: input.taskTypes == null ? undefined : { in: input.taskTypes },
          contentType: input.contentTypes == null ? undefined : { in: input.contentTypes },
          network: input.networks == null ? undefined : { in: input.networks },
          priority: input.priorities == null ? undefined : { in: input.priorities },
        },
        orderBy: [{ scheduledStart: "asc" }, { scheduledEnd: "asc" }],
      });
    }),
  createTask: publicProcedure
    .input(createTaskSchema)
    .handler(async ({ input }) => {
      return await createProductMarketingTask(input);
    }),
  updateTask: publicProcedure
    .input(updateTaskSchema)
    .handler(async ({ input }) => {
      const existingTask = await findProductMarketingTask({
        productId: input.productId,
        taskId: input.taskId,
      });

      const nextTaskType = input.taskType ?? existingTask.taskType;
      const nextTitle =
        input.description == null ? undefined : buildTaskPreviewTitle({ description: input.description });

      return await prisma.productMarketingTask.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: nextTitle,
          description: input.description,
          taskType: input.taskType,
          contentType: input.contentType,
          network: input.network,
          subtasks:
            input.subtasks == null
              ? undefined
              : (serializeMarketingTaskSubtasks(
                  normalizeMarketingTaskSubtasks({
                    taskType: nextTaskType,
                    subtasks: input.subtasks,
                  }),
                ) as never),
          priority: input.priority,
          targetDate: input.targetDate,
          scheduledStart: input.scheduledStart,
          scheduledEnd: input.scheduledEnd,
        },
      });
    }),
  deleteTask: publicProcedure
    .input(taskReferenceSchema)
    .handler(async ({ input }) => {
      await findProductMarketingTask({
        productId: input.productId,
        taskId: input.taskId,
      });

      return await prisma.productMarketingTask.delete({
        where: {
          id: input.taskId,
        },
      });
    }),
};
