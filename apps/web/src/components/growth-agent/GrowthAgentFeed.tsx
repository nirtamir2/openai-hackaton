import { GrowthIdeaStatus } from "@app-template/db/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GrowthAgentDayPicker } from "@/components/growth-agent/GrowthAgentDayPicker";
import { GrowthAgentFeedItemRow } from "@/components/growth-agent/GrowthAgentFeedItemRow";
import { GrowthAgentProjectRow } from "@/components/growth-agent/GrowthAgentProjectRow";
import { GrowthAgentTaskDrawer } from "@/components/growth-agent/GrowthAgentTaskDrawer";
import { growthAgentDayNames } from "@/components/growth-agent/growthAgentTypes";
import type {
  GrowthAgentDayKey,
  GrowthAgentFeedItem,
  GrowthAgentIdea,
  GrowthAgentProject,
} from "@/components/growth-agent/growthAgentTypes";
import { getGrowthAgentDays, getGrowthAgentToday } from "@/components/growth-agent/growthAgentWeek";
import { Loader } from "@/components/layout/Loader";
import { SignalButton } from "@/components/home/SignalButton";
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

export function GrowthAgentFeed({ productId, onOpenCountChange }: Props) {
  const queryClient = useQueryClient();
  const growthAgentToday = getGrowthAgentToday();
  const growthAgentDays = getGrowthAgentDays();
  const [selectedDay, setSelectedDay] = useState<GrowthAgentDayKey>(growthAgentToday);
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});
  const [ideaStatusOverrides, setIdeaStatusOverrides] = useState<Record<string, IdeaStatus>>({});
  const [todoDoneOverrides, setTodoDoneOverrides] = useState<Record<string, boolean>>({});
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);

  const feedQuery = useQuery(
    orpc.feed.getFeed.queryOptions({
      input: { productId },
    }),
  );

  const invalidateFeed = async () => {
    await queryClient.invalidateQueries({
      queryKey: orpc.feed.getFeed.key({ input: { productId } }),
    });
  };

  const setItemCompletedMutation = useMutation(
    orpc.feed.setItemCompleted.mutationOptions({
      onSuccess: async () => {
        await invalidateFeed();
      },
    }),
  );

  const setIdeaStatusMutation = useMutation(
    orpc.feed.setIdeaStatus.mutationOptions({
      onSuccess: async () => {
        await invalidateFeed();
      },
    }),
  );

  const setTodoDoneMutation = useMutation(
    orpc.feed.setTodoDone.mutationOptions({
      onSuccess: async () => {
        await invalidateFeed();
      },
    }),
  );

  const feedItems = feedQuery.data?.feedItems ?? [];
  const ideas = feedQuery.data?.ideas ?? [];
  const projects = feedQuery.data?.projects ?? [];

  const ideaStatus = useMemo(() => {
    const statuses: Record<string, IdeaStatus> = {};

    for (const idea of ideas) {
      const override = ideaStatusOverrides[idea.id];
      const serverStatus = feedQuery.data?.ideaStatuses[idea.id];

      statuses[idea.id] =
        override ??
        (serverStatus != null ? mapIdeaStatus(serverStatus) : "pending");
    }

    return statuses;
  }, [feedQuery.data?.ideaStatuses, ideaStatusOverrides, ideas]);

  const todoDone = useMemo(() => {
    return {
      ...(feedQuery.data?.todoDone ?? {}),
      ...todoDoneOverrides,
    };
  }, [feedQuery.data?.todoDone, todoDoneOverrides]);

  function isCompleted(item: GrowthAgentFeedItem) {
    const override = completedOverrides[item.id];

    if (override != null) {
      return override;
    }

    return item.defaultCompleted === true;
  }

  const openCount = useMemo(() => {
    return feedItems.filter((item) => !isCompleted(item)).length;
  }, [completedOverrides, feedItems]);

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
  const approvedIdeas = ideas.filter((idea) => (ideaStatus[idea.id] ?? "pending") === "approved");

  function getProjectDoneCount(project: GrowthAgentProject) {
    return project.todos.filter((todo) => todoDone[`${project.id}:${todo.id}`] ?? todo.done).length;
  }

  function setCompleted({ entryId, completed }: { entryId: string; completed: boolean }) {
    setCompletedOverrides((previous) => ({ ...previous, [entryId]: completed }));
    setItemCompletedMutation.mutate({ productId, entryId, completed });
  }

  function updateIdeaStatus({ entryId, status }: { entryId: string; status: IdeaStatus }) {
    setIdeaStatusOverrides((previous) => ({ ...previous, [entryId]: status }));
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
    const key = `${projectId}:${todoId}`;
    setTodoDoneOverrides((previous) => ({ ...previous, [key]: done }));
    setTodoDoneMutation.mutate({ productId, entryId: projectId, todoId, done });
  }

  const selectedDayLabel =
    growthAgentDayNames[selectedDay] + (selectedDay === growthAgentToday ? " · Today" : "");

  if (feedQuery.isLoading) {
    return <Loader />;
  }

  if (feedQuery.isError) {
    return (
      <p className="py-[30px] text-center text-[13.5px] text-[rgba(23,20,15,0.55)]">
        Could not load your growth feed. Check that the database is running and seeded.
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex items-baseline justify-between">
        <h1 className="text-[26px] font-semibold tracking-[-0.3px]">This week</h1>
        <div className="flex items-center gap-2 font-mono text-[11.5px] text-[rgba(23,20,15,0.45)]">
          <span className="inline-block size-1.5 rounded-full bg-[#2f6f4e]" />
          last scanned 6 min ago
        </div>
      </div>

      {liveItem != null ? (
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
      ) : null}

      <div className="mb-6">
        <GrowthAgentDayPicker
          days={growthAgentDays}
          selectedDay={selectedDay}
          dayDots={dayDots}
          todayKey={growthAgentToday}
          onSelectDay={setSelectedDay}
        />
      </div>

      <p className="mb-2.5 text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
        {selectedDayLabel}
      </p>

      <div className="mb-9 flex flex-col gap-2">
        {visibleItems.map((item) => (
          <GrowthAgentFeedItemRow
            key={item.id}
            item={item}
            completed={isCompleted(item)}
            onToggle={() => {
              setCompleted({ entryId: item.id, completed: !isCompleted(item) });
            }}
            onOpen={() => {
              setDrawerContent({ kind: "item", item });
            }}
          />
        ))}
        {visibleItems.length === 0 ? (
          <p className="py-[30px] text-center text-[13.5px] text-[rgba(23,20,15,0.35)]">
            Nothing scheduled this day.
          </p>
        ) : null}
      </div>

      <p className="mb-2.5 text-[12.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.45)]">
        ONGOING PROJECTS
      </p>

      <div className="flex flex-col gap-2">
        {pendingIdeas.map((idea) => (
          <div
            key={idea.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              setDrawerContent({ kind: "idea", idea });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setDrawerContent({ kind: "idea", idea });
              }
            }}
            className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[rgba(106,63,209,0.35)] bg-[rgba(106,63,209,0.06)] p-5"
          >
            <span className="font-mono text-[10.5px] font-semibold tracking-[0.3px] text-[#6a3fd1]">
              NEW IDEA
            </span>
            <p className="mt-1.5 text-[15px] font-semibold text-[rgba(23,20,15,0.9)]">{idea.title}</p>
            <p className="mt-1 text-xs text-[rgba(23,20,15,0.42)]">{idea.meta}</p>
            <p className="mt-2.5 mb-4 text-sm leading-[1.55] text-[rgba(23,20,15,0.75)]">
              {idea.description}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <SignalButton
                variant="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  updateIdeaStatus({ entryId: idea.id, status: "approved" });
                }}
              >
                <Check className="size-[13px] stroke-[3]" />
                Approve
              </SignalButton>
              <SignalButton
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  updateIdeaStatus({ entryId: idea.id, status: "postponed" });
                }}
              >
                <Clock className="size-[13px]" />
                Snooze
              </SignalButton>
              <SignalButton
                variant="tertiary"
                onClick={(event) => {
                  event.stopPropagation();
                  updateIdeaStatus({ entryId: idea.id, status: "cancelled" });
                }}
              >
                Not interested
              </SignalButton>
            </div>
          </div>
        ))}

        {postponedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="flex items-center gap-3.5 rounded-[10px] border border-[rgba(23,20,15,0.1)] bg-white px-[18px] py-3.5"
          >
            <span className="inline-block size-2 shrink-0 rounded-full bg-[rgba(106,63,209,0.4)]" />
            <p className="min-w-0 flex-1 text-sm text-[rgba(23,20,15,0.5)]">
              Idea postponed: {idea.title}
            </p>
            <button
              type="button"
              onClick={() => {
                updateIdeaStatus({ entryId: idea.id, status: "pending" });
              }}
              className="shrink-0 text-[12.5px] font-semibold whitespace-nowrap text-[#6a3fd1]"
            >
              Reconsider
            </button>
          </div>
        ))}

        {approvedIdeas.map((idea) => (
          <GrowthAgentProjectRow
            key={idea.id}
            project={{
              id: idea.id,
              tag: "PROJECT",
              color: "#6a3fd1",
              colorBg: "rgba(106,63,209,0.1)",
              title: idea.title,
              meta: idea.meta,
              todos: idea.todos.map((todo) => ({
                ...todo,
                done: todoDone[`${idea.id}:${todo.id}`] ?? todo.done,
              })),
            }}
            doneCount={getProjectDoneCount({
              id: idea.id,
              tag: "PROJECT",
              color: "#6a3fd1",
              colorBg: "rgba(106,63,209,0.1)",
              title: idea.title,
              meta: idea.meta,
              todos: idea.todos.map((todo) => ({
                ...todo,
                done: todoDone[`${idea.id}:${todo.id}`] ?? todo.done,
              })),
            })}
            onOpen={() => {
              setDrawerContent({
                kind: "project",
                project: {
                  id: idea.id,
                  tag: "PROJECT",
                  color: "#6a3fd1",
                  colorBg: "rgba(106,63,209,0.1)",
                  title: idea.title,
                  meta: idea.meta,
                  description: idea.description,
                  why: idea.why,
                  todos: idea.todos.map((todo) => ({
                    ...todo,
                    done: todoDone[`${idea.id}:${todo.id}`] ?? todo.done,
                  })),
                },
              });
            }}
          />
        ))}

        {projects.map((project) => (
          <GrowthAgentProjectRow
            key={project.id}
            project={{
              ...project,
              todos: project.todos.map((todo) => ({
                ...todo,
                done: todoDone[`${project.id}:${todo.id}`] ?? todo.done,
              })),
            }}
            doneCount={getProjectDoneCount({
              ...project,
              todos: project.todos.map((todo) => ({
                ...todo,
                done: todoDone[`${project.id}:${todo.id}`] ?? todo.done,
              })),
            })}
            onOpen={() => {
              setDrawerContent({
                kind: "project",
                project: {
                  ...project,
                  todos: project.todos.map((todo) => ({
                    ...todo,
                    done: todoDone[`${project.id}:${todo.id}`] ?? todo.done,
                  })),
                },
              });
            }}
          />
        ))}
      </div>

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

      <span className="sr-only">{openCount} open tasks</span>
    </div>
  );
}
