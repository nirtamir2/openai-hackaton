import { normalizeMarketingTaskTitle } from "@app-template/ai";

export function buildTaskPreviewTitle({ description }: { description: string }) {
  return normalizeMarketingTaskTitle({ title: description });
}
