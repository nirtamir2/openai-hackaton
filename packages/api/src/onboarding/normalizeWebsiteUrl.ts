const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;

export function normalizeWebsiteUrl({ url }: { url: string }) {
  const trimmedUrl = url.trim();

  if (trimmedUrl.length === 0) {
    return null;
  }

  if (HTTP_PROTOCOL_REGEX.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}
