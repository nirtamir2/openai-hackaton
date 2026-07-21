import { chat } from "@tanstack/ai";
import { createOpenaiChat } from "@tanstack/ai-openai";
import { z } from "zod";
import { env } from "@app-template/env/server";
import { buildWebsiteAnalysisSystemPrompt } from "./buildWebsiteAnalysisSystemPrompt";
import { fetchWebsiteContent } from "./fetchWebsiteContent";
import { normalizeWebsiteUrl } from "./normalizeWebsiteUrl";

const websiteAnalysisSchema = z.object({
  companyDescription: z.string().min(1).max(1_000).meta({
    description: "One or two sentences describing what the company does and who it serves.",
  }),
  keyDifferentiators: z.string().min(1).max(500).meta({
    description: "Comma-separated differentiators that set the product apart from alternatives.",
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
      max_output_tokens: 2_500,
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
        "companyDescription, keyDifferentiators, competitors, subreddits, searchKeywordsX, searchKeywordsGoogle, searchKeywordsSeo.",
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
      max_output_tokens: 2_500,
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
