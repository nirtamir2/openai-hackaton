import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { GrowthAgentDayKey } from "@/components/growth-agent/growthAgentTypes";
import { growthAgentDayNames } from "@/components/growth-agent/growthAgentTypes";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { getOrpcErrorMessage } from "@/utils/getOrpcErrorMessage";
import { orpc } from "@/utils/orpc";

interface Props {
  productId: string;
  dayKey: GrowthAgentDayKey;
  taskCount: number;
  ideaCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoved: () => void;
}

export function RemoveDayTasksDialog({
  productId,
  dayKey,
  taskCount,
  ideaCount,
  open,
  onOpenChange,
  onRemoved,
}: Props) {
  const queryClient = useQueryClient();
  const dayName = growthAgentDayNames[dayKey];
  const taskLabel = taskCount === 1 ? "task" : "tasks";
  const ideaLabel = ideaCount === 1 ? "idea" : "ideas";
  const removalSummary =
    ideaCount > 0
      ? `all ${String(taskCount)} ${taskLabel} scheduled for ${dayName} and ${String(ideaCount)} video ad ${ideaLabel}`
      : `all ${String(taskCount)} ${taskLabel} scheduled for ${dayName}`;

  const removeMutation = useMutation(
    orpc.feed.removeDayTasks.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries({
          queryKey: orpc.feed.getFeed.key({ input: { productId } }),
        });
        await queryClient.invalidateQueries({
          queryKey: orpc.calendar.getTasks.key({ input: { productId } }),
        });
        toast.success(
          `Removed ${String(result.removedCount)} ${result.removedCount === 1 ? "item" : "items"}`,
        );
        onRemoved();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(getOrpcErrorMessage({ error }));
      },
    }),
  );

  function handleRemove() {
    removeMutation.mutate({ productId, dayKey });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Remove all tasks</AlertDialogTitle>
        <AlertDialogDescription>
          {`Are you sure you want to remove ${removalSummary}? This action cannot be undone.`}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogClose
            render={
              <Button variant="outline" disabled={removeMutation.isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={removeMutation.isPending || taskCount === 0}
          >
            {removeMutation.isPending ? "Removing..." : "Remove all"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
