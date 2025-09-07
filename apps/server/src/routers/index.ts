import type { RouterClient } from '@orpc/server';
import { like } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { civilWarOrphans, students } from '../db/migrations/schema';
import { publicProcedure } from '../lib/orpc';
import {
  checkRateLimitWithContext,
  rateLimitMiddleware,
} from '../lib/rate-limit';
import {
  CivilWarOrphanSchema,
  getCivilWarOrphansInputSchema,
} from '../types/civil-war-orphans';
import { getStudentsInputSchema, StudentSchema } from '../types/student';

// Security constants
const SECURITY_LIMITS = {
  MAX_OFFSET: 10_000,
  MAX_SEARCH_LENGTH: 200,
} as const;

/**
 * Sanitizes search input to prevent SQL injection and other attacks
 * @param search - The raw search input
 * @returns Sanitized search string safe for database queries
 */
function sanitizeSearchInput(search: string): string {
  if (!search || typeof search !== 'string') {
    return '';
  }

  return (
    search
      // Remove potentially dangerous SQL characters
      .replace(/[%_\\]/g, '') // Remove SQL wildcards and escape characters
      .replace(/[<>'"&]/g, '') // Remove HTML/XML special characters
      .replace(/[;()]/g, '') // Remove SQL statement terminators
      .trim() // Remove leading/trailing whitespace
      .slice(0, SECURITY_LIMITS.MAX_SEARCH_LENGTH)
  ); // Enforce length limit
}

/**
 * Validates and sanitizes offset parameter
 * @param offset - The raw offset value
 * @returns Sanitized offset value within safe limits
 */
function sanitizeOffset(offset: number | undefined): number {
  if (typeof offset !== 'number' || offset < 0 || !Number.isInteger(offset)) {
    return 0;
  }
  return Math.min(offset, SECURITY_LIMITS.MAX_OFFSET);
}

/**
 * Builds a database query for students with optional search and offset
 * @param input - Optional input containing search and offset parameters
 * @returns Database query builder
 */
function buildStudentQuery(input?: { search?: string; offset?: number }) {
  const offset = sanitizeOffset(input?.offset);
  const search = input?.search ? sanitizeSearchInput(input.search) : undefined;

  const query = db.select().from(students);
  const whereClause = search
    ? like(students.familyName, `%${search}%`)
    : undefined;

  return query.where(whereClause).offset(offset);
}

/**
 * Builds a database query for civil war orphans with optional search and offset
 * @param input - Optional input containing search and offset parameters
 * @returns Database query builder
 */
function buildCivilWarOrphansQuery(input?: {
  search?: string;
  offset?: number;
}) {
  const offset = sanitizeOffset(input?.offset);
  const search = input?.search ? sanitizeSearchInput(input.search) : undefined;

  const query = db.select().from(civilWarOrphans);
  const whereClause = search
    ? like(civilWarOrphans.familyName, `%${search}%`)
    : undefined;

  return query.where(whereClause).offset(offset);
}

/**
 * Validates student results against the schema
 * @param results - Raw database results
 * @returns Validated student array
 */
function validateStudentResults(results: unknown[]) {
  return z.array(StudentSchema).parse(results);
}

/**
 * Validates civil war orphan results against the schema
 * @param results - Raw database results
 * @returns Validated civil war orphan array
 */
function validateCivilWarOrphanResults(results: unknown[]) {
  return z.array(CivilWarOrphanSchema).parse(results);
}

/**
 * Handles errors for student queries
 * @param error - The error that occurred
 * @throws Error with descriptive message
 */
function handleStudentQueryError(error: unknown): never {
  // In production, log to external service (Sentry, etc.)
  throw new Error(
    `Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`
  );
}

/**
 * Handles errors for civil war orphan queries
 * @param error - The error that occurred
 * @throws Error with descriptive message
 */
function handleCivilWarOrphanQueryError(error: unknown): never {
  // In production, log to external service (Sentry, etc.)
  throw new Error(
    `Failed to fetch civil war orphans: ${error instanceof Error ? error.message : 'Unknown error'}`
  );
}

/**
 * Throws a rate limit error with proper formatting
 * @param rateLimitResult - The rate limit result
 * @throws ORPCError with rate limit information
 */
function throwRateLimitError(rateLimitResult: {
  retryAfter?: number;
  limit: number;
  remaining: number;
  resetTime: number;
}): never {
  throw new Error(
    `RATE_LIMITED:${JSON.stringify({
      retryAfter: rateLimitResult.retryAfter || 60,
      limit: rateLimitResult.limit,
      remaining: rateLimitResult.remaining,
      resetTime: rateLimitResult.resetTime,
    })}`
  );
}

export const appRouter = {
  healthCheck: publicProcedure
    .use(rateLimitMiddleware)
    .output(z.string())
    .handler(({ context }) => {
      // Check rate limit with real client IP
      const rateLimitResult = checkRateLimitWithContext(context);

      if (!rateLimitResult.allowed) {
        throwRateLimitError(rateLimitResult);
      }

      return 'OK';
    }),
  getStudents: publicProcedure
    .use(rateLimitMiddleware)
    .input(getStudentsInputSchema.optional())
    .output(z.array(StudentSchema))
    .handler(async ({ input, context }) => {
      try {
        // Check rate limit with real client IP
        const rateLimitResult = checkRateLimitWithContext(context);

        if (!rateLimitResult.allowed) {
          throwRateLimitError(rateLimitResult);
        }

        const query = buildStudentQuery(input);
        const result = await query;
        return validateStudentResults(result);
      } catch (error) {
        handleStudentQueryError(error);
      }
    }),
  getCivilWarOrphans: publicProcedure
    .use(rateLimitMiddleware)
    .input(getCivilWarOrphansInputSchema.optional())
    .output(z.array(CivilWarOrphanSchema))
    .handler(async ({ input, context }) => {
      try {
        // Check rate limit with real client IP
        const rateLimitResult = checkRateLimitWithContext(context);

        if (!rateLimitResult.allowed) {
          throwRateLimitError(rateLimitResult);
        }

        const query = buildCivilWarOrphansQuery(input);
        const result = await query;
        return validateCivilWarOrphanResults(result);
      } catch (error) {
        handleCivilWarOrphanQueryError(error);
      }
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
