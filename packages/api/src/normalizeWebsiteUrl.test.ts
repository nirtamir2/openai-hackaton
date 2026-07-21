import { describe, expect, it } from "vitest";
import { normalizeWebsiteUrl } from "./normalizeWebsiteUrl";

describe("normalizeWebsiteUrl", () => {
  it("adds HTTPS to a bare domain", () => {
    expect(normalizeWebsiteUrl({ value: "example.com" })).toBe("https://example.com/");
  });

  it("keeps a valid web URL and removes its fragment", () => {
    expect(normalizeWebsiteUrl({ value: "https://example.com/product#pricing" })).toBe(
      "https://example.com/product",
    );
  });

  it.each(["javascript:alert(1)", "mailto:hello@example.com", "ftp://example.com"])(
    "rejects the unsupported protocol in %s",
    (value) => {
      expect(() => normalizeWebsiteUrl({ value })).toThrow(
        "Enter a website that starts with http:// or https://.",
      );
    },
  );

  it("rejects credentials embedded in the URL", () => {
    expect(() => normalizeWebsiteUrl({ value: "https://user:secret@example.com" })).toThrow(
      "Website URLs cannot include credentials.",
    );
  });

  it("rejects incomplete hostnames", () => {
    expect(() => normalizeWebsiteUrl({ value: "localhost" })).toThrow(
      "Enter a complete website address, such as example.com.",
    );
  });
});
