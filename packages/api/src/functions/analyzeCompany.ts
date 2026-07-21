import process from "node:process";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { companyAnalysisPrompt } from "../prompts/companyAnalysisPrompt";
import { companyAnalysisSchema } from "../schemas/companyAnalysis";

interface Props {
  website: string;
}

export async function analyzeCompany({ website }: Props) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey == null || apiKey.length === 0) {
    throw new Error("OPENAI_API_KEY is required to analyze a website.");
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.parse({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    instructions: companyAnalysisPrompt,
    input: `Analyze this company website: ${website}`,
    tools: [{ type: "web_search", search_context_size: "low" }],
    text: {
      verbosity: "low",
      format: zodTextFormat(companyAnalysisSchema, "company_analysis"),
    },
  });

  if (response.output_parsed == null) {
    throw new Error("The company analysis did not return a structured report.");
  }

  return response.output_parsed;
}
