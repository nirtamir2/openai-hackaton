import {
  MarketingTaskContentType,
  MarketingTaskNetwork,
  MarketingTaskType,
} from "@app-template/db/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ListTodo, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "@/components/layout/Loader";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { getTaskListDateRange } from "@/utils/taskDateTime";
import { getOrpcErrorMessage } from "@/utils/getOrpcErrorMessage";
import { orpc } from "@/utils/orpc";

interface Props {
  productId: string;
}

export function TaskManagement({ productId }: Props) {
  const queryClient = useQueryClient();
  const dateRange = getTaskListDateRange();
  const [durationFilter, setDurationFilter] = useState<MarketingTaskType | "all">("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<MarketingTaskContentType | "all">(
    "all",
  );
  const [networkFilter, setNetworkFilter] = useState<MarketingTaskNetwork | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const tasksQuery = useQuery(
    orpc.calendar.getTasks.queryOptions({
      input: {
        productId,
        from: dateRange.from,
        to: dateRange.to,
        taskTypes: durationFilter === "all" ? undefined : [durationFilter],
        contentTypes: contentTypeFilter === "all" ? undefined : [contentTypeFilter],
        networks: networkFilter === "all" ? undefined : [networkFilter],
        priorities: priorityFilter === "all" ? undefined : [Number(priorityFilter)],
      },
    }),
  );

  const generateMutation = useMutation(
    orpc.generateMarketingTasks.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries({
          queryKey: orpc.calendar.getTasks.key({ input: { productId } }),
        });
        toast.success(`Generated ${String(result.marketingTasks.length)} tasks for today`);
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  const tasks = tasksQuery.data ?? [];
  const hasTasks = tasks.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={contentTypeFilter}
            onValueChange={(value) => {
              if (value == null) {
                return;
              }

              setContentTypeFilter(value as MarketingTaskContentType | "all");
            }}
          >
            <SelectTrigger variant="compact" size="sm">
              <SelectValue placeholder="All task types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All task types</SelectItem>
              <SelectItem value={MarketingTaskContentType.REPLY}>Reply</SelectItem>
              <SelectItem value={MarketingTaskContentType.POST}>Post</SelectItem>
              <SelectItem value={MarketingTaskContentType.VIDEO}>Video</SelectItem>
              <SelectItem value={MarketingTaskContentType.IMAGE}>Image</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={networkFilter}
            onValueChange={(value) => {
              if (value == null) {
                return;
              }

              setNetworkFilter(value as MarketingTaskNetwork | "all");
            }}
          >
            <SelectTrigger variant="compact" size="sm">
              <SelectValue placeholder="All networks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All networks</SelectItem>
              <SelectItem value={MarketingTaskNetwork.X}>X</SelectItem>
              <SelectItem value={MarketingTaskNetwork.REDDIT}>Reddit</SelectItem>
              <SelectItem value={MarketingTaskNetwork.LINKEDIN}>LinkedIn</SelectItem>
              <SelectItem value={MarketingTaskNetwork.YOUTUBE}>YouTube</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={durationFilter}
            onValueChange={(value) => {
              if (value == null) {
                return;
              }

              setDurationFilter(value as MarketingTaskType | "all");
            }}
          >
            <SelectTrigger variant="compact" size="sm">
              <SelectValue placeholder="All durations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All durations</SelectItem>
              <SelectItem value={MarketingTaskType.SHORT}>Short tasks</SelectItem>
              <SelectItem value={MarketingTaskType.LONG}>Ongoing projects</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={priorityFilter}
            onValueChange={(value) => {
              if (value == null) {
                return;
              }

              setPriorityFilter(value);
            }}
          >
            <SelectTrigger variant="compact" size="sm">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="1">Critical</SelectItem>
              <SelectItem value="2">High</SelectItem>
              <SelectItem value="3">Medium</SelectItem>
              <SelectItem value="4">Low</SelectItem>
              <SelectItem value="5">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              generateMutation.mutate({ productId, forToday: true });
            }}
            disabled={generateMutation.isPending}
          >
            <Sparkles className="size-4" />
            {generateMutation.isPending ? "Generating..." : "Generate today's tasks"}
          </Button>
          <Button
            onClick={() => {
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="size-4" />
            New task
          </Button>
        </div>
      </div>

      {tasksQuery.isLoading ? <Loader /> : null}

      {tasksQuery.isSuccess && !hasTasks ? (
        <Card>
          <CardHeader>
            <ListTodo className="size-5 text-primary" />
            <CardTitle>No tasks yet</CardTitle>
            <CardDescription>
              Create a task manually or generate marketing tasks from product sentiment data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  generateMutation.mutate({ productId, forToday: true });
                }}
                disabled={generateMutation.isPending}
              >
                <Sparkles className="size-4" />
                Generate today's tasks
              </Button>
              <Button
                onClick={() => {
                  setCreateDialogOpen(true);
                }}
              >
                <Plus className="size-4" />
                Create task
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {tasksQuery.isSuccess && hasTasks ? (
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              {tasks.length} marketing {tasks.length === 1 ? "task" : "tasks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable productId={productId} tasks={tasks} />
          </CardContent>
        </Card>
      ) : null}

      <TaskFormDialog
        productId={productId}
        task={null}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
