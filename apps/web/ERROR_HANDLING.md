# Error Handling Implementation

This document outlines the comprehensive error handling implementation for the Lincoln Institute Directory application, following Next.js best practices.

## Overview

The application implements a multi-layered error handling strategy that provides:

- **Global error boundaries** for catching unhandled errors
- **Route-level error boundaries** for component-specific errors
- **Custom error boundaries** for specific sections
- **Enhanced React Query error handling**
- **User-friendly error messages**
- **Proper error logging and reporting**

## Error Boundary Hierarchy

### 1. Global Error Boundary (`global-error.tsx`)

- **Location**: `apps/web/src/app/global-error.tsx`
- **Purpose**: Catches errors that occur in the root layout
- **Features**:
  - Must include `<html>` and `<body>` tags
  - Provides a complete fallback UI
  - Logs errors for debugging
  - Includes error digest for tracking

### 2. Route Error Boundary (`error.tsx`)

- **Location**: `apps/web/src/app/error.tsx`
- **Purpose**: Catches errors within the app route
- **Features**:
  - Provides reset functionality
  - Shows error details in development
  - User-friendly error messages

### 3. Custom Error Boundary (`ErrorBoundary` component)

- **Location**: `apps/web/src/components/error-boundary.tsx`
- **Purpose**: Wraps specific components or sections
- **Features**:
  - Reusable across the application
  - Customizable fallback UI
  - Error logging with context

## Error Handling Components

### Loading Component (`loading.tsx`)

- **Location**: `apps/web/src/app/loading.tsx`
- **Purpose**: Provides loading states during data fetching
- **Features**:
  - Skeleton loading UI
  - Consistent with app design
  - Accessible loading indicators

### Not Found Page (`not-found.tsx`)

- **Location**: `apps/web/src/app/not-found.tsx`
- **Purpose**: Handles 404 errors
- **Features**:
  - Clear navigation options
  - Consistent with app design
  - Helpful error message

## Error Handling Utilities

### Error Handling Library (`error-handling.ts`)

- **Location**: `apps/web/src/lib/error-handling.ts`
- **Features**:
  - Centralized error logging
  - User-friendly error messages
  - Retry logic for different error types
  - Error digest generation

### Custom Hooks (`use-error-handling.ts`)

- **Location**: `apps/web/src/hooks/use-error-handling.ts`
- **Features**:
  - Enhanced React Query error handling
  - Automatic error logging
  - Smart retry logic
  - Error message utilities

## Implementation Details

### Error Types Handled

1. **Network Errors**

   - Connection failures
   - Timeout errors
   - Fetch API errors

2. **Server Errors**

   - 5xx status codes
   - API endpoint failures
   - Database connection issues

3. **Client Errors**

   - 4xx status codes
   - Authentication errors
   - Permission errors
   - Not found errors

4. **Component Errors**
   - React rendering errors
   - JavaScript runtime errors
   - Unhandled exceptions

### Error Recovery Strategies

1. **Automatic Retry**

   - Network errors (retryable)
   - Server errors (retryable)
   - Timeout errors (retryable)

2. **Manual Retry**

   - User-initiated retry buttons
   - Reset functionality in error boundaries
   - Query refetch capabilities

3. **Graceful Degradation**
   - Fallback UI components
   - Partial data display
   - Alternative navigation paths

## Usage Examples

### Using Error Boundaries

```tsx
import { ErrorBoundary } from "@/components/error-boundary";

function MyComponent() {
  return (
    <ErrorBoundary>
      <DataFetchingComponent />
    </ErrorBoundary>
  );
}
```

### Using Enhanced Query Hook

```tsx
import { useQueryWithErrorHandling } from "@/hooks/use-error-handling";

function DataComponent() {
  const query = useQueryWithErrorHandling(
    orpc.getData.queryOptions(),
    "DataComponent"
  );

  // Query automatically handles errors and retries
}
```

### Custom Error Messages

```tsx
import { useErrorMessage } from "@/hooks/use-error-handling";

function ErrorDisplay({ error }) {
  const message = useErrorMessage(error);
  return <div>{message}</div>;
}
```

## Best Practices

### 1. Error Boundary Placement

- Place error boundaries at logical component boundaries
- Don't wrap too many components in a single boundary
- Use specific boundaries for critical sections

### 2. Error Logging

- Log errors with sufficient context
- Include component stack traces
- Use error digests for tracking

### 3. User Experience

- Provide clear, actionable error messages
- Include retry mechanisms where appropriate
- Maintain consistent UI during error states

### 4. Performance

- Avoid error boundaries in frequently re-rendered components
- Use lazy loading for error boundary components
- Implement proper cleanup in error handlers

## Configuration

### Environment Variables

- `NODE_ENV`: Controls error logging behavior
- `NEXT_PUBLIC_SERVER_URL`: API endpoint configuration

### Error Reporting Integration

The error handling system is designed to integrate with external error reporting services:

```typescript
// Example: Sentry integration
import * as Sentry from "@sentry/nextjs";

export function logError(error: Error, errorInfo?: ErrorInfo): void {
  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(error, { extra: errorInfo });
  }
}
```

## Testing Error Handling

### Manual Testing

1. Disconnect network to test network errors
2. Navigate to non-existent routes to test 404 handling
3. Trigger JavaScript errors to test error boundaries
4. Test retry mechanisms and error recovery

### Automated Testing

- Unit tests for error utilities
- Integration tests for error boundaries
- E2E tests for error scenarios

## Monitoring and Maintenance

### Error Tracking

- Monitor error frequencies and patterns
- Track error recovery success rates
- Analyze user impact of errors

### Continuous Improvement

- Update error messages based on user feedback
- Refine retry strategies based on error patterns
- Optimize error boundary placement

## References

- [Next.js Error Handling Documentation](https://nextjs.org/docs/app/getting-started/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React Query Error Handling](https://tanstack.com/query/latest/docs/react/guides/error-handling)
