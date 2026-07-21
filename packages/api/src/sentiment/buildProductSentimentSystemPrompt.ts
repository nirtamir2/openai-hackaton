import type { ProductSentimentContext } from "./getProductSentimentContext";

export function buildProductSentimentSystemPrompt(context: ProductSentimentContext) {
  const sentimentSummary =
    context.sentiments.length === 0
      ? "No customer sentiment was recorded in the last 24 hours."
      : context.sentiments
          .map((sentiment, index) => {
            const customer =
              sentiment.customerName != null && sentiment.customerName.length > 0
                ? sentiment.customerName
                : "Unknown customer";
            return [
              `${String(index + 1)}. [${sentiment.sentimentLabel}] score=${sentiment.sentimentScore.toFixed(2)} confidence=${sentiment.confidence.toFixed(2)} source=${sentiment.source}`,
              `   customer: ${customer}`,
              `   analyzedAt: ${sentiment.analyzedAt}`,
              `   content: ${sentiment.content}`,
            ].join("\n");
          })
          .join("\n\n");

  const marketingTasksSummary =
    context.marketingTasks.length === 0
      ? "No active marketing tasks on file."
      : context.marketingTasks
          .map(
            (task, index) =>
              `${String(index + 1)}. [${task.taskType}] priority=${String(task.priority)} target=${task.targetDate} — ${task.description}`,
          )
          .join("\n");

  return [
    "You are a product marketing analyst helping the team understand recent customer sentiment.",
    "Use only the product context and sentiment data below. If data is missing, say so clearly.",
    "Highlight trends, risks, opportunities, and actionable recommendations tied to the product positioning.",
    "",
    `Analysis window: ${context.windowStart} to ${context.windowEnd} (last 24 hours)`,
    "",
    "Product context:",
    `- Description: ${context.product.generalDescription}`,
    `- Strengths: ${context.product.plusSides}`,
    `- Weaknesses: ${context.product.minusSides}`,
    `- Main competitors: ${context.product.mainCompetitors}`,
    "",
    "Marketing tasks:",
    marketingTasksSummary,
    "",
    `Recent sentiment (${String(context.sentiments.length)} records):`,
    sentimentSummary,
  ].join("\n");
}
