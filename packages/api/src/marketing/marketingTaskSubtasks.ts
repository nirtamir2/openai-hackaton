import {
  createMarketingTaskSubtaskId,
  MarketingTaskType,
  parseMarketingTaskSubtasks,
  type MarketingTaskSubtask,
} from "@app-template/db";
export function serializeMarketingTaskSubtasks(subtasks: Array<MarketingTaskSubtask>) {
  return subtasks.map((subtask) => ({
    id: subtask.id,
    text: subtask.text,
    done: subtask.done,
  }));
}

export function normalizeMarketingTaskSubtasks({
  taskType,
  subtasks,
}: {
  taskType: MarketingTaskType;
  subtasks: Array<{ id?: string; text: string; done?: boolean }>;
}): Array<MarketingTaskSubtask> {
  if (taskType !== MarketingTaskType.LONG) {
    return [];
  }

  return subtasks
    .map((subtask) => ({
      id: subtask.id ?? createMarketingTaskSubtaskId(),
      text: subtask.text.trim(),
      done: subtask.done ?? false,
    }))
    .filter((subtask) => subtask.text.length > 0);
}

export function readMarketingTaskSubtasks(value: unknown): Array<MarketingTaskSubtask> {
  return parseMarketingTaskSubtasks(value);
}
