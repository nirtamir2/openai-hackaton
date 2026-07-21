export const marketingTaskTitleMaxLength = 60;
export const marketingTaskTitleMaxWords = 8;
export const marketingTaskDescriptionMaxLength = 280;
export const marketingTaskDescriptionMaxLines = 2;

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

export function countMarketingTaskWords({ text }: { text: string }) {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function countMarketingTaskLines({ text }: { text: string }) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  return trimmed.split(/\n/).length;
}

export function normalizeMarketingTaskTitle({ title }: { title: string }) {
  const trimmed = title.trim().replace(/\s+/g, " ");

  if (trimmed.length === 0) {
    return "";
  }

  const words = trimmed.split(" ").slice(0, marketingTaskTitleMaxWords);
  const limited = words.join(" ");

  if (limited.length <= marketingTaskTitleMaxLength) {
    return limited;
  }

  return truncateAtWordBoundary({ text: limited, maxLength: marketingTaskTitleMaxLength });
}

export function normalizeMarketingTaskDescription({ description }: { description: string }) {
  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return "";
  }

  const lines = trimmed
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, marketingTaskDescriptionMaxLines);

  if (lines.length === 0) {
    return "";
  }

  const joined = lines.join("\n");

  if (joined.length <= marketingTaskDescriptionMaxLength) {
    return joined;
  }

  return truncateAtWordBoundary({ text: joined, maxLength: marketingTaskDescriptionMaxLength });
}
