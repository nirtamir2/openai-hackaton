const ideaDescriptionMaxLength = 400;
const ideaDescriptionMaxSentences = 4;

function truncateAtWordBoundary({ text, maxLength }: { text: string; maxLength: number }) {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > 0) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}

export function buildIdeaDescription({ description }: { description: string }) {
  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return "";
  }

  const sentences = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [trimmed];
  const summary = sentences
    .slice(0, ideaDescriptionMaxSentences)
    .join("")
    .trim();

  if (summary.length === 0) {
    return truncateAtWordBoundary({ text: trimmed, maxLength: ideaDescriptionMaxLength });
  }

  if (summary.length <= ideaDescriptionMaxLength) {
    return summary;
  }

  return truncateAtWordBoundary({ text: summary, maxLength: ideaDescriptionMaxLength });
}
