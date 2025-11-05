import { os } from "@orpc/server";
import { z } from "zod";
import type { Context } from "./context";

// Rate limiting configuration
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const MINUTES_TO_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;

const RATE_LIMIT_CONFIG = {
  SECONDS_PER_MINUTE,
  MS_PER_SECOND,
  MINUTES_TO_MS, // Convert minutes to milliseconds
  WINDOW_MS: MINUTES_TO_MS, // 1 minute
  MAX_REQUESTS: 100, // 100 requests per minute
  MAX_REQUESTS_STRICT: 20, // 20 requests per minute for strict endpoints
  CLEANUP_PROBABILITY: 0.01, // 1% chance to clean up expired entries
  DEFAULT_RETRY_AFTER: 60, // Default retry after 60 seconds
  SECONDS_TO_MS: 1000, // Convert seconds to milliseconds
  USER_AGENT_SLICE_LENGTH: 20, // Length to slice user agent for fallback ID
  ORIGIN_SLICE_LENGTH: 20, // Length to slice origin for fallback ID
} as const;

// In-memory storage for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Extracts client identifier from context for rate limiting
 * Uses real IP address when available, falls back to user agent + origin
 * @param context - The request context containing client information
 * @returns A unique client identifier for rate limiting
 */
function getClientId(context: Context): string {
  // Primary: Use real IP address
  if (context.clientIP && context.clientIP !== "unknown") {
    return context.clientIP;
  }

  // Fallback: Combine user agent and origin for unique identification
  const userAgent = context.userAgent || "unknown";
  const origin = context.origin || "unknown";

  // Create a hash-like identifier from user agent and origin
  // This is not cryptographically secure, just for rate limiting purposes
  const fallbackId = `${userAgent.slice(0, RATE_LIMIT_CONFIG.USER_AGENT_SLICE_LENGTH)}-${origin.slice(0, RATE_LIMIT_CONFIG.ORIGIN_SLICE_LENGTH)}`;

  return fallbackId.replace(/[^a-zA-Z0-9-]/g, "");
}

/**
 * Checks if a client has exceeded the rate limit
 * @param clientId - The client identifier
 * @param maxRequests - Maximum requests allowed
 * @returns Object with rate limit status
 */
function checkRateLimit(clientId: string, maxRequests: number) {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);

  // Clean up expired entries periodically
  if (Math.random() < RATE_LIMIT_CONFIG.CLEANUP_PROBABILITY) {
    for (const [key, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!clientData || now > clientData.resetTime) {
    // First request or window expired
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    };
  }

  if (clientData.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: clientData.resetTime,
      retryAfter: Math.ceil(
        (clientData.resetTime - now) / RATE_LIMIT_CONFIG.SECONDS_TO_MS
      ),
    };
  }

  // Increment counter
  clientData.count++;
  return {
    allowed: true,
    remaining: maxRequests - clientData.count,
    resetTime: clientData.resetTime,
  };
}

// Define type-safe error types for rate limiting
export const baseWithErrors = os.errors({
  RATE_LIMITED: {
    data: z.object({
      retryAfter: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).default(RATE_LIMIT_CONFIG.MAX_REQUESTS),
      remaining: z.number().int().min(0).default(0),
      resetTime: z.number().int().min(0).default(0),
    }),
    message: "Rate limit exceeded. Please try again later.",
  },
});

/**
 * Rate limiting function that can be called from procedure handlers
 * @param context - The request context containing client information
 * @param maxRequests - Maximum requests allowed per window
 * @returns Rate limit result with status information
 */
export function checkRateLimitWithContext(
  context: Context,
  maxRequests: number = RATE_LIMIT_CONFIG.MAX_REQUESTS
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  limit: number;
} {
  const clientId = getClientId(context);
  const rateLimitResult = checkRateLimit(clientId, maxRequests);

  return {
    ...rateLimitResult,
    limit: maxRequests,
  };
}

/**
 * Creates rate limit headers for HTTP responses
 * @param rateLimitResult - The rate limit result
 * @returns Headers object with rate limit information
 */
export function createRateLimitHeaders(rateLimitResult: {
  remaining: number;
  resetTime: number;
  limit: number;
  retryAfter?: number;
}): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": rateLimitResult.limit.toString(),
    "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(
      rateLimitResult.resetTime / RATE_LIMIT_CONFIG.SECONDS_TO_MS
    ).toString(),
  };

  if (rateLimitResult.retryAfter) {
    headers["Retry-After"] = rateLimitResult.retryAfter.toString();
  }

  return headers;
}

/**
 * Standard rate limiting middleware (100 requests per minute)
 * Note: Actual rate limiting is handled in procedure handlers using checkRateLimitWithContext
 */
export const rateLimitMiddleware = baseWithErrors.middleware(
  async ({ next }) => await next()
);

/**
 * Strict rate limiting middleware (20 requests per minute)
 * Note: Actual rate limiting is handled in procedure handlers using checkRateLimitWithContext
 */
export const strictRateLimitMiddleware = baseWithErrors.middleware(
  async ({ next }) => await next()
);

/**
 * Custom rate limiting function with configurable window
 * @param context - The request context containing client information
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Rate limit result with status information
 */
export function checkCustomRateLimitWithContext(
  context: Context,
  maxRequests: number,
  windowMs: number = RATE_LIMIT_CONFIG.WINDOW_MS
): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  limit: number;
} {
  const clientId = getClientId(context);
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + windowMs });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
      limit: maxRequests,
    };
  }

  if (clientData.count >= maxRequests) {
    const retryAfter = Math.ceil(
      (clientData.resetTime - now) / RATE_LIMIT_CONFIG.SECONDS_TO_MS
    );
    return {
      allowed: false,
      remaining: 0,
      resetTime: clientData.resetTime,
      retryAfter,
      limit: maxRequests,
    };
  }

  clientData.count++;
  return {
    allowed: true,
    remaining: maxRequests - clientData.count,
    resetTime: clientData.resetTime,
    limit: maxRequests,
  };
}
