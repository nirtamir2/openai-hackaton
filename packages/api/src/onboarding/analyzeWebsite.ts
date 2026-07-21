import { chat } from "@tanstack/ai";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { z } from "zod";
import { env } from "@app-template/env/server";
import { buildWebsiteAnalysisSystemPrompt } from "./buildWebsiteAnalysisSystemPrompt";
import { fetchWebsiteContent } from "./fetchWebsiteContent";
import { normalizeWebsiteUrl } from "./normalizeWebsiteUrl";

const generatedOptionSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/)
    .meta({
      description: "Stable kebab-case identifier for the option.",
    }),
  title: z.string().min(1).max(80).meta({
    description: "Short label shown as the primary option title.",
  }),
  subtitle: z.string().min(1).max(160).meta({
    description: "One sentence on why this is a strong focus or voice choice for this company.",
  }),
});

const websiteAnalysisSchema = z.object({
  companyDescription: z.string().min(1).max(1_000).meta({
    description: "One or two sentences describing what the company does and who it serves.",
  }),
  keyDifferentiators: z.string().min(1).max(900).meta({
    description:
      "Exactly 3-4 comma-separated differentiators. Each item should be a slightly longer phrase (about 8-20 words) explaining what sets the product apart. Do not use commas inside individual items.",
  }),
  competitors: z.string().min(1).max(300).meta({
    description: "Comma-separated list of the most relevant direct competitors.",
  }),
  subreddits: z.string().min(1).max(300).meta({
    description: "Comma-separated relevant subreddits with r/ prefixes.",
  }),
  searchKeywordsX: z.string().min(1).max(500).meta({
    description: "Comma-separated search keywords and phrases useful on X.",
  }),
  searchKeywordsGoogle: z.string().min(1).max(500).meta({
    description: "Comma-separated paid-search keyword themes for Google Ads.",
  }),
  searchKeywordsSeo: z.string().min(1).max(500).meta({
    description: "Comma-separated SEO keyword themes and informational queries.",
  }),
  targetMarketOptions: z.array(generatedOptionSchema).min(4).max(7).meta({
    description:
      "Audience focus options the founder can choose to reach or prioritize — not definitive customer definitions.",
  }),
  suggestedTargetMarkets: z.array(z.string()).min(1).max(5).meta({
    description: "IDs from targetMarketOptions that are the strongest default focus areas to reach.",
  }),
  personalityOptions: z.array(generatedOptionSchema).min(4).max(7).meta({
    description: "Brand voice options the founder can choose to lead with in marketing.",
  }),
  suggestedPersonality: z.array(z.string()).min(1).max(4).meta({
    description: "IDs from personalityOptions that are the strongest default voice to lead with.",
  }),
});

export type WebsiteAnalysisResult = z.infer<typeof websiteAnalysisSchema>;

interface Props {
  url: string;
}

function extractJsonObject({ text }: { text: string }) {
  const trimmedText = text.trim();
  const fenceStart = trimmedText.indexOf("```");

  let candidate = trimmedText;

  if (fenceStart !== -1) {
    const fenceEnd = trimmedText.indexOf("```", fenceStart + 3);

    if (fenceEnd !== -1) {
      candidate = trimmedText.slice(fenceStart + 3, fenceEnd).trim();

      if (candidate.toLowerCase().startsWith("json")) {
        candidate = candidate.slice(4).trim();
      }
    }
  }

  const startIndex = candidate.indexOf("{");
  const endIndex = candidate.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error("Website analysis did not return valid JSON.");
  }

  return JSON.parse(candidate.slice(startIndex, endIndex + 1)) as unknown;
}

async function analyzeWebsiteWithStructuredOutput({
  normalizedUrl,
  websiteContent,
}: {
  normalizedUrl: string;
  websiteContent: string | null;
}) {
  return await chat({
    adapter: createOpenaiChat("gpt-5-mini", env.OPENAI_API_KEY),
    systemPrompts: [
      buildWebsiteAnalysisSystemPrompt({
        url: normalizedUrl,
        websiteContent,
      }),
    ],
    messages: [
      {
        role: "user",
        content: "Analyze this website and generate the onboarding fields now.",
      },
    ],
    outputSchema: websiteAnalysisSchema,
    modelOptions: {
      max_output_tokens: 4_000,
    },
  });
}

async function analyzeWebsiteWithJsonFallback({
  normalizedUrl,
  websiteContent,
}: {
  normalizedUrl: string;
  websiteContent: string | null;
}) {
  const responseText = await chat({
    adapter: createOpenaiChat("gpt-5-mini", env.OPENAI_API_KEY),
    systemPrompts: [
      buildWebsiteAnalysisSystemPrompt({
        url: normalizedUrl,
        websiteContent,
      }),
      [
        "Return only a single JSON object with these exact keys:",
        "companyDescription, keyDifferentiators, competitors, subreddits, searchKeywordsX, searchKeywordsGoogle, searchKeywordsSeo, targetMarketOptions, suggestedTargetMarkets, personalityOptions, suggestedPersonality.",
        "Do not include markdown fences or commentary.",
      ].join("\n"),
    ],
    messages: [
      {
        role: "user",
        content: "Analyze this website and generate the onboarding fields now.",
      },
    ],
    stream: false,
    modelOptions: {
      max_output_tokens: 4_000,
    },
  });

  const parsedJson = extractJsonObject({ text: responseText });
  return websiteAnalysisSchema.parse(parsedJson);
}

export async function analyzeWebsite({ url }: Props): Promise<WebsiteAnalysisResult> {
  const normalizedUrl = normalizeWebsiteUrl({ url });

  if (normalizedUrl == null) {
    throw new Error("A valid website URL is required.");
  }

  const websiteContent = await fetchWebsiteContent({ url: normalizedUrl });

  try {
    return await analyzeWebsiteWithStructuredOutput({
      normalizedUrl,
      websiteContent,
    });
  } catch {
    return await analyzeWebsiteWithJsonFallback({
      normalizedUrl,
      websiteContent,
    });
  }
}
