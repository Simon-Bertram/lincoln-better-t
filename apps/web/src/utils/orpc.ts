import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AppRouterClient } from '../../../server/src/routers/index';

// Cache configuration constants
const CACHE_CONFIG = {
  STALE_TIME_MS: 5 * 60 * 1000, // 5 minutes
  GC_TIME_MS: 10 * 60 * 1000, // 10 minutes
  RETRY_ATTEMPTS: 3,
} as const;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: 'retry',
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
      refetchOnWindowFocus: true,
    },
  },
});

export const link = new RPCLink({
  url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
