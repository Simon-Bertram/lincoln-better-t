import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import {
  getErrorMessage,
  isRetryableError,
  logError,
} from '@/lib/error-handling';

const DEFAULT_RETRY_ATTEMPTS = 3;

/**
 * Enhanced useQuery hook with better error handling
 */
export function useQueryWithErrorHandling<TData, TError = Error>(
  options: UseQueryOptions<TData, TError>,
  errorContext?: string
): UseQueryResult<TData, TError> {
  const query = useQuery({
    ...options,
    retry: (failureCount, error) => {
      // Only retry if the error is retryable
      if (isRetryableError(error as Error)) {
        const maxRetries =
          typeof options.retry === 'number'
            ? options.retry
            : DEFAULT_RETRY_ATTEMPTS;
        return failureCount < maxRetries;
      }
      return false;
    },
  });

  // Log errors when they occur
  if (query.error) {
    logError(query.error as unknown as Error, {
      componentStack: errorContext || 'Unknown component',
      errorBoundary: 'useQueryWithErrorHandling',
    });
  }

  return query;
}

/**
 * Hook to get user-friendly error messages
 */
export function useErrorMessage(error: Error | null | undefined): string {
  if (!error) {
    return '';
  }
  return getErrorMessage(error);
}

/**
 * Hook to determine if an error is retryable
 */
export function useIsRetryableError(error: Error | null | undefined): boolean {
  if (!error) {
    return false;
  }
  return isRetryableError(error);
}
