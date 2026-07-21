import type { GrowthAgentFeedData } from "@app-template/api/feed/mapGrowthFeedEntries";
import { GrowthIdeaStatus } from "@app-template/db/enums";
import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { GrowthAgentDayPicker } from "@/components/growth-agent/GrowthAgentDayPicker";
import { GrowthAgentFeedItemRow } from "@/components/growth-agent/GrowthAgentFeedItemRow";
import { GrowthAgentIdeaPanel } from "@/components/growth-agent/GrowthAgentIdeaPanel";
import { GrowthAgentProjectRow } from "@/components/growth-agent/GrowthAgentProjectRow";
import { GrowthAgentTaskDrawer } from "@/components/growth-agent/GrowthAgentTaskDrawer";
import { RemoveDayTasksDialog } from "@/components/growth-agent/RemoveDayTasksDialog";
import { growthAgentDayNames } from "@/components/growth-agent/growthAgentTypes";
import type {
  GrowthAgentDayKey,
  GrowthAgentFeedItem,
  GrowthAgentIdea,
  GrowthAgentProject,
} from "@/components/growth-agent/growthAgentTypes";
import { getGrowthAgentDays, getGrowthAgentToday } from "@/components/growth-agent/growthAgentWeek";
import { SignalButton } from "@/components/home/SignalButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { getOrpcErrorMessage } from "@/utils/getOrpcErrorMessage";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import {
  generateMarketingIdeasMutationKey,
  generateMarketingTasksMutationKey,
  getGenerateMarketingIdeasMutationOptions,
  getGenerateMarketingTasksMutationOptions,
} from "@/utils/generateMarketingTasksMutation";
import { orpc } from "@/utils/orpc";

type IdeaStatus = "pending" | "approved" | "postponed" | "cancelled";

type DrawerContent =
  | { kind: "item"; item: GrowthAgentFeedItem }
  | { kind: "project"; project: GrowthAgentProject }
  | { kind: "idea"; idea: GrowthAgentIdea };

interface Props {
  productId: string;
  onOpenCountChange: (count: number) => void;
}

function mapIdeaStatus(status: GrowthIdeaStatus): IdeaStatus {
  if (status === GrowthIdeaStatus.APPROVED) {
    return "approved";
  }

  if (status === GrowthIdeaStatus.POSTPONED) {
    return "postponed";
  }

  if (status === GrowthIdeaStatus.CANCELLED) {
    return "cancelled";
  }

  return "pending";
}

function toGrowthIdeaStatus(status: IdeaStatus): GrowthIdeaStatus {
  if (status === "approved") {
    return GrowthIdeaStatus.APPROVED;
  }

  if (status === "postponed") {
    return GrowthIdeaStatus.POSTPONED;
  }

  if (status === "cancelled") {
    return GrowthIdeaStatus.CANCELLED;
  }

  return GrowthIdeaStatus.PENDING;
}

function patchFeedItemCompleted({
  data,
  entryId,
  completed,
}: {
  data: GrowthAgentFeedData;
  entryId: string;
  completed: boolean;
}) {
  return {
    ...data,
    feedItems: data.feedItems.map((item) =>
      item.id === entryId ? { ...item, defaultCompleted: completed } : item,
    ),
  };
}

function patchIdeaStatus({
  data,
  entryId,
  status,
}: {
  data: GrowthAgentFeedData;
  entryId: string;
  status: GrowthIdeaStatus;
}) {
  return {
    ...data,
    ideaStatuses: {
      ...data.ideaStatuses,
      [entryId]: status,
    },
  };
}

function patchTodoDone({
  data,
  entryId,
  todoId,
  done,
}: {
  data: GrowthAgentFeedData;
  entryId: string;
  todoId: string;
  done: boolean;
}) {
  const key = `${entryId}:${todoId}`;

  function patchTodos<T extends { id: string; todos: Array<{ id: string; done: boolean }> }>(
    items: Array<T>,
  ) {
    return items.map((item) =>
      item.id === entryId
        ? {
            ...item,
            todos: item.todos.map((todo) =>
              todo.id === todoId ? { ...todo, done } : todo,
            ),
          }
        : item,
    );
  }

  return {
    ...data,
    todoDone: {
      ...data.todoDone,
      [key]: done,
    },
    ideas: patchTodos(data.ideas),
    projects: patchTodos(data.projects),
  };
}

function isCompleted(item: GrowthAgentFeedItem) {
  return item.defaultCompleted === true;
}

