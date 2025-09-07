'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

// Constants for rate limit handling
const RATE_LIMIT_CONSTANTS = {
  DEFAULT_RETRY_AFTER: 60,
  DEFAULT_LIMIT: 100,
  TOAST_DURATION: 5000,
  RETRY_TOAST_DURATION: 3000,
  DEFAULT_MAX_RETRIES: 3,
  SECONDS_TO_MS: 1000,
} as const;

/**
 * Hook for handling rate limit errors from the API
 * @returns Object with error handling functions
 */
export function useRateLimitHandling() {
  /**
   * Handles rate limit errors with user-friendly messages
   * @param error - The error object from the API
   */
  const handleRateLimitError = useCallback(
    (error: {
      code?: string;
      data?: { retryAfter?: number; limit?: number };
    }) => {
      if (error?.code === 'RATE_LIMITED') {
        const retryAfter =
          error.data?.retryAfter || RATE_LIMIT_CONSTANTS.DEFAULT_RETRY_AFTER;
        const limit = error.data?.limit || RATE_LIMIT_CONSTANTS.DEFAULT_LIMIT;

        toast.error(
          `Rate limit exceeded. You can make ${limit} requests per minute. Please try again in ${retryAfter} seconds.`,
          {
            duration: RATE_LIMIT_CONSTANTS.TOAST_DURATION,
            description: 'This helps protect our servers from abuse.',
          }
        );

        return true; // Indicates that the error was handled
      }

      return false; // Error was not a rate limit error
    },
    []
  );

  /**
   * Handles any API error, including rate limit errors
   * @param error - The error object from the API
   * @param fallbackMessage - Message to show for non-rate-limit errors
   */
  const handleApiError = useCallback(
    (
      error: {
        code?: string;
        data?: { retryAfter?: number; limit?: number };
        message?: string;
      },
      fallbackMessage = 'An error occurred'
    ) => {
      // Try to handle as rate limit error first
      if (handleRateLimitError(error)) {
        return;
      }

      // Handle other types of errors
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error(fallbackMessage);
      }
    },
    [handleRateLimitError]
  );

  /**
   * Creates a retry function that respects rate limit delays
   * @param originalFunction - The function to retry
   * @param maxRetries - Maximum number of retries
   * @returns Function that retries with rate limit awareness
   */
  const createRetryFunction = useCallback(
    <T extends (...args: unknown[]) => Promise<unknown>>(
      originalFunction: T,
      maxRetries: number = RATE_LIMIT_CONSTANTS.DEFAULT_MAX_RETRIES
    ) => {
      return async (
        ...args: Parameters<T>
      ): Promise<Awaited<ReturnType<T>>> => {
        let lastError: unknown;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return (await originalFunction(...args)) as Awaited<ReturnType<T>>;
          } catch (error: unknown) {
            lastError = error;

            // If it's a rate limit error and we have retries left
            if (
              error &&
              typeof error === 'object' &&
              'code' in error &&
              error.code === 'RATE_LIMITED' &&
              attempt < maxRetries
            ) {
              const retryAfter =
                (error as { data?: { retryAfter?: number } }).data
                  ?.retryAfter || RATE_LIMIT_CONSTANTS.DEFAULT_RETRY_AFTER;

              toast.info(
                `Rate limited. Retrying in ${retryAfter} seconds... (Attempt ${attempt + 1}/${maxRetries + 1})`,
                { duration: RATE_LIMIT_CONSTANTS.RETRY_TOAST_DURATION }
              );

              // Wait for the retry delay
              await new Promise((resolve) =>
                setTimeout(
                  resolve,
                  retryAfter * RATE_LIMIT_CONSTANTS.SECONDS_TO_MS
                )
              );
              continue;
            }

            // For non-rate-limit errors or final attempt, throw the error
            throw error;
          }
        }

        throw lastError;
      };
    },
    []
  );

  return {
    handleRateLimitError,
    handleApiError,
    createRetryFunction,
  };
}

/**
 * Utility function to check if an error is a rate limit error
 * @param error - The error object to check
 * @returns True if the error is a rate limit error
 */
export function isRateLimitError(error: { code?: string }): boolean {
  return error?.code === 'RATE_LIMITED';
}

/**
 * Utility function to get retry delay from a rate limit error
 * @param error - The rate limit error
 * @returns Retry delay in seconds, or default as fallback
 */
export function getRetryDelay(error: {
  data?: { retryAfter?: number };
}): number {
  return error?.data?.retryAfter || RATE_LIMIT_CONSTANTS.DEFAULT_RETRY_AFTER;
}
