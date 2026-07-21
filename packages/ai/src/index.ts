import OpenAI from "openai";
import type { TrendType, MarketingTaskType } from "@app-template/db";

export interface GeneratedTrend {
  source: string;
  type: TrendType;
  description: string;
  popularExamples: string[];
}

export interface GeneratedTask {
  description: string;
  taskType: MarketingTaskType;
  priority: number;
}

export class MarketingAIService {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  private parseTrendType(typeString: string): TrendType {
    const typeMap: Record<string, TrendType> = {
      VIDEO: "VIDEO",
      MEME: "MEME",
      TEXT: "TEXT",
      NEWS: "NEWS",
      EVENTS: "EVENTS",
      OTHER: "OTHER",
    };
    return typeMap[typeString.toUpperCase()] || "OTHER";
  }

  async generateTrend(): Promise<GeneratedTrend | null> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a marketing trend analyzer. Generate a plausible, highly specific current marketing trend.",
        },
        {
          role: "user",
          content: `Output a JSON object representing a marketing trend. It must have the following fields:
- source (string): The platform or context where the trend originated (e.g. "TikTok", "LinkedIn", "Industry News").
- type (string): One of "VIDEO", "MEME", "TEXT", "NEWS", "EVENTS", "OTHER".
- description (string): A specific thing, event, or meme that is currently trending (e.g. "Mother's Day", "The Distracted Boyfriend Meme").
- popularExamples (array of strings): 1-3 examples of how companies used this trend (e.g. "Company X made a new advertisement relating to mothers day in this way").`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const data = JSON.parse(content);
    return {
      source: data.source || "Unknown",
      type: this.parseTrendType(data.type || "OTHER"),
      description: data.description || "A new marketing trend.",
      popularExamples: data.popularExamples || [],
    };
  }

  async generateTaskForProduct(trendDescription: string, productDescription: string): Promise<GeneratedTask | null> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a marketing strategist generating a task based on a trend.",
        },
        {
          role: "user",
          content: `Generate a marketing task for the following product based on the trend.
Product Description: ${productDescription}
Trend Description: ${trendDescription}

Output a JSON object with:
- description (string): The marketing task description.
- taskType (string): "SHORT" or "LONG".
- priority (number): 1 to 5.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const data = JSON.parse(content);
    return {
      description: data.description || "Do marketing task.",
      taskType: data.taskType === "LONG" ? "LONG" : "SHORT",
      priority: data.priority || 3,
    };
  }
}
