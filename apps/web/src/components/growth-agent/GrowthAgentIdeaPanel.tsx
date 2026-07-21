import { Check, Clock } from "lucide-react";
import type { GrowthAgentIdea } from "@/components/growth-agent/growthAgentTypes";
import { SignalButton } from "@/components/home/SignalButton";
import { TaskTypeBadge } from "@/components/tasks/TaskTypeBadge";

interface Props {
  pendingIdeas: Array<GrowthAgentIdea>;
  postponedIdeas: Array<GrowthAgentIdea>;
  showEmptyState: boolean;
  onOpenIdea: (idea: GrowthAgentIdea) => void;
  onApprove: (entryId: string) => void;
  onPostpone: (entryId: string) => void;
  onCancel: (entryId: string) => void;
  onReconsider: (entryId: string) => void;
}

export function GrowthAgentIdeaPanel({
  pendingIdeas,
  postponedIdeas,
  showEmptyState,
  onOpenIdea,
  onApprove,
  onPostpone,
  onCancel,
  onReconsider,
}: Props) {
  const hasIdeas = pendingIdeas.length > 0 || postponedIdeas.length > 0;

  return (
    <div className="flex flex-col gap-2">
      {pendingIdeas.map((idea) => (
        <div
          key={idea.id}
          role="button"
          tabIndex={0}
          onClick={() => {
            onOpenIdea(idea);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenIdea(idea);
            }
          }}
          className="cursor-pointer rounded-[10px] border-[1.5px] border-dashed border-[rgba(106,63,209,0.35)] bg-[rgba(106,63,209,0.06)] p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10.5px] font-semibold tracking-[0.3px] text-[#6a3fd1]">
              NEW IDEA
            </span>
            {idea.network != null && idea.contentType != null ? (
              <TaskTypeBadge contentType={idea.contentType} network={idea.network} />
            ) : null}
          </div>
          <p className="mt-1.5 text-[15px] font-semibold text-[rgba(23,20,15,0.9)]">{idea.title}</p>
          <p className="mt-1 text-xs text-[rgba(23,20,15,0.42)]">{idea.meta}</p>
          <p className="mt-2.5 mb-4 line-clamp-2 text-sm leading-[1.55] text-[rgba(23,20,15,0.75)]">
            {idea.description}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <SignalButton
              variant="primary"
              onClick={(event) => {
                event.stopPropagation();
                onApprove(idea.id);
              }}
            >
              <Check className="size-[13px] stroke-[3]" />
              Approve
            </SignalButton>
            <SignalButton
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation();
                onPostpone(idea.id);
              }}
            >
              <Clock className="size-[13px]" />
              Snooze
            </SignalButton>
            <SignalButton
              variant="tertiary"
              onClick={(event) => {
                event.stopPropagation();
                onCancel(idea.id);
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
              onReconsider(idea.id);
            }}
            className="shrink-0 text-[12.5px] font-semibold whitespace-nowrap text-[#6a3fd1]"
          >
            Reconsider
          </button>
        </div>
      ))}

      {!hasIdeas && showEmptyState ? (
        <p className="py-[18px] text-center text-[13.5px] text-[rgba(23,20,15,0.35)]">
          No new video ad ideas yet. Generate tasks to get fresh Meta video ad concepts.
        </p>
      ) : null}
    </div>
  );
}
