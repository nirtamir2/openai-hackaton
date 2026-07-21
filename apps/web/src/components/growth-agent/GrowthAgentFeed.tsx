import { Check, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GrowthAgentDayPicker } from "@/components/growth-agent/GrowthAgentDayPicker";
import { GrowthAgentFeedItemRow } from "@/components/growth-agent/GrowthAgentFeedItemRow";
import { GrowthAgentProjectRow } from "@/components/growth-agent/GrowthAgentProjectRow";
import { GrowthAgentTaskDrawer } from "@/components/growth-agent/GrowthAgentTaskDrawer";
import {
  growthAgentDayNames,
  growthAgentDays,
  growthAgentFeedItems,
  growthAgentIdeas,
  growthAgentProjects,
  growthAgentToday,
  type GrowthAgentDayKey,
  type GrowthAgentFeedItem,
  type GrowthAgentIdea,
  type GrowthAgentProject,
} from "@/components/growth-agent/growthAgentMockData";
import { SignalButton } from "@/components/home/SignalButton";

type IdeaStatus = "pending" | "approved" | "postponed" | "cancelled";

type DrawerContent =
  | { kind: "item"; item: GrowthAgentFeedItem }
  | { kind: "project"; project: GrowthAgentProject }
  | { kind: "idea"; idea: GrowthAgentIdea };

interface Props {
  onOpenCountChange: (count: number) => void;
}

export function GrowthAgentFeed({ onOpenCountChange }: Props) {
  const [selectedDay, setSelectedDay] = useState<GrowthAgentDayKey>(growthAgentToday);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [todoDone, setTodoDone] = useState<Record<string, boolean>>({});
  const [ideaStatus, setIdeaStatus] = useState<Record<string, IdeaStatus>>({});
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);

  function isCompleted(item: GrowthAgentFeedItem) {
    const override = completedIds[item.id];
    return override != null ? override : item.defaultCompleted === true;
  }

  const openCount = useMemo(() => {
    return growthAgentFeedItems.filter((item) => !isCompleted(item)).length;
  }, [completedIds]);

  useEffect(() => {
    onOpenCountChange(openCount);
  }, [openCount, onOpenCountChange]);

  const liveItem = growthAgentFeedItems.find(
    (item) => item.live === true && !isCompleted(item),
  );

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

    for (const item of growthAgentFeedItems) {
      dots[item.day].push(item.color);
    }

    return dots;
  }, []);

  const visibleItems = growthAgentFeedItems.filter((item) => item.day === selectedDay);

  const pendingIdeas = growthAgentIdeas.filter(
    (idea) => (ideaStatus[idea.id] ?? "pending") === "pending",
  );
  const postponedIdeas = growthAgentIdeas.filter(
    (idea) => (ideaStatus[idea.id] ?? "pending") === "postponed",
  );
  const approvedIdeas = growthAgentIdeas.filter(
    (idea) => (ideaStatus[idea.id] ?? "pending") === "approved",
  );

  function getProjectDoneCount(project: GrowthAgentProject) {
    return project.todos.filter((todo) => todoDone[`${project.id}:${todo.id}`] ?? todo.done).length;
  }

  const selectedDayLabel =
    growthAgentDayNames[selectedDay] + (selectedDay === growthAgentToday ? " · Today" : "");

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
              setCompletedIds((previous) => ({
                ...previous,
                [item.id]: !isCompleted(item),
              }));
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
                  setIdeaStatus((previous) => ({ ...previous, [idea.id]: "approved" }));
                }}
              >
                <Check className="size-[13px] stroke-[3]" />
                Approve
              </SignalButton>
              <SignalButton
                variant="secondary"
                onClick={(event) => {
                  event.stopPropagation();
                  setIdeaStatus((previous) => ({ ...previous, [idea.id]: "postponed" }));
                }}
              >
                <Clock className="size-[13px]" />
                Snooze
              </SignalButton>
              <SignalButton
                variant="tertiary"
                onClick={(event) => {
                  event.stopPropagation();
                  setIdeaStatus((previous) => ({ ...previous, [idea.id]: "cancelled" }));
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
                setIdeaStatus((previous) => ({ ...previous, [idea.id]: "pending" }));
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
              todos: idea.todos,
            }}
            doneCount={getProjectDoneCount({
              id: idea.id,
              tag: "PROJECT",
              color: "#6a3fd1",
              colorBg: "rgba(106,63,209,0.1)",
              title: idea.title,
              meta: idea.meta,
              todos: idea.todos,
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
                  todos: idea.todos,
                },
              });
            }}
          />
        ))}

        {growthAgentProjects.map((project) => (
          <GrowthAgentProjectRow
            key={project.id}
            project={project}
            doneCount={getProjectDoneCount(project)}
            onOpen={() => {
              setDrawerContent({ kind: "project", project });
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
          setCompletedIds((previous) => ({ ...previous, [id]: true }));
          setDrawerContent(null);
        }}
        onToggleTodo={(projectId, todoId) => {
          const key = `${projectId}:${todoId}`;
          setTodoDone((previous) => ({
            ...previous,
            [key]: !(previous[key] ?? false),
          }));
        }}
        onApproveIdea={(id) => {
          setIdeaStatus((previous) => ({ ...previous, [id]: "approved" }));
          setDrawerContent(null);
        }}
        onPostponeIdea={(id) => {
          setIdeaStatus((previous) => ({ ...previous, [id]: "postponed" }));
          setDrawerContent(null);
        }}
        onCancelIdea={(id) => {
          setIdeaStatus((previous) => ({ ...previous, [id]: "cancelled" }));
          setDrawerContent(null);
        }}
      />

      <span className="sr-only">{openCount} open tasks</span>
    </div>
  );
}
