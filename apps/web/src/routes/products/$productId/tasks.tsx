import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Lock } from "lucide-react";
import { GlobalHeaderControls } from "@/components/layout/GlobalHeaderControls";
import { PageLayout } from "@/components/layout/PageLayout";
import { TaskManagement } from "@/components/tasks/TaskManagement";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getUser } from "@/functions/getUser";
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
  beforeLoad: async () => {
    const session = await getUser();
    return { session };
  },
  loader: async ({ context, params }) => {
    if (context.session?.user == null) {
      return;
    }

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
  const { session } = Route.useRouteContext();

  return (
    <PageLayout
      title="Marketing Tasks"
      subtitle="Plan, schedule, and manage product marketing initiatives."
      headerControls={<GlobalHeaderControls />}
    >
      {session?.user == null ? <SignInRequired /> : <TaskManagement productId={productId} />}
    </PageLayout>
  );
}

function SignInRequired() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <Lock className="size-5 text-primary" />
          <CardTitle>Sign in required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Task management requires an authenticated session. Sign in to create, edit, and delete
              marketing tasks.
            </p>
            <Link to="/auth/login">
              <Button>
                Sign in
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
