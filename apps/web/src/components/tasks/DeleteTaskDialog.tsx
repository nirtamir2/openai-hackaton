import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { orpc } from "@/utils/orpc";

interface Props {
  productId: string;
  taskId: string | null;
  taskDescription: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTaskDialog({
  productId,
  taskId,
  taskDescription,
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    orpc.calendar.deleteTask.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: orpc.calendar.getTasks.key({ input: { productId } }),
        });
        toast.success("Task deleted");
        onOpenChange(false);
      },
    }),
  );

  function handleDelete() {
    if (taskId == null) {
      return;
    }

    deleteMutation.mutate({
      productId,
      taskId,
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPopup>
        <AlertDialogTitle>Delete task</AlertDialogTitle>
        <AlertDialogDescription>
          {taskDescription != null && taskDescription.length > 0
            ? `Are you sure you want to delete "${taskDescription}"? This action cannot be undone.`
            : "Are you sure you want to delete this task? This action cannot be undone."}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogClose
            render={
              <Button variant="outline" disabled={deleteMutation.isPending}>
                Cancel
              </Button>
            }
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending || taskId == null}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
