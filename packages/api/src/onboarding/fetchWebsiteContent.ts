import { normalizeWebsiteUrl } from "./normalizeWebsiteUrl";

function removeElements({ html, tagName }: { html: string; tagName: string }) {
  const openPattern = `<${tagName}`;
  const closePattern = `</${tagName}>`;
  let result = html;
  let searchFrom = 0;

  while (searchFrom < result.length) {
    const openIndex = result.toLowerCase().indexOf(openPattern, searchFrom);
    if (openIndex === -1) {
      break;
    }

    const closeIndex = result.toLowerCase().indexOf(closePattern, openIndex);
    if (closeIndex === -1) {
      break;
    }

    result = `${result.slice(0, openIndex)} ${result.slice(closeIndex + closePattern.length)}`;
    searchFrom = openIndex + 1;
  }

  return result;
}

function stripHtmlTags(html: string) {
  let result = "";
  let insideTag = false;

  for (const char of html) {
    if (char === "<") {
      insideTag = true;
      continue;
    }

    if (char === ">") {
      insideTag = false;
      result += " ";
      continue;
    }

    if (!insideTag) {
      result += char;
    }
  }

  return result.replaceAll(/\s+/g, " ").trim();
}

function stripHtml({ html }: { html: string }) {
  return stripHtmlTags(
    removeElements({ html: removeElements({ html, tagName: "style" }), tagName: "script" }),
  );
}

export async function fetchWebsiteContent({ url }: { url: string }) {
  const normalizedUrl = normalizeWebsiteUrl({ url });

  if (normalizedUrl == null) {
    return null;
  }

  try {
    const response = await fetch(normalizedUrl, {
      headers: {
        "User-Agent": "SignalOnboardingBot/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const text = stripHtml({ html });

    if (text.length === 0) {
      return null;
    }

    return text.slice(0, 6_000);
  } catch {
    return null;
  }
}
