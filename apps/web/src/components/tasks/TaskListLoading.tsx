import clsx from "clsx";
import { CalendarDays, Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

interface Props {
  variant: "initial" | "generating";
}

const stepAdvanceMs = 1_600;
const skeletonRowCount = 6;

const generationSteps = [
  "Reading product sentiment signals",
  "Matching tasks to your marketing channels",
  "Balancing short wins and ongoing projects",
  "Scheduling tasks across today",
  "Ranking by expected impact",
  "Finalizing your task list",
] as const;

function getTodayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function TaskListLoadingRow({ index }: { index: number }) {
  return (
    <TableRow
      style={{
        animation: "growth-task-row-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        animationDelay: `${String(80 + index * 70)}ms`,
      }}
    >
      <TableCell>
        <div className="flex max-w-md flex-col gap-2">
          <Skeleton style={{ height: "0.875rem", width: "100%" }} />
          <Skeleton style={{ height: "0.875rem", width: "80%" }} />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton style={{ height: "1.5rem", width: "6rem", borderRadius: "9999px" }} />
      </TableCell>
      <TableCell>
        <Skeleton style={{ height: "1.5rem", width: "5rem", borderRadius: "9999px" }} />
      </TableCell>
      <TableCell>
        <Skeleton style={{ height: "1.5rem", width: "4rem", borderRadius: "9999px" }} />
      </TableCell>
      <TableCell>
        <Skeleton style={{ height: "1rem", width: "5rem" }} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <Skeleton style={{ height: "0.75rem", width: "7rem" }} />
          <Skeleton style={{ height: "0.75rem", width: "6rem" }} />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Skeleton style={{ height: "2rem", width: "2rem", borderRadius: "0.375rem" }} />
          <Skeleton style={{ height: "2rem", width: "2rem", borderRadius: "0.375rem" }} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function TaskListLoading({ variant }: Props) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (variant !== "generating") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveStepIndex((currentIndex) => {
        if (currentIndex >= generationSteps.length - 1) {
          return currentIndex;
        }

        return currentIndex + 1;
      });
    }, stepAdvanceMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [variant]);

  const progressPercent =
    variant === "generating"
      ? Math.min(96, Math.round(((activeStepIndex + 1) / generationSteps.length) * 100))
      : 28;

  const title = variant === "generating" ? "Generating today's tasks" : "Loading your tasks";
  const description =
    variant === "generating"
      ? "Building a focused set of marketing moves from your product data."
      : "Fetching your scheduled marketing tasks.";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-xl border border-border bg-linear-to-br from-primary/8 via-background to-primary/4 px-6 py-7">
            <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 size-40 rounded-full bg-primary/6 blur-3xl" />

            <div className="relative flex flex-col items-center gap-5 text-center">
              <div className="relative flex size-14 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
                <span className="absolute inset-2 rounded-full bg-primary/8" />
                <span className="relative flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <Sparkles className="size-5" />
                </span>
              </div>

              <div className="flex max-w-md flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  {variant === "generating"
                    ? generationSteps[activeStepIndex]
                    : "Preparing your task board"}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5 shrink-0" />
                  <span>{getTodayLabel()}</span>
                </div>
              </div>

              <div className="flex w-full max-w-md flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-primary via-primary/80 to-foreground transition-[width] duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {variant === "generating" ? (
              <div className="relative mt-6 flex flex-col gap-2">
                {generationSteps.map((stepLabel, index) => {
                  const isStepComplete = index < activeStepIndex;
                  const isActive = index === activeStepIndex;

                  return (
                    <div
                      key={stepLabel}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-[background-color,opacity] duration-500",
                        isActive ? "bg-background/80" : null,
                        !isStepComplete && !isActive ? "opacity-45" : null,
                      )}
                    >
                      <span
                        className={clsx(
                          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                          isStepComplete
                            ? "border-foreground bg-foreground text-background"
                            : isActive
                              ? "border-primary bg-primary/10"
                              : "border-border bg-transparent",
                        )}
                      >
                        {isStepComplete ? (
                          <Check className="size-3" strokeWidth={2.5} />
                        ) : isActive ? (
                          <span className="size-2 animate-pulse rounded-full bg-primary" />
                        ) : null}
                      </span>

                      <span
                        className={clsx(
                          "text-sm transition-colors duration-500",
                          isActive || isStepComplete
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {stepLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Task type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: skeletonRowCount }, (_, index) => (
                <TaskListLoadingRow key={index} index={index} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
