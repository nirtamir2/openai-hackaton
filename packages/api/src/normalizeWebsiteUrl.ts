const protocolPattern = /^[a-z][a-z\d+.-]*:/iu;

export function normalizeWebsiteUrl({ value }: { value: string }): string {
  const trimmedValue = value.trim();
  const candidate = protocolPattern.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
  const url = new URL(candidate);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Enter a website that starts with http:// or https://.");
  }

  if (url.username.length > 0 || url.password.length > 0) {
    throw new Error("Website URLs cannot include credentials.");
  }

  if (url.hostname.length === 0 || !url.hostname.includes(".")) {
    throw new Error("Enter a complete website address, such as example.com.");
  }

  url.hash = "";
  return url.toString();
}
