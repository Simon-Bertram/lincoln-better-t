/**
 * Error handling utilities for the application
 */

export type ErrorWithDigest = Error & { digest?: string };

export type ErrorInfo = {
  componentStack: string;
  errorBoundary?: string;
};

/**
 * Logs an error to the appropriate service based on environment
 */
export function logError(error: Error, errorInfo?: ErrorInfo): void {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.group('Error Logged');
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    if (errorInfo) {
      // eslint-disable-next-line no-console
      console.error('Error Info:', errorInfo);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
    return;
  }

  // In production, send to error reporting service
  // Example: Sentry, LogRocket, etc.
  // This is where you would integrate with your error reporting service
  try {
    // Example: Sentry.captureException(error, { extra: errorInfo })
    // eslint-disable-next-line no-console
    console.error('Production error:', error.message, errorInfo);
  } catch (loggingError) {
    // Fallback to console if error reporting fails
    // eslint-disable-next-line no-console
    console.error('Failed to log error:', loggingError);
    // eslint-disable-next-line no-console
    console.error('Original error:', error);
  }
}

/**
 * Creates a user-friendly error message
 */
export function getErrorMessage(error: Error): string {
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return 'The request timed out. Please try again.';
  }

  // Handle authentication errors
  if (error.message.includes('401') || error.message.includes('unauthorized')) {
    return 'You are not authorized to perform this action. Please log in and try again.';
  }

  // Handle permission errors
  if (error.message.includes('403') || error.message.includes('forbidden')) {
    return 'You do not have permission to access this resource.';
  }

  // Handle not found errors
  if (error.message.includes('404') || error.message.includes('not found')) {
    return 'The requested resource was not found.';
  }

  // Handle server errors
  if (error.message.includes('500') || error.message.includes('server error')) {
    return 'A server error occurred. Please try again later.';
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: Error): boolean {
  // Network errors are usually retryable
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Server errors (5xx) are usually retryable
  if (
    error.message.includes('500') ||
    error.message.includes('502') ||
    error.message.includes('503')
  ) {
    return true;
  }

  // Timeout errors are retryable
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return true;
  }

  // Client errors (4xx) are usually not retryable
  if (
    error.message.includes('400') ||
    error.message.includes('401') ||
    error.message.includes('403') ||
    error.message.includes('404')
  ) {
    return false;
  }

  // Default to not retryable for safety
  return false;
}

/**
 * Creates a standardized error object
 */
export function createError(
  message: string,
  code?: string,
  cause?: Error
): ErrorWithDigest {
  const error = new Error(message) as ErrorWithDigest;
  error.digest = code || generateErrorDigest();
  if (cause) {
    error.cause = cause;
  }
  return error;
}

/**
 * Generates a unique error digest for tracking
 */
function generateErrorDigest(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
