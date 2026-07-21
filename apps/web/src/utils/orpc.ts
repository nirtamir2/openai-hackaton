import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { toast } from "sonner";
import { createContext } from "@app-template/api/context";
import type { AppRouter } from "@app-template/api/routers/index";
import { appRouter } from "@app-template/api/routers/index";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            query.invalidate();
          },
        },
      });
    },
  }),
});

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(appRouter, {
      context: async () => {
        return await createContext({ req: getRequest() });
      },
    }),
  )
  .client((): RouterClient<AppRouter> => {
    const link = new RPCLink({
      url: `${globalThis.location.origin}/api/rpc`,
      async fetch(url, options) {
        return await fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    });

    return createORPCClient(link);
  });

function createLazyOrpcClient(): RouterClient<AppRouter> {
  function createProxy<T extends Record<string | symbol, unknown>>(getValue: () => T): T {
    return new Proxy({} as T, {
      get(_target, prop: string | symbol): unknown {
        const resolved = getValue();
        const value = resolved[prop];

        if (typeof value === "function") {
          return value;
        }

        if (value != null && typeof value === "object") {
          return createProxy(() => value as Record<string | symbol, unknown>);
        }

        return createProxy(() => (getValue()[prop] ?? {}) as Record<string | symbol, unknown>);
      },
    });
  }

  return createProxy(() => getORPCClient() as Record<string | symbol, unknown>) as RouterClient<AppRouter>;
}

export const client = createLazyOrpcClient();

type OrpcUtils = ReturnType<typeof createTanstackQueryUtils<RouterClient<AppRouter>>>;

let orpcUtils: OrpcUtils | null = null;

function resolveOrpcUtils(): OrpcUtils {
  orpcUtils ??= createTanstackQueryUtils(client);
  return orpcUtils;
}

export const orpc = new Proxy({} as OrpcUtils, {
  get(_target, prop: keyof OrpcUtils) {
    return resolveOrpcUtils()[prop];
  },
});

if (import.meta.hot != null) {
  import.meta.hot.dispose(() => {
    orpcUtils = null;
    queryClient.clear();
  });
}
