import { useQueryWithErrorHandling } from "./use-error-handling";
import { useRateLimitHandling } from "./use-rate-limit-handling";

export type UseDataFetchingOptions<TData> = {
  queryKey: string[];
  queryFn: () => Promise<TData[]>;
  enabled?: boolean;
  retry?: number;
  staleTime?: number;
  gcTime?: number;
};

const SECONDS_TO_MS = 1000;
const MINUTES_TO_MS = 60 * SECONDS_TO_MS;
const FIVE_MINUTES = 5;
const TEN_MINUTES = 10;
const DEFAULT_STALE_TIME = FIVE_MINUTES * MINUTES_TO_MS;
const DEFAULT_GC_TIME = TEN_MINUTES * MINUTES_TO_MS;
const DEFAULT_RETRY = 3;

export function useDataFetching<TData>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = DEFAULT_STALE_TIME,
  gcTime = DEFAULT_GC_TIME,
  retry = DEFAULT_RETRY,
}: UseDataFetchingOptions<TData>) {
  const { createRetryFunction } = useRateLimitHandling();

  const retryQueryFn = createRetryFunction(queryFn);

  return useQueryWithErrorHandling({
    queryKey,
    queryFn: retryQueryFn,
    enabled,
    staleTime,
    gcTime,
    retry,
  });
}
