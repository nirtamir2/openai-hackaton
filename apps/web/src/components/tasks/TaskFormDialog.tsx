import {
  createMarketingTaskSubtaskId,
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  getDefaultScheduleDates,
  toDateInputValue,
  toDatetimeLocalValue,
} from "@/utils/taskDateTime";
import { orpc } from "@/utils/orpc";

interface TaskSubtask {
  id: string;
  text: string;
  done: boolean;
}

interface Task {
  id: string;
  description: string;
  taskType: MarketingTaskType;
  contentType: MarketingTaskContentType;
  network: MarketingTaskNetwork;
  subtasks: unknown;
  priority: number;
  targetDate: Date | string;
  scheduledStart: Date | string;
  scheduledEnd: Date | string;
}

interface Props {
  productId: string;
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  description: string;
  taskType: MarketingTaskType;
  contentType: MarketingTaskContentType;
  network: MarketingTaskNetwork;
  subtasks: Array<TaskSubtask>;
  priority: string;
  targetDate: string;
  scheduledStart: string;
  scheduledEnd: string;
}

function readSubtasks(value: unknown): Array<TaskSubtask> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((subtask) => {
    if (typeof subtask !== "object" || subtask == null) {
      return [];
    }

    const record = subtask as Record<string, unknown>;
    const id = record.id;
    const text = record.text;
    const done = record.done;

    if (typeof id !== "string" || typeof text !== "string") {
      return [];
    }

    return [
      {
        id,
        text,
        done: typeof done === "boolean" ? done : false,
      },
    ];
  });
}

function getInitialFormState(task: Task | null): FormState {
  if (task != null) {
    return {
      description: task.description,
      taskType: task.taskType,
      contentType: task.contentType,
      network: task.network,
      subtasks: readSubtasks(task.subtasks),
      priority: String(task.priority),
      targetDate: toDateInputValue(task.targetDate),
      scheduledStart: toDatetimeLocalValue(task.scheduledStart),
      scheduledEnd: toDatetimeLocalValue(task.scheduledEnd),
    };
  }

  const defaults = getDefaultScheduleDates();

  return {
    description: "",
    taskType: MarketingTaskType.SHORT,
    contentType: MarketingTaskContentType.POST,
    network: MarketingTaskNetwork.X,
    subtasks: [],
    priority: "3",
    targetDate: toDateInputValue(defaults.targetDate),
    scheduledStart: toDatetimeLocalValue(defaults.scheduledStart),
    scheduledEnd: toDatetimeLocalValue(defaults.scheduledEnd),
  };
}

