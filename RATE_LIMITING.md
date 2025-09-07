# Rate Limiting System Documentation

## Overview

This application implements a comprehensive rate limiting system to protect against abuse and ensure fair usage of API resources. The system uses a sliding window approach with in-memory storage and provides both server-side enforcement and client-side error handling.

## Architecture

### Components

1. **Server-Side Rate Limiting** (`apps/server/src/lib/rate-limit.ts`)

   - IP extraction and client identification
   - Rate limit checking and enforcement
   - Error handling and response formatting

2. **Client-Side Error Handling** (`apps/web/src/hooks/use-rate-limit-handling.ts`)

   - User-friendly error messages
   - Automatic retry logic with backoff
   - Toast notifications for rate limit events

3. **Context Creation** (`apps/server/src/lib/context.ts`)
   - Real IP extraction from various proxy headers
   - Fallback identification using user agent + origin

## Configuration

### Rate Limits

```typescript
const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 60_000, // 1 minute window
  MAX_REQUESTS: 100, // Standard limit: 100 requests/minute
  MAX_REQUESTS_STRICT: 20, // Strict limit: 20 requests/minute
  CLEANUP_PROBABILITY: 0.01, // 1% chance to clean expired entries
  DEFAULT_RETRY_AFTER: 60, // Default retry delay in seconds
};
```

### Client Identification Strategy

The system uses a multi-tier approach for client identification:

1. **Primary**: Real IP address from proxy headers

   - `x-forwarded-for` (most common)
   - `x-real-ip` (Nginx)
   - `cf-connecting-ip` (Cloudflare)
   - `x-client-ip` (Apache)
   - And others...

2. **Fallback**: User agent + origin combination
   - Creates a hash-like identifier when IP is unavailable
   - Sanitized to remove special characters

## Usage

### Server-Side Implementation

#### Basic Rate Limiting

```typescript
import {
  checkRateLimitWithContext,
  rateLimitMiddleware,
} from "../lib/rate-limit";

export const appRouter = {
  myEndpoint: publicProcedure
    .use(rateLimitMiddleware)
    .handler(async ({ context }) => {
      // Check rate limit
      const rateLimitResult = checkRateLimitWithContext(context);

      if (!rateLimitResult.allowed) {
        throwRateLimitError(rateLimitResult);
      }

      // Your endpoint logic here
      return { data: "success" };
    }),
};
```

#### Custom Rate Limits

```typescript
// Use custom limits for specific endpoints
const rateLimitResult = checkRateLimitWithContext(context, 50); // 50 requests/minute

// Or use custom window and limits
const customResult = checkCustomRateLimitWithContext(
  context,
  10, // 10 requests
  30_000 // per 30 seconds
);
```

#### Rate Limit Headers

```typescript
import { createRateLimitHeaders } from "../lib/rate-limit";

// Add rate limit headers to responses
const headers = createRateLimitHeaders(rateLimitResult);
// Returns: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After
```

### Client-Side Implementation

#### Basic Error Handling

```typescript
import { useRateLimitHandling } from "@/hooks/use-rate-limit-handling";

function MyComponent() {
  const { handleApiError } = useRateLimitHandling();

  const fetchData = async () => {
    try {
      const data = await api.getData();
      return data;
    } catch (error) {
      handleApiError(error, "Failed to fetch data");
    }
  };
}
```

#### Automatic Retry with Rate Limit Awareness

```typescript
import { useRateLimitHandling } from "@/hooks/use-rate-limit-handling";

function MyComponent() {
  const { createRetryFunction } = useRateLimitHandling();

  const fetchDataWithRetry = createRetryFunction(
    () => api.getData(),
    3 // max retries
  );

  // This will automatically retry on rate limit errors
  // with appropriate delays
}
```

#### Custom Rate Limit Error Handling

```typescript
import {
  useRateLimitHandling,
  isRateLimitError,
  getRetryDelay,
} from "@/hooks/use-rate-limit-handling";

function MyComponent() {
  const { handleRateLimitError } = useRateLimitHandling();

  const handleError = (error) => {
    if (isRateLimitError(error)) {
      const retryAfter = getRetryDelay(error);
      console.log(`Rate limited. Retry after ${retryAfter} seconds`);
      handleRateLimitError(error);
    } else {
      // Handle other errors
    }
  };
}
```

## Error Handling

### Server-Side Errors

Rate limit errors are thrown with the following structure:

```typescript
{
  code: 'RATE_LIMITED',
  data: {
    retryAfter: 60,        // Seconds until retry
    limit: 100,            // Request limit per window
    remaining: 0,          // Remaining requests
    resetTime: 1640995200  // Unix timestamp when limit resets
  }
}
```

