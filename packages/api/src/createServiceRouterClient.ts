import { createRouterClient } from "@orpc/server";
import type { Context } from "./context";
import { appRouter } from "./routers/index";

function createServiceContext(): Context {
  const now = new Date();

  return {
    session: {
      session: {
        id: "task-worker-session",
        userId: "task-worker",
        token: "task-worker",
        createdAt: now,
        updatedAt: now,
        expiresAt: new Date(now.getTime() + 86_400_000),
      },
      user: {
        id: "task-worker",
        name: "Task Worker",
        email: "task-worker@internal",
        emailVerified: true,
        image: null,
        createdAt: now,
        updatedAt: now,
      },
    },
  };
}

export function createServiceRouterClient() {
  return createRouterClient(appRouter, {
    context: async () => createServiceContext(),
  });
}