export function TaskFormDialog({ productId, task, open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const isEditing = task != null;
  const [formState, setFormState] = useState<FormState>(() => getInitialFormState(task));

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setFormState(getInitialFormState(task));
    }

    onOpenChange(nextOpen);
  }

  const createMutation = useMutation(
    orpc.calendar.createTask.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.calendar.getTasks.key({ input: { productId } }),
        });
        toast.success("Task created");
        onOpenChange(false);
      },
    }),
  );

  const updateMutation = useMutation(
    orpc.calendar.updateTask.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.calendar.getTasks.key({ input: { productId } }),
        });
        toast.success("Task updated");
        onOpenChange(false);
      },
    }),
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
  const isLongTask = formState.taskType === MarketingTaskType.LONG;

  function getSubmitButtonLabel() {
    if (isPending) {
      return "Saving...";
    }

    if (isEditing) {
      return "Save changes";
    }

    return "Create task";
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formState.description.trim().length === 0) {
      toast.error("Description is required");
      return;
    }

    if (isLongTask && formState.subtasks.filter((subtask) => subtask.text.trim().length > 0).length < 2) {
      toast.error("Ongoing projects need at least 2 subtasks");
      return;
    }

    const priority = Number(formState.priority);
    const targetDate = new Date(`${formState.targetDate}T00:00:00`);
    const scheduledStart = new Date(formState.scheduledStart);
    const scheduledEnd = new Date(formState.scheduledEnd);
    const subtasks = isLongTask
      ? formState.subtasks
          .map((subtask) => ({
            id: subtask.id,
            text: subtask.text.trim(),
            done: subtask.done,
          }))
          .filter((subtask) => subtask.text.length > 0)
      : [];

    if (scheduledStart >= scheduledEnd) {
      toast.error("Scheduled end must be after scheduled start");
      return;
    }

    if (isEditing) {
      updateMutation.mutate({
        productId,
        taskId: task.id,
        description: formState.description.trim(),
        taskType: formState.taskType,
        contentType: formState.contentType,
        network: formState.network,
        subtasks,
        priority,
        targetDate,
        scheduledStart,
        scheduledEnd,
      });
      return;
    }

    createMutation.mutate({
      productId,
      description: formState.description.trim(),
      taskType: formState.taskType,
      contentType: formState.contentType,
      network: formState.network,
      subtasks,
      priority,
      targetDate,
      scheduledStart,
      scheduledEnd,
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit task" : "Create task"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the marketing task details and schedule."
                : "Add a new marketing task with a target date and calendar block."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field label="Description" htmlFor="task-description">
              <Textarea
                id="task-description"
                value={formState.description}
                onChange={(event) => {
                  setFormState((current) => ({
                    ...current,
                    description: event.target.value,
                  }));
                }}
                rows={3}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Duration" htmlFor="task-duration">
                <Select
                  value={formState.taskType}
                  onValueChange={(value) => {
                    if (value == null) {
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      taskType: value as MarketingTaskType,
                      subtasks:
                        value === MarketingTaskType.LONG && current.subtasks.length === 0
                          ? [
                              { id: createMarketingTaskSubtaskId(), text: "", done: false },
                              { id: createMarketingTaskSubtaskId(), text: "", done: false },
                            ]
                          : current.subtasks,
                    }));
                  }}
                >
                  <SelectTrigger id="task-duration" variant="full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MarketingTaskType.SHORT}>Short task</SelectItem>
                    <SelectItem value={MarketingTaskType.LONG}>Ongoing project</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority" htmlFor="task-priority">
                <Select
                  value={formState.priority}
                  onValueChange={(value) => {
                    if (value == null) {
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      priority: value,
                    }));
                  }}
                >
                  <SelectTrigger id="task-priority" variant="full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 — Critical</SelectItem>
                    <SelectItem value="2">2 — High</SelectItem>
                    <SelectItem value="3">3 — Medium</SelectItem>
                    <SelectItem value="4">4 — Low</SelectItem>
                    <SelectItem value="5">5 — Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Task type" htmlFor="task-content-type">
                <Select
                  value={formState.contentType}
                  onValueChange={(value) => {
                    if (value == null) {
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      contentType: value as MarketingTaskContentType,
                    }));
                  }}
                >
                  <SelectTrigger id="task-content-type" variant="full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MarketingTaskContentType.REPLY}>Reply</SelectItem>
                    <SelectItem value={MarketingTaskContentType.POST}>Post</SelectItem>
                    <SelectItem value={MarketingTaskContentType.VIDEO}>Video</SelectItem>
                    <SelectItem value={MarketingTaskContentType.IMAGE}>Image</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Network" htmlFor="task-network">
                <Select
                  value={formState.network}
                  onValueChange={(value) => {
                    if (value == null) {
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      network: value as MarketingTaskNetwork,
                    }));
                  }}
                >
                  <SelectTrigger id="task-network" variant="full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MarketingTaskNetwork.X}>X</SelectItem>
                    <SelectItem value={MarketingTaskNetwork.REDDIT}>Reddit</SelectItem>
                    <SelectItem value={MarketingTaskNetwork.LINKEDIN}>LinkedIn</SelectItem>
                    <SelectItem value={MarketingTaskNetwork.YOUTUBE}>YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {isLongTask ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">Subtasks</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormState((current) => ({
                        ...current,
                        subtasks: [
                          ...current.subtasks,
                          { id: createMarketingTaskSubtaskId(), text: "", done: false },
                        ],
                      }));
                    }}
                  >
                    <Plus className="size-3.5" />
                    Add subtask
                  </Button>
                </div>
                {formState.subtasks.map((subtask, index) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Input
                      value={subtask.text}
                      placeholder={`Subtask ${String(index + 1)}`}
                      onChange={(event) => {
                        setFormState((current) => ({
                          ...current,
                          subtasks: current.subtasks.map((item) =>
                            item.id === subtask.id
                              ? { ...item, text: event.target.value }
                              : item,
                          ),
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove subtask"
                      onClick={() => {
                        setFormState((current) => ({
                          ...current,
                          subtasks: current.subtasks.filter((item) => item.id !== subtask.id),
                        }));
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            <Field label="Target date" htmlFor="task-target-date">
              <Input
                id="task-target-date"
                type="date"
                value={formState.targetDate}
                onChange={(event) => {
                  setFormState((current) => ({
                    ...current,
                    targetDate: event.target.value,
                  }));
                }}
                required
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Scheduled start" htmlFor="task-scheduled-start">
                <Input
                  id="task-scheduled-start"
                  type="datetime-local"
                  value={formState.scheduledStart}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      scheduledStart: event.target.value,
                    }));
                  }}
                  required
                />
              </Field>

              <Field label="Scheduled end" htmlFor="task-scheduled-end">
                <Input
                  id="task-scheduled-end"
                  type="datetime-local"
                  value={formState.scheduledEnd}
                  onChange={(event) => {
                    setFormState((current) => ({
                      ...current,
                      scheduledEnd: event.target.value,
                    }));
                  }}
                  required
                />
              </Field>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {getSubmitButtonLabel()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