### Client-Side Error Handling

The client automatically:

- Shows user-friendly toast notifications
- Implements exponential backoff for retries
- Provides clear feedback about rate limits
- Handles both rate limit and general API errors

## Testing

### Server-Side Tests

```bash
# Run rate limiting tests
npm test apps/server/src/__tests__/rate-limit.test.ts

# Run IP extraction tests
npm test apps/server/src/__tests__/ip-extraction.test.ts
```

### Test Coverage

- ✅ IP extraction from various headers
- ✅ Rate limit enforcement
- ✅ Window expiration and reset
- ✅ Different client identification
- ✅ Error handling and formatting

## Production Considerations

### Scaling

**Current Implementation**: In-memory storage

- ✅ Suitable for single-instance deployments
- ❌ Not suitable for multi-instance deployments

**Recommended for Production**: Redis-based storage

```typescript
// Example Redis implementation
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

async function checkRateLimitRedis(clientId: string, maxRequests: number) {
  const key = `rate_limit:${clientId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 60); // 60 seconds
  }

  return {
    allowed: current <= maxRequests,
    remaining: Math.max(0, maxRequests - current),
    resetTime: Date.now() + 60000,
  };
}
```

### Monitoring

Add monitoring for:

- Rate limit hit frequency
- Client identification patterns
- Error rates and types
- Performance impact

```typescript
// Example monitoring
import { metrics } from "./monitoring";

function checkRateLimitWithMonitoring(context: Context, maxRequests: number) {
  const result = checkRateLimitWithContext(context, maxRequests);

  if (!result.allowed) {
    metrics.increment("rate_limit.exceeded", {
      client_ip: context.clientIP,
      endpoint: "my_endpoint",
    });
  }

  return result;
}
```

### Security Considerations

1. **IP Spoofing**: The system validates IP addresses and uses fallback identification
2. **Distributed Attacks**: Consider implementing distributed rate limiting
3. **User Agent Spoofing**: Fallback identification can be bypassed but provides basic protection
4. **Header Validation**: All headers are validated before use

## Configuration Options

### Environment Variables

```bash
# Optional: Custom CORS origins
CORS_ORIGIN=https://myapp.com,https://staging.myapp.com

# Optional: Custom rate limits (if implementing dynamic limits)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_STRICT_MAX_REQUESTS=20
```

### Customization

You can customize the rate limiting behavior by:

1. **Adjusting Limits**: Modify `RATE_LIMIT_CONFIG` constants
2. **Custom Windows**: Use `checkCustomRateLimitWithContext` with custom windows
3. **Different Limits per Endpoint**: Apply different limits to different procedures
4. **User-Based Limits**: Implement user-specific limits based on authentication

## Troubleshooting

### Common Issues

1. **Rate Limits Too Strict**

   - Adjust `MAX_REQUESTS` in configuration
   - Consider different limits for different endpoints

2. **IP Not Detected**

   - Check proxy configuration
   - Verify header forwarding
   - System falls back to user agent + origin

3. **Client-Side Errors Not Handled**

   - Ensure `useRateLimitHandling` hook is used
   - Check error format matches expected structure

4. **Memory Usage**
   - Monitor `rateLimitStore` size
   - Consider Redis for production
   - Adjust `CLEANUP_PROBABILITY` if needed

### Debug Mode

Enable debug logging:

```typescript
// Add to rate-limit.ts
const DEBUG = process.env.NODE_ENV === "development";

function checkRateLimit(clientId: string, maxRequests: number) {
  if (DEBUG) {
    console.log(`Rate limit check: ${clientId}, limit: ${maxRequests}`);
  }
  // ... rest of implementation
}
```

## API Reference

### Server Functions

- `checkRateLimitWithContext(context, maxRequests?)` - Check rate limit for a request
- `checkCustomRateLimitWithContext(context, maxRequests, windowMs?)` - Custom rate limiting
- `createRateLimitHeaders(rateLimitResult)` - Generate rate limit headers
- `getClientId(context)` - Extract client identifier

### Client Hooks

- `useRateLimitHandling()` - Main hook for rate limit error handling
- `isRateLimitError(error)` - Check if error is rate limit related
- `getRetryDelay(error)` - Get retry delay from rate limit error

### Middleware

- `rateLimitMiddleware` - Standard rate limiting middleware (100 req/min)
- `strictRateLimitMiddleware` - Strict rate limiting middleware (20 req/min)

## Contributing

When modifying the rate limiting system:

1. Update tests for any changes
2. Consider backward compatibility
3. Document new configuration options
4. Test with various proxy configurations
5. Verify client-side error handling still works

## License

This rate limiting system is part of the Lincoln Better T application and follows the same licensing terms.
