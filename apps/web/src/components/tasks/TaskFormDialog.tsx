import { MarketingTaskType } from "@app-template/db/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface Task {
  id: string;
  description: string;
  taskType: MarketingTaskType;
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
  priority: string;
  targetDate: string;
  scheduledStart: string;
  scheduledEnd: string;
}

function getInitialFormState(task: Task | null): FormState {
  if (task != null) {
    return {
      description: task.description,
      taskType: task.taskType,
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

    const priority = Number(formState.priority);
    const targetDate = new Date(`${formState.targetDate}T00:00:00`);
    const scheduledStart = new Date(formState.scheduledStart);
    const scheduledEnd = new Date(formState.scheduledEnd);

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
              <Field label="Type" htmlFor="task-type">
                <Select
                  value={formState.taskType}
                  onValueChange={(value) => {
                    if (value == null) {
                      return;
                    }

                    setFormState((current) => ({
                      ...current,
                      taskType: value as MarketingTaskType,
                    }));
                  }}
                >
                  <SelectTrigger id="task-type" variant="full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MarketingTaskType.SHORT}>Short-term</SelectItem>
                    <SelectItem value={MarketingTaskType.LONG}>Long-term</SelectItem>
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
