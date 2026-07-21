import { createFileRoute } from "@tanstack/react-router";
import { GlobalHeaderControls } from "@/components/layout/GlobalHeaderControls";
import { PageLayout } from "@/components/layout/PageLayout";
import { TaskManagement } from "@/components/tasks/TaskManagement";
import { buildSeo, withAppName } from "@/utils/buildSeo";
import { getTaskListDateRange } from "@/utils/taskDateTime";

export const Route = createFileRoute("/products/$productId/tasks")({
  head: () =>
    buildSeo({
      title: withAppName({ title: "Marketing Tasks" }),
      description: "Manage product marketing tasks, schedules, and priorities.",
      pathname: "/products/$productId/tasks",
      noIndex: true,
    }),
  loader: async ({ context, params }) => {
    const dateRange = getTaskListDateRange();

    await context.queryClient.ensureQueryData(
      context.orpc.calendar.getTasks.queryOptions({
        input: {
          productId: params.productId,
          from: dateRange.from,
          to: dateRange.to,
        },
      }),
    );
  },
  component: ProductTasksPage,
});

function ProductTasksPage() {
  const { productId } = Route.useParams();

  return (
    <PageLayout
      title="Marketing Tasks"
      subtitle="Plan, schedule, and manage product marketing initiatives."
      headerControls={<GlobalHeaderControls />}
    >
      <TaskManagement productId={productId} />
    </PageLayout>
  );
}
