import { Drawer } from "@base-ui/react/drawer";
import clsx from "clsx";
import { Check, Clock, ExternalLink, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type {
  GrowthAgentFeedItem,
  GrowthAgentIdea,
  GrowthAgentProject,
} from "@/components/growth-agent/growthAgentTypes";
import { SignalButton } from "@/components/home/SignalButton";
import { TaskTypeBadge } from "@/components/tasks/TaskTypeBadge";

type DrawerContent =
  | { kind: "item"; item: GrowthAgentFeedItem }
  | { kind: "project"; project: GrowthAgentProject }
  | { kind: "idea"; idea: GrowthAgentIdea };

interface Props {
  content: DrawerContent | null;
  todoDone: Record<string, boolean>;
  onClose: () => void;
  onMarkComplete: (id: string) => void;
  onToggleTodo: (projectId: string, todoId: string) => void;
  onApproveIdea: (id: string) => void;
  onPostponeIdea: (id: string) => void;
  onCancelIdea: (id: string) => void;
}

function DrawerSectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2.5 font-mono text-[10.5px] font-semibold tracking-[0.3px] text-[rgba(23,20,15,0.4)] uppercase">
      {children}
    </p>
  );
}

function getDrawerContentKey(content: DrawerContent) {
  if (content.kind === "item") {
    return `item-${content.item.id}`;
  }

  if (content.kind === "project") {
    return `project-${content.project.id}`;
  }

  return `idea-${content.idea.id}`;
}

function TaskPreviewSection({
  children,
  delayMs,
}: {
  children: ReactNode;
  delayMs: number;
}) {
  return (
    <div
      className="growth-task-preview-enter"
      style={{ animationDelay: `${String(delayMs)}ms` }}
    >
      {children}
    </div>
  );
}

function WhyBlock({ text }: { text: string }) {
  return (
    <div className="mb-[18px] rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[#f7f5f1] p-4">
      <DrawerSectionLabel>Why I'm suggesting this</DrawerSectionLabel>
      <p className="text-[13.5px] leading-[1.6] text-[rgba(23,20,15,0.75)]">{text}</p>
    </div>
  );
}

