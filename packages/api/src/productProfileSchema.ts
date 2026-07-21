import { z } from "zod";

export const productProfileSchema = z.object({
  websiteUrl: z.url().max(2048),
  name: z.string().trim().min(1).max(120).meta({ description: "The product's public name" }),
  category: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .meta({ description: "A short, recognizable product category" }),
  description: z
    .string()
    .trim()
    .min(1)
    .max(600)
    .meta({ description: "Two concise sentences explaining what the product does" }),
  targetAudience: z
    .string()
    .trim()
    .min(1)
    .max(240)
    .meta({ description: "The primary people or organizations the product serves" }),
  keyFeatures: z
    .array(z.string().trim().min(1).max(100))
    .min(1)
    .max(8)
    .meta({ description: "Three to six concrete product capabilities" }),
  sourceUrls: z
    .array(z.url().max(2048))
    .min(1)
    .max(8)
    .meta({ description: "Public URLs actually used to support the profile" }),
});
