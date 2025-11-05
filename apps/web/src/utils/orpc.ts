import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AppRouterClient } from "../../../server/src/routers/index";

// Cache configuration constants
// Since data is historical and never changes, we use infinite cache times
const CACHE_CONFIG = {
  STALE_TIME_MS: Infinity, // Data never becomes stale (historical data)
  GC_TIME_MS: Infinity, // Never garbage collect (data is always valid)
  RETRY_ATTEMPTS: 3,
} as const;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: CACHE_CONFIG.STALE_TIME_MS,
      gcTime: CACHE_CONFIG.GC_TIME_MS,
      retry: CACHE_CONFIG.RETRY_ATTEMPTS,
      // Don't refetch on window focus for static historical data
      refetchOnWindowFocus: false,
      // Don't refetch on mount if data exists (use cached data)
      refetchOnMount: false,
    },
  },
});

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
