import { describe, expect, it } from "vitest";
import { productProfileSchema } from "./productProfileSchema";

const validProfile = {
  websiteUrl: "https://linear.app/",
  name: "Linear",
  category: "Product development",
  description: "Linear helps teams plan and build software products.",
  targetAudience: "Product and engineering teams",
  keyFeatures: ["Issue tracking", "Roadmaps", "Cycles"],
  sourceUrls: ["https://linear.app/", "https://linear.app/method"],
};

describe("productProfileSchema", () => {
  it("accepts a complete profile", () => {
    expect(productProfileSchema.parse(validProfile)).toEqual(validProfile);
  });

  it("rejects an empty profile field", () => {
    expect(productProfileSchema.safeParse({ ...validProfile, targetAudience: "" }).success).toBe(
      false,
    );
  });

  it("caps the number of product capabilities", () => {
    expect(
      productProfileSchema.safeParse({
        ...validProfile,
        keyFeatures: Array.from({ length: 9 }, (_, index) => `Feature ${String(index)}`),
      }).success,
    ).toBe(false);
  });
});
