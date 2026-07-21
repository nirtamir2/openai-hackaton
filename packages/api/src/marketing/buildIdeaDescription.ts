import { normalizeMarketingTaskDescription } from "@app-template/ai";

export function buildIdeaDescription({ description }: { description: string }) {
  return normalizeMarketingTaskDescription({ description });
}
