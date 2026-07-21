import { z } from "zod";

const httpUrlSchema = z
  .string()
  .min(1)
  .refine(isHttpUrl, { message: "Must be a valid HTTP or HTTPS URL" });

export const companyAnalysisSchema = z.object({
  companyName: z.string().min(1),
  website: httpUrlSchema,
  companySummary: z.string().min(1),
  keyDifferentiators: z.array(z.string().min(1)).length(3),
  competitors: z
    .array(
      z.object({
        name: z.string().min(1),
        website: httpUrlSchema,
      }),
    )
    .max(5),
  relevantSubreddits: z.array(z.string().min(1)),
  xSearchKeywords: z.array(z.string().min(1)).max(5),
  googleAdsKeywords: z.array(z.string().min(1)).max(5),
  seoKeywords: z.array(z.string().min(1)).max(5),
  onboardingQuestions: z.object({
    targetMarket: z.object({
      question: z.string().min(1),
      options: z.array(z.string().min(1)).length(5),
    }),
    personalityAndTone: z.object({
      question: z.string().min(1),
      options: z.array(z.string().min(1)).length(5),
    }),
  }),
});

export type CompanyAnalysis = z.infer<typeof companyAnalysisSchema>;

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
