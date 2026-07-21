import { useEffect, useState } from "react";
import { formatEstimatedTimeRemaining } from "@/utils/formatEstimatedTimeRemaining";

export const estimatedTaskGenerationDurationMs = 45_000;

interface Params {
  estimatedDurationMs: number;
  isComplete: boolean;
}

export function useGenerationEta({ estimatedDurationMs, isComplete }: Params) {
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isComplete]);

  const elapsedMs = now - startedAt;
  const remainingMs = Math.max(0, estimatedDurationMs - elapsedMs);
  const remainingSeconds = Math.ceil(remainingMs / 1_000);

  return {
    remainingSeconds,
    label: formatEstimatedTimeRemaining({ totalSeconds: remainingSeconds }),
  };
}
