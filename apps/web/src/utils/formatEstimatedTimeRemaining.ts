export function formatEstimatedTimeRemaining({ totalSeconds }: { totalSeconds: number }) {
  if (totalSeconds <= 0) {
    return "Almost ready";
  }

  if (totalSeconds < 60) {
    return `~${String(totalSeconds)} sec`;
  }

  const minutes = Math.ceil(totalSeconds / 60);

  if (minutes === 1) {
    return "~1 min";
  }

  return `~${String(minutes)} min`;
}