function getProjectDoneCount(project: GrowthAgentProject) {
  return project.todos.filter((todo) => todo.done).length;
}

function GrowthAgentFeedTaskSkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-3.5 rounded-[10px] border border-[rgba(23,20,15,0.1)] bg-white px-[18px] py-3.5 shadow-[0_1px_2px_rgba(23,20,15,0.03)]"
      style={{
        animation: "growth-task-row-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        animationDelay: `${String(80 + index * 70)}ms`,
      }}
    >
      <Skeleton style={{ height: "1.25rem", width: "1.25rem", borderRadius: "9999px" }} />

      <div className="min-w-0 flex-1">
        <div className="mb-[3px] flex min-w-0 items-center gap-[7px]">
          <Skeleton style={{ height: "0.3125rem", width: "0.3125rem", borderRadius: "9999px" }} />
          <Skeleton style={{ height: "0.625rem", width: "3.5rem" }} />
          <Skeleton style={{ height: "0.6875rem", width: "5.5rem" }} />
        </div>
        <Skeleton style={{ height: "0.9375rem", width: index % 2 === 0 ? "72%" : "58%" }} />
      </div>

      <Skeleton style={{ height: "1.625rem", width: "5.75rem", borderRadius: "0.375rem" }} />
    </div>
  );
}