export function GrowthAgentTaskDrawer({
  content,
  todoDone,
  onClose,
  onMarkComplete,
  onToggleTodo,
  onApproveIdea,
  onPostponeIdea,
  onCancelIdea,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedX, setCopiedX] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);

  async function copyText({ text, onCopied }: { text: string; onCopied: () => void }) {
    await navigator.clipboard.writeText(text);
    onCopied();
  }

  return (
    <Drawer.Root
      open={content != null}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setCopied(false);
          setCopiedX(false);
          setCopiedLinkedIn(false);
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-20 bg-[rgba(23,20,15,0.4)] transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-20 flex justify-end">
          <Drawer.Popup
            className="flex h-full w-[min(460px,100vw)] flex-col overflow-y-auto bg-white p-[30px] shadow-[-8px_0_24px_rgba(23,20,15,0.15)] transition-transform data-ending-style:translate-x-full data-starting-style:translate-x-full data-ending-style:duration-200 motion-reduce:transition-none motion-reduce:data-ending-style:translate-x-0 motion-reduce:data-starting-style:translate-x-0"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {content == null ? null : (
              <div key={getDrawerContentKey(content)} className="flex flex-col">
                <TaskPreviewSection delayMs={0}>
                  <div className="mb-[22px] flex items-center justify-between">
                  {content.kind === "item" ? (
                    <span
                      className="rounded-[5px] px-[9px] py-1 font-mono text-[11px] font-semibold tracking-[0.2px]"
                      style={{
                        color: content.item.color,
                        backgroundColor: content.item.colorBg,
                      }}
                    >
                      {content.item.tag}
                    </span>
                  ) : content.kind === "idea" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[5px] bg-[rgba(106,63,209,0.1)] px-[9px] py-1 font-mono text-[11px] font-semibold tracking-[0.2px] text-[#6a3fd1]">
                        NEW IDEA
                      </span>
                      {content.idea.network != null && content.idea.contentType != null ? (
                        <TaskTypeBadge
                          contentType={content.idea.contentType}
                          network={content.idea.network}
                        />
                      ) : null}
                    </div>
                  ) : (
                    <span
                      className="rounded-[5px] px-[9px] py-1 font-mono text-[11px] font-semibold tracking-[0.2px]"
                      style={{
                        color: content.project.color,
                        backgroundColor: content.project.colorBg,
                      }}
                    >
                      {content.project.tag}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xl leading-none text-[rgba(23,20,15,0.4)]"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                </TaskPreviewSection>

                {content.kind === "item" ? (
                  <ItemDrawerBody
                    item={content.item}
                    copied={copied}
                    copiedX={copiedX}
                    copiedLinkedIn={copiedLinkedIn}
                    onMarkComplete={() => {
                      onMarkComplete(content.item.id);
                    }}
                    onClose={onClose}
                    onCopy={(text) => {
                      void copyText({
                        text,
                        onCopied: () => {
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 1500);
                        },
                      });
                    }}
                    onCopyX={(text) => {
                      void copyText({
                        text,
                        onCopied: () => {
                          setCopiedX(true);
                          setTimeout(() => {
                            setCopiedX(false);
                          }, 1500);
                        },
                      });
                    }}
                    onCopyLinkedIn={(text) => {
                      void copyText({
                        text,
                        onCopied: () => {
                          setCopiedLinkedIn(true);
                          setTimeout(() => {
                            setCopiedLinkedIn(false);
                          }, 1500);
                        },
                      });
                    }}
                  />
                ) : null}

                {content.kind === "project" ? (
                  <ProjectDrawerBody
                    project={content.project}
                    todoDone={todoDone}
                    onToggleTodo={onToggleTodo}
                  />
                ) : null}

                {content.kind === "idea" ? (
                  <IdeaDrawerBody
                    idea={content.idea}
                    todoDone={todoDone}
                    onToggleTodo={onToggleTodo}
                    onApprove={() => {
                      onApproveIdea(content.idea.id);
                    }}
                    onPostpone={() => {
                      onPostponeIdea(content.idea.id);
                    }}
                    onCancel={() => {
                      onCancelIdea(content.idea.id);
                    }}
                  />
                ) : null}
              </div>
            )}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function ItemDrawerBody({
  item,
  copied,
  copiedX,
  copiedLinkedIn,
  onMarkComplete,
  onClose,
  onCopy,
  onCopyX,
  onCopyLinkedIn,
}: {
  item: GrowthAgentFeedItem;
  copied: boolean;
  copiedX: boolean;
  copiedLinkedIn: boolean;
  onMarkComplete: () => void;
  onClose: () => void;
  onCopy: (text: string) => void;
  onCopyX: (text: string) => void;
  onCopyLinkedIn: (text: string) => void;
}) {
  const taskDescription = item.description ?? item.why;

  return (
    <>
      <TaskPreviewSection delayMs={60}>
        <p className="mb-4 text-[12.5px] text-[rgba(23,20,15,0.45)]">{item.meta}</p>
      </TaskPreviewSection>

      {item.why != null && item.why !== taskDescription ? (
        <TaskPreviewSection delayMs={120}>
          <WhyBlock text={item.why} />
        </TaskPreviewSection>
      ) : null}

      {item.type === "reddit" ? (
        <>
          <TaskPreviewSection delayMs={180}>
            <p className="mb-5 text-[15px] leading-[1.6] text-[rgba(23,20,15,0.85)]">{item.quote}</p>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={240}>
            <div className="mb-4 rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[#f7f5f1] p-4">
              <DrawerSectionLabel>Drafted reply</DrawerSectionLabel>
              <p className="text-sm leading-[1.6] text-[rgba(23,20,15,0.85)]">{item.reply}</p>
            </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={300}>
            <div className="mb-[18px] flex flex-wrap gap-2.5">
            <SignalButton
              variant="primary"
              onClick={() => {
                if (item.reply != null) {
                  onCopy(item.reply);
                }
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </SignalButton>
            {item.threadUrl != null ? (
              <a
                href={item.threadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(23,20,15,0.15)] px-4 py-2 text-sm font-medium text-[#17140f]"
              >
                Open thread
                <ExternalLink className="size-3.5" />
              </a>
            ) : null}
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={360}>
          <div className="flex items-center gap-2.5 border-t border-[rgba(23,20,15,0.08)] pt-[18px]">
            <SignalButton variant="accent" onClick={onMarkComplete}>
              Mark as posted
            </SignalButton>
            <SignalButton variant="tertiary" onClick={onClose}>
              Skip
            </SignalButton>
          </div>
          </TaskPreviewSection>
        </>
      ) : null}

      {item.type === "ad" ? (
        <>
          <TaskPreviewSection delayMs={180}>
          <div className="mb-[18px] flex h-[180px] flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[rgba(23,20,15,0.2)] text-[12.5px] text-[rgba(23,20,15,0.35)]">
            {item.creativeLabel}
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={240}>
          <div className="mb-3.5">
            <DrawerSectionLabel>Headline</DrawerSectionLabel>
            <p className="text-[15px] font-semibold text-[rgba(23,20,15,0.9)]">{item.headline}</p>
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={300}>
          <div className="mb-[18px]">
            <DrawerSectionLabel>Body copy</DrawerSectionLabel>
            <p className="text-sm leading-[1.6] text-[rgba(23,20,15,0.8)]">{item.body}</p>
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={360}>
          <div className="mb-[18px] flex gap-[18px] text-[13px] text-[rgba(23,20,15,0.6)]">
            <div>
              <span className="text-[rgba(23,20,15,0.4)]">Format</span>
              <p className="font-semibold text-[rgba(23,20,15,0.85)]">{item.format}</p>
            </div>
            <div>
              <span className="text-[rgba(23,20,15,0.4)]">Platform</span>
              <p className="font-semibold text-[rgba(23,20,15,0.85)]">{item.platform}</p>
            </div>
            <div>
              <span className="text-[rgba(23,20,15,0.4)]">Est. budget</span>
              <p className="font-semibold text-[rgba(23,20,15,0.85)]">{item.budget}</p>
            </div>
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={420}>
          <div className="flex items-center gap-2.5 border-t border-[rgba(23,20,15,0.08)] pt-[18px]">
            <SignalButton variant="accent" onClick={onMarkComplete}>
              Create ad
            </SignalButton>
            <SignalButton variant="secondary">Edit copy</SignalButton>
          </div>
          </TaskPreviewSection>
        </>
      ) : null}

      {item.type === "post" ? (
        <>
          {taskDescription != null ? (
            <TaskPreviewSection delayMs={120}>
              <p className="mb-5 text-[15px] leading-[1.6] whitespace-pre-line text-[rgba(23,20,15,0.85)]">
                {taskDescription}
              </p>
            </TaskPreviewSection>
          ) : null}
          {item.draftBody != null ? (
            <TaskPreviewSection delayMs={taskDescription != null ? 180 : 120}>
              <div className="mb-4 rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[#f7f5f1] p-4">
                <DrawerSectionLabel>Drafted post</DrawerSectionLabel>
                <p className="text-sm leading-[1.6] whitespace-pre-line text-[rgba(23,20,15,0.85)]">
                  {item.draftBody}
                </p>
              </div>
            </TaskPreviewSection>
          ) : null}
          <TaskPreviewSection
            delayMs={item.draftBody != null ? 240 : taskDescription != null ? 180 : 120}
          >
          <div className="flex items-center gap-2.5 border-t border-[rgba(23,20,15,0.08)] pt-[18px]">
            <SignalButton
              variant="primary"
              onClick={() => {
                const copyText = item.draftBody ?? taskDescription;

                if (copyText != null) {
                  onCopy(copyText);
                }
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </SignalButton>
            <SignalButton variant="accent" onClick={onMarkComplete}>
              Publish
            </SignalButton>
            <SignalButton variant="tertiary" onClick={onClose}>
              Skip
            </SignalButton>
          </div>
          </TaskPreviewSection>
        </>
      ) : null}

      {item.type === "newsjack" ? (
        <>
          <TaskPreviewSection delayMs={180}>
          <div className="mb-3.5 rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[#f7f5f1] p-4">
            <DrawerSectionLabel>X post</DrawerSectionLabel>
            <p className="text-sm leading-[1.6] whitespace-pre-line text-[rgba(23,20,15,0.85)]">
              {item.draftBodyX}
            </p>
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={240}>
          <div className="mb-4 rounded-[10px] border border-[rgba(23,20,15,0.08)] bg-[#f7f5f1] p-4">
            <DrawerSectionLabel>LinkedIn post</DrawerSectionLabel>
            <p className="text-sm leading-[1.6] whitespace-pre-line text-[rgba(23,20,15,0.85)]">
              {item.draftBodyLinkedIn}
            </p>
          </div>
          </TaskPreviewSection>
          <TaskPreviewSection delayMs={300}>
          <div className="flex flex-wrap items-center gap-2.5 border-t border-[rgba(23,20,15,0.08)] pt-[18px]">
            <SignalButton
              variant="primary"
              onClick={() => {
                if (item.draftBodyX != null) {
                  onCopyX(item.draftBodyX);
                }
              }}
            >
              {copiedX ? "Copied!" : "Copy X post"}
            </SignalButton>
            <SignalButton
              variant="secondary"
              onClick={() => {
                if (item.draftBodyLinkedIn != null) {
                  onCopyLinkedIn(item.draftBodyLinkedIn);
                }
              }}
            >
              {copiedLinkedIn ? "Copied!" : "Copy LinkedIn post"}
            </SignalButton>
            <SignalButton variant="accent" onClick={onMarkComplete}>
              Publish both
            </SignalButton>
          </div>
          </TaskPreviewSection>
        </>
      ) : null}
    </>
  );
}

function ProjectDrawerBody({
  project,
  todoDone,
  onToggleTodo,
}: {
  project: GrowthAgentProject;
  todoDone: Record<string, boolean>;
  onToggleTodo: (projectId: string, todoId: string) => void;
}) {
  return (
    <>
      {project.description != null ? (
        <TaskPreviewSection delayMs={60}>
          <p className="mb-5 text-[14.5px] leading-[1.6] text-[rgba(23,20,15,0.85)]">
            {project.description}
          </p>
        </TaskPreviewSection>
      ) : null}

      {project.why != null ? (
        <TaskPreviewSection delayMs={120}>
          <WhyBlock text={project.why} />
        </TaskPreviewSection>
      ) : null}

      {project.todos.length > 0 ? (
        <TaskPreviewSection delayMs={180}>
          <>
            <DrawerSectionLabel>To-do</DrawerSectionLabel>
            <div className="flex flex-col gap-2.5">
            {project.todos.map((todo) => {
              const key = `${project.id}:${todo.id}`;
              const done = todoDone[key] ?? todo.done;

              return (
                <div key={todo.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleTodo(project.id, todo.id);
                    }}
                    className={clsx(
                      "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                      done
                        ? "border-[#6a3fd1] bg-[#6a3fd1]"
                        : "border-[rgba(23,20,15,0.25)] bg-transparent",
                    )}
                  >
                    {done ? <Check className="size-[10px] stroke-[3] text-white" /> : null}
                  </button>
                  <span
                    className={clsx(
                      "flex-1 text-sm text-[rgba(23,20,15,0.8)]",
                      done ? "line-through" : "no-underline",
                    )}
                  >
                    {todo.text}
                  </span>
                  {todo.hireUrl != null ? (
                    <a
                      href={todo.hireUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-md bg-[#17140f] px-2.5 py-[5px] text-xs font-semibold whitespace-nowrap text-white"
                    >
                      Hire
                      <ExternalLink className="ms-1 inline size-3" />
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
          </>
        </TaskPreviewSection>
      ) : null}
    </>
  );
}

function IdeaDrawerBody({
  idea,
  todoDone,
  onToggleTodo,
  onApprove,
  onPostpone,
  onCancel,
}: {
  idea: GrowthAgentIdea;
  todoDone: Record<string, boolean>;
  onToggleTodo: (projectId: string, todoId: string) => void;
  onApprove: () => void;
  onPostpone: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <TaskPreviewSection delayMs={60}>
        <p className="mb-1 text-[12.5px] text-[rgba(23,20,15,0.45)]">{idea.meta}</p>
        <p className="mb-4 text-[17px] font-semibold text-[rgba(23,20,15,0.9)]">{idea.title}</p>
        <p className="mb-[22px] text-[14.5px] leading-[1.6] text-[rgba(23,20,15,0.85)]">
          {idea.description}
        </p>
      </TaskPreviewSection>

      {idea.why != null ? (
        <TaskPreviewSection delayMs={120}>
          <WhyBlock text={idea.why} />
        </TaskPreviewSection>
      ) : null}

      {idea.todos.length > 0 ? (
        <TaskPreviewSection delayMs={180}>
          <>
            <DrawerSectionLabel>How to create it</DrawerSectionLabel>
            <div className="mb-[22px] flex flex-col gap-2.5">
              {idea.todos.map((todo) => {
                const key = `${idea.id}:${todo.id}`;
                const done = todoDone[key] ?? todo.done;

                return (
                  <div key={todo.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleTodo(idea.id, todo.id);
                      }}
                      className={clsx(
                        "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                        done
                          ? "border-[#6a3fd1] bg-[#6a3fd1]"
                          : "border-[rgba(23,20,15,0.25)] bg-transparent",
                      )}
                    >
                      {done ? <Check className="size-[10px] stroke-[3] text-white" /> : null}
                    </button>
                    <span
                      className={clsx(
                        "flex-1 text-sm text-[rgba(23,20,15,0.8)]",
                        done ? "line-through" : "no-underline",
                      )}
                    >
                      {todo.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        </TaskPreviewSection>
      ) : null}

      <TaskPreviewSection delayMs={240}>
      <div className="flex flex-wrap items-center gap-2.5 border-t border-[rgba(23,20,15,0.08)] pt-[18px]">
        <SignalButton variant="primary" onClick={onApprove}>
          <Check className="size-[13px] stroke-[3]" />
          Approve
        </SignalButton>
        <SignalButton variant="secondary" onClick={onPostpone}>
          <Clock className="size-[13px]" />
          Snooze
        </SignalButton>
        <SignalButton variant="tertiary" onClick={onCancel}>
          Not interested
        </SignalButton>
      </div>
      </TaskPreviewSection>
    </>
  );
}
