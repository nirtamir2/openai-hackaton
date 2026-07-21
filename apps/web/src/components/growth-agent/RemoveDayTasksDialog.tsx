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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemoved: () => void;
}

export function RemoveDayTasksDialog({
  productId,
  dayKey,
  taskCount,
  open,
  onOpenChange,
  onRemoved,
}: Props) {
  const queryClient = useQueryClient();
  const dayName = growthAgentDayNames[dayKey];
  const taskLabel = taskCount === 1 ? "task" : "tasks";

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
          `Removed ${String(result.removedCount)} ${result.removedCount === 1 ? "task" : "tasks"}`,
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
          {`Are you sure you want to remove all ${String(taskCount)} ${taskLabel} scheduled for ${dayName}? This action cannot be undone.`}
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
