import { describe, expect, it } from "vitest";
import { z } from "zod";
import { companyAnalysisSchema } from "./companyAnalysis";

const validAnalysis = {
  companyName: "Acme",
  website: "https://acme.example",
  companySummary: "Acme helps teams test structured company research.",
  keyDifferentiators: ["One", "Two", "Three"],
  competitors: [{ name: "Example", website: "https://example.com" }],
  relevantSubreddits: ["marketing"],
  xSearchKeywords: ["marketing research"],
  googleAdsKeywords: ["market research software"],
  seoKeywords: ["company research"],
  onboardingQuestions: {
    targetMarket: {
      question: "Who should we target?",
      options: ["One team", "Two teams", "Three teams", "Four teams", "Five teams"],
    },
    personalityAndTone: {
      question: "How should we sound?",
      options: [
        "Clear and direct",
        "Warm and helpful",
        "Bold and sharp",
        "Calm and expert",
        "Playful and bright",
      ],
    },
  },
};

describe("companyAnalysisSchema", () => {
  it("emits an OpenAI-compatible JSON schema without URI formats", () => {
    const jsonSchema = z.toJSONSchema(companyAnalysisSchema);

    expect(JSON.stringify(jsonSchema)).not.toContain('"format":"uri"');
  });

  it("still validates company and competitor URLs after parsing", () => {
    expect(companyAnalysisSchema.safeParse(validAnalysis).success).toBe(true);
    expect(
      companyAnalysisSchema.safeParse({ ...validAnalysis, website: "not-a-url" }).success,
    ).toBe(false);
    expect(
      companyAnalysisSchema.safeParse({ ...validAnalysis, website: "ftp://acme.example" }).success,
    ).toBe(false);
  });
});
