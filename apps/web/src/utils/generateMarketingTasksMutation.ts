import { orpc } from "@/utils/orpc";

export const generateMarketingTasksMutationKey = ["generateMarketingTasks", "tasks"] as const;
export const generateMarketingIdeasMutationKey = ["generateMarketingTasks", "ideas"] as const;

export function getGenerateMarketingTasksMutationOptions(
  options?: Parameters<typeof orpc.generateMarketingTasks.mutationOptions>[0],
) {
  const baseOptions = orpc.generateMarketingTasks.mutationOptions(options);

  return {
    ...baseOptions,
    mutationKey: generateMarketingTasksMutationKey,
  };
}

export function getGenerateMarketingIdeasMutationOptions(
  options?: Parameters<typeof orpc.generateMarketingTasks.mutationOptions>[0],
) {
  const baseOptions = orpc.generateMarketingTasks.mutationOptions(options);

  return {
    ...baseOptions,
    mutationKey: generateMarketingIdeasMutationKey,
  };
}
