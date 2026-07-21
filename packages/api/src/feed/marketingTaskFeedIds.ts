const marketingTaskExternalIdPrefix = "marketing-task-";

export function getMarketingTaskExternalId({ taskId }: { taskId: string }) {
  return `${marketingTaskExternalIdPrefix}${taskId}`;
}

export function parseMarketingTaskIdFromExternalId({ externalId }: { externalId: string }) {
  if (!externalId.startsWith(marketingTaskExternalIdPrefix)) {
    return null;
  }

  const taskId = externalId.slice(marketingTaskExternalIdPrefix.length);

  return taskId.length > 0 ? taskId : null;
}
