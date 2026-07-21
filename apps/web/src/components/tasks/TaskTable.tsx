import type {
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db/enums";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { TaskDurationBadge } from "@/components/tasks/TaskDurationBadge";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskPriorityBadge } from "@/components/tasks/TaskPriorityBadge";
import { TaskTypeBadge } from "@/components/tasks/TaskTypeBadge";
import { formatTaskDate, formatTaskDateTime } from "@/utils/taskDateTime";
import { useState } from "react";

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
  tasks: Array<Task>;
}

export function TaskTable({ productId, tasks }: Props) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  return (
    <>
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
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <p className="max-w-md text-sm whitespace-normal text-foreground">
                  {task.description}
                </p>
              </TableCell>
              <TableCell>
                <TaskTypeBadge contentType={task.contentType} network={task.network} />
              </TableCell>
              <TableCell>
                <TaskDurationBadge taskType={task.taskType} />
              </TableCell>
              <TableCell>
                <TaskPriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>{formatTaskDate(task.targetDate)}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                  <span>{formatTaskDateTime(task.scheduledStart)}</span>
                  <span>to {formatTaskDateTime(task.scheduledEnd)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit task"
                    onClick={() => {
                      setEditingTask(task);
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete task"
                    onClick={() => {
                      setDeletingTask(task);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TaskFormDialog
        productId={productId}
        task={editingTask}
        open={editingTask != null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTask(null);
          }
        }}
      />

      <DeleteTaskDialog
        productId={productId}
        taskId={deletingTask?.id ?? null}
        taskDescription={deletingTask?.description ?? null}
        open={deletingTask != null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingTask(null);
          }
        }}
      />
    </>
  );
}
