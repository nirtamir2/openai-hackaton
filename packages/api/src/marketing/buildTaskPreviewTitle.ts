const previewMaxLength = 100;

export function buildTaskPreviewTitle({ description }: { description: string }) {
  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return "";
  }

  const firstSentence = trimmed.split(/[.!?]/)[0]?.trim() ?? trimmed;

  if (firstSentence.length <= previewMaxLength) {
    return firstSentence;
  }

  return `${firstSentence.slice(0, previewMaxLength - 3)}...`;
}