function GrowthAgentFeedLoadingSkeleton({ variant }: { variant: "initial" | "generating" }) {
  const rowCount = variant === "generating" ? 3 : 4;

  return (
    <div className="flex flex-col gap-3">
      {variant === "generating" ? (
        <div className="flex items-center gap-3.5 rounded-[12px] border border-[rgba(255,90,31,0.18)] bg-[linear-gradient(135deg,rgba(255,90,31,0.08)_0%,rgba(255,255,255,0.95)_55%)] px-[18px] py-4">
          <div className="relative flex size-10 shrink-0 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[rgba(255,90,31,0.14)]" />
            <span className="relative flex size-8 items-center justify-center rounded-full bg-[#17140f] text-white">
              <Sparkles className="size-4" />
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[14.5px] font-medium text-[#17140f]">Generating today&apos;s tasks</p>
            <p className="text-[12.5px] text-[rgba(23,20,15,0.55)]">
              Building a focused set of marketing moves from your product data.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {Array.from({ length: rowCount }, (_, index) => (
          <GrowthAgentFeedTaskSkeletonRow key={index} index={index} />
        ))}
      </div>
    </div>
  );
}

export function GrowthAgentFeed({ productId, onOpenCountChange }: Props) {
  const queryClient = useQueryClient();
  const growthAgentToday = getGrowthAgentToday();
  const growthAgentDays = getGrowthAgentDays();
  const [selectedDay, setSelectedDay] = useState<GrowthAgentDayKey>(growthAgentToday);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);
  const [removeDayTasksDialogOpen, setRemoveDayTasksDialogOpen] = useState(false);
  const [relativeNow, setRelativeNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeNow(Date.now());
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const feedQueryOptions = orpc.feed.getFeed.queryOptions({
    input: { productId },
  });
  const feedQueryKey = feedQueryOptions.queryKey;

  const feedQuery = useQuery(feedQueryOptions);

  const invalidateFeed = async () => {
    await queryClient.invalidateQueries({
      queryKey: feedQueryKey,
    });
  };

  const generateTasksMutation = useMutation(
    getGenerateMarketingTasksMutationOptions({
      onMutate: () => {
        setSelectedDay(growthAgentToday);
      },
      onSuccess: async (result) => {
        setSelectedDay(growthAgentToday);
        queryClient.setQueryData(feedQueryKey, (old) => {
          if (old == null) {
            return old;
          }

          return {
            ...old,
            lastGeneratedAt: result.lastGeneratedAt,
          };
        });
        await invalidateFeed();
        const taskCount = result.marketingTasks.length;
        const taskLabel = taskCount === 1 ? "task" : "tasks";
        toast.success(`Generated ${String(taskCount)} ${taskLabel}`);
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const generateIdeasMutation = useMutation(
    getGenerateMarketingIdeasMutationOptions({
      onSuccess: async (result) => {
        await invalidateFeed();
        const ideaCount = result.ideas.length;
        const ideaLabel = ideaCount === 1 ? "idea" : "ideas";
        toast.success(`Generated ${String(ideaCount)} new ${ideaLabel}`);
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const pendingTaskGenerations = useMutationState({
    filters: {
      mutationKey: generateMarketingTasksMutationKey,
      status: "pending",
    },
  });
  const pendingIdeaGenerations = useMutationState({
    filters: {
      mutationKey: generateMarketingIdeasMutationKey,
      status: "pending",
    },
  });
  const isGeneratingTasks =
    generateTasksMutation.isPending || pendingTaskGenerations.length > 0;
  const isGeneratingIdeas =
    generateIdeasMutation.isPending || pendingIdeaGenerations.length > 0;

  const isFeedBusy = isGeneratingTasks || isGeneratingIdeas;

  const setItemCompletedMutation = useMutation(
    orpc.feed.setItemCompleted.mutationOptions({
      onMutate: async ({ entryId, completed }) => {
        await queryClient.cancelQueries({ queryKey: feedQueryKey });
        const previous = queryClient.getQueryData(feedQueryKey);

        queryClient.setQueryData(feedQueryKey, (old) => {
          if (old == null) {
            return old;
          }

          return patchFeedItemCompleted({ data: old, entryId, completed });
        });

        return { previous };
      },
      onError: (error, _input, context) => {
        if (context?.previous != null) {
          queryClient.setQueryData(feedQueryKey, context.previous);
        }

        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const setIdeaStatusMutation = useMutation(
    orpc.feed.setIdeaStatus.mutationOptions({
      onMutate: async ({ entryId, status }) => {
        await queryClient.cancelQueries({ queryKey: feedQueryKey });
        const previous = queryClient.getQueryData(feedQueryKey);

        queryClient.setQueryData(feedQueryKey, (old) => {
          if (old == null) {
            return old;
          }

          return patchIdeaStatus({ data: old, entryId, status });
        });

        return { previous };
      },
      onError: (error, _input, context) => {
        if (context?.previous != null) {
          queryClient.setQueryData(feedQueryKey, context.previous);
        }

        toast.error(getOrpcErrorMessage({ error }));
      },
      onSuccess: async (_result, input) => {
        if (input.status === GrowthIdeaStatus.APPROVED) {
          await invalidateFeed();
        }
      },
    }),
  );

  const setTodoDoneMutation = useMutation(
    orpc.feed.setTodoDone.mutationOptions({
      onMutate: async ({ entryId, todoId, done }) => {
        await queryClient.cancelQueries({ queryKey: feedQueryKey });
        const previous = queryClient.getQueryData(feedQueryKey);

        queryClient.setQueryData(feedQueryKey, (old) => {
          if (old == null) {
            return old;
          }

          return patchTodoDone({ data: old, entryId, todoId, done });
        });

        return { previous };
      },
      onError: (error, _input, context) => {
        if (context?.previous != null) {
          queryClient.setQueryData(feedQueryKey, context.previous);
        }

        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const feedItems = feedQuery.data?.feedItems ?? [];
  const ideas = feedQuery.data?.ideas ?? [];
  const projects = feedQuery.data?.projects ?? [];

  const ideaStatus = useMemo(() => {
    const statuses: Record<string, IdeaStatus> = {};

    for (const idea of ideas) {
      const serverStatus = feedQuery.data?.ideaStatuses[idea.id];

      statuses[idea.id] =
        serverStatus == null ? "pending" : mapIdeaStatus(serverStatus);
    }

    return statuses;
  }, [feedQuery.data?.ideaStatuses, ideas]);

  const todoDone = feedQuery.data?.todoDone ?? {};

  const openCount = useMemo(() => {
    return feedItems.filter((item) => !isCompleted(item)).length;
  }, [feedItems]);

  useEffect(() => {
    onOpenCountChange(openCount);
  }, [openCount, onOpenCountChange]);

  const liveItem = feedItems.find((item) => item.live === true && !isCompleted(item));

  const dayDots = useMemo(() => {
    const dots: Record<GrowthAgentDayKey, Array<string>> = {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    };

    for (const item of feedItems) {
      dots[item.day].push(item.color);
    }

    return dots;
  }, [feedItems]);

  const visibleItems = feedItems.filter((item) => item.day === selectedDay);

  const pendingIdeas = ideas.filter((idea) => (ideaStatus[idea.id] ?? "pending") === "pending");
  const postponedIdeas = ideas.filter((idea) => (ideaStatus[idea.id] ?? "pending") === "postponed");
  const activeIdeas = projects;
  const hasIdeas =
    pendingIdeas.length > 0 || postponedIdeas.length > 0 || activeIdeas.length > 0;

  function setCompleted({ entryId, completed }: { entryId: string; completed: boolean }) {
    setItemCompletedMutation.mutate({ productId, entryId, completed });
  }

  function updateIdeaStatus({ entryId, status }: { entryId: string; status: IdeaStatus }) {
    setIdeaStatusMutation.mutate({
      productId,
      entryId,
      status: toGrowthIdeaStatus(status),
    });
  }

  function toggleTodo({
    projectId,
    todoId,
    done,
  }: {
    projectId: string;
    todoId: string;
    done: boolean;
  }) {
    setTodoDoneMutation.mutate({ productId, entryId: projectId, todoId, done });
  }

  const selectedDayLabel =
    growthAgentDayNames[selectedDay] + (selectedDay === growthAgentToday ? " · Today" : "");

  const lastGeneratedLabel = useMemo(() => {
    const lastGeneratedAt = feedQuery.data?.lastGeneratedAt;

    if (lastGeneratedAt == null) {
      return null;
    }

    return formatRelativeTime({ value: lastGeneratedAt, now: relativeNow });
  }, [feedQuery.data?.lastGeneratedAt, relativeNow]);

  const hasFeedData = feedQuery.data != null;
  const isInitialLoad = feedQuery.isPending;

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-[-0.3px]">This week</h1>
        <div className="flex flex-wrap items-center gap-3">
          {feedQuery.isFetching && !isInitialLoad && !isGeneratingTasks ? (
            <span className="font-mono text-[11.5px] text-[rgba(23,20,15,0.45)]">Updating feed...</span>
          ) : null}
          {lastGeneratedLabel == null ? null : (
            <div className="flex items-center gap-2 font-mono text-[11.5px] text-[rgba(23,20,15,0.45)]">
              <span className="inline-block size-1.5 rounded-full bg-[#2f6f4e]" />
              last generated {lastGeneratedLabel}
            </div>
          )}
        </div>
      </div>

      {feedQuery.isError && !hasFeedData ? (
        <p className="py-[30px] text-center text-[13.5px] text-[rgba(23,20,15,0.55)]">
          Could not load your growth feed. Check that the database is running and seeded.
        </p>
      ) : null}

      {isInitialLoad ? (
        <div className="flex flex-col">
          <div className="mb-6">
            <GrowthAgentDayPicker
              days={growthAgentDays}
              selectedDay={selectedDay}
              dayDots={dayDots}
              todayKey={growthAgentToday}
              onSelectDay={setSelectedDay}
            />
          </div>
          <div className="mb-2.5">
            <p className="text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
              {selectedDayLabel}
            </p>
          </div>
          <GrowthAgentFeedLoadingSkeleton variant="initial" />
        </div>
      ) : null}

      {hasFeedData ? (
        <>
      {liveItem == null ? null : (
        <button
          type="button"
          onClick={() => {
            setDrawerContent({ kind: "item", item: liveItem });
          }}
          className="mb-[22px] flex cursor-pointer items-center gap-3.5 rounded-[14px] bg-[#17140f] px-[22px] py-4 text-left"
        >
          <span className="signal-pulse-dot inline-block size-[9px] shrink-0 rounded-full bg-[#ff5a1f]" />
          <div className="flex-1">
            <span className="font-mono text-[10.5px] font-semibold tracking-[0.3px] text-[#ff5a1f]">
              LIVE — READY TO PUBLISH
            </span>
            <p className="mt-0.5 text-[14.5px] text-white">{liveItem.title}</p>
          </div>
          <span className="text-[13px] text-white/40">Open →</span>
        </button>
      )}

      <div className="mb-6">
        <GrowthAgentDayPicker
          days={growthAgentDays}
          selectedDay={selectedDay}
          dayDots={dayDots}
          todayKey={growthAgentToday}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          {selectedDayLabel}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <SignalButton
            variant="secondary"
            size="sm"
            disabled={isFeedBusy || isInitialLoad}
            onClick={() => {
              generateTasksMutation.mutate({
                productId,
                forToday: true,
                taskCount: 3,
                scope: "tasks",
              });
            }}
          >
            <Sparkles className="size-[13px]" />
            {isGeneratingTasks ? "Generating..." : "Generate today's tasks"}
          </SignalButton>
          {visibleItems.length > 0 ? (
            <SignalButton
              variant="tertiary"
              size="sm"
              disabled={isFeedBusy}
              onClick={() => {
                setRemoveDayTasksDialogOpen(true);
              }}
            >
              <Trash2 className="size-[13px]" />
              Remove all tasks
            </SignalButton>
          ) : null}
        </div>
      </div>

      <div className="mb-9 flex flex-col gap-2">
        {isGeneratingTasks ? (
          <GrowthAgentFeedLoadingSkeleton variant="generating" />
        ) : null}
        {!isGeneratingTasks
          ? visibleItems.map((item, index) => (
              <GrowthAgentFeedItemRow
                key={item.id}
                index={index}
                item={item}
                completed={isCompleted(item)}
                onToggle={() => {
                  setCompleted({ entryId: item.id, completed: !isCompleted(item) });
                }}
                onOpen={() => {
                  setDrawerContent({ kind: "item", item });
                }}
              />
            ))
          : null}
        {!isGeneratingTasks && visibleItems.length === 0 ? (
          <p className="py-[30px] text-center text-[13.5px] text-[rgba(23,20,15,0.35)]">
            Nothing scheduled this day. Generate today&apos;s tasks to get started.
          </p>
        ) : null}
      </div>

      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
          IDEAS
        </p>
        <SignalButton
          variant="secondary"
          size="sm"
          disabled={isFeedBusy || isInitialLoad}
          onClick={() => {
            generateIdeasMutation.mutate({
              productId,
              forToday: true,
              taskCount: 3,
              scope: "ideas",
            });
          }}
        >
          <Sparkles className="size-[13px]" />
          {isGeneratingIdeas ? "Generating..." : "Generate ideas"}
        </SignalButton>
      </div>

      <div className="mb-9 flex flex-col gap-2">
        {isGeneratingIdeas ? (
          <p className="py-[18px] text-center text-[13.5px] text-[rgba(23,20,15,0.45)]">
            Generating video ad ideas...
          </p>
        ) : null}
        {!isGeneratingIdeas ? (
          <GrowthAgentIdeaPanel
          pendingIdeas={pendingIdeas}
          postponedIdeas={postponedIdeas}
          showEmptyState={!hasIdeas}
          onOpenIdea={(idea) => {
            setDrawerContent({ kind: "idea", idea });
          }}
          onApprove={(entryId) => {
            updateIdeaStatus({ entryId, status: "approved" });
          }}
          onPostpone={(entryId) => {
            updateIdeaStatus({ entryId, status: "postponed" });
          }}
          onCancel={(entryId) => {
            updateIdeaStatus({ entryId, status: "cancelled" });
          }}
          onReconsider={(entryId) => {
            updateIdeaStatus({ entryId, status: "pending" });
          }}
        />
        ) : null}

        {!isGeneratingIdeas
          ? activeIdeas.map((project) => (
          <GrowthAgentProjectRow
            key={project.id}
            project={project}
            doneCount={getProjectDoneCount(project)}
            onOpen={() => {
              setDrawerContent({
                kind: "project",
                project,
              });
            }}
          />
        ))
          : null}
      </div>
        </>
      ) : null}

      <GrowthAgentTaskDrawer
        content={drawerContent}
        todoDone={todoDone}
        onClose={() => {
          setDrawerContent(null);
        }}
        onMarkComplete={(id) => {
          setCompleted({ entryId: id, completed: true });
          setDrawerContent(null);
        }}
        onToggleTodo={(projectId, todoId) => {
          const key = `${projectId}:${todoId}`;
          const currentDone = todoDone[key] ?? false;
          toggleTodo({ projectId, todoId, done: !currentDone });
        }}
        onApproveIdea={(id) => {
          updateIdeaStatus({ entryId: id, status: "approved" });
          setDrawerContent(null);
        }}
        onPostponeIdea={(id) => {
          updateIdeaStatus({ entryId: id, status: "postponed" });
          setDrawerContent(null);
        }}
        onCancelIdea={(id) => {
          updateIdeaStatus({ entryId: id, status: "cancelled" });
          setDrawerContent(null);
        }}
      />

      <RemoveDayTasksDialog
        productId={productId}
        dayKey={selectedDay}
        taskCount={visibleItems.length}
        open={removeDayTasksDialogOpen}
        onOpenChange={setRemoveDayTasksDialogOpen}
        onRemoved={() => {
          if (drawerContent?.kind === "item" && drawerContent.item.day === selectedDay) {
            setDrawerContent(null);
          }
        }}
      />

      <span className="sr-only">{openCount} open tasks</span>
    </div>
  );
}
