import type { RouterClient } from '@orpc/server';
import { like } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { civilWarOrphans, students } from '../db/migrations/schema';
import { publicProcedure } from '../lib/orpc';
import {
  CivilWarOrphanSchema,
  getCivilWarOrphansInputSchema,
} from '../types/civil-war-orphans';
import { getStudentsInputSchema, StudentSchema } from '../types/student';

/**
 * Builds a database query for students with optional search and offset
 * @param input - Optional input containing search and offset parameters
 * @returns Database query builder
 */
function buildStudentQuery(input?: { search?: string; offset?: number }) {
  const offset = input?.offset ?? 0;
  const search = input?.search;

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
  const offset = input?.offset ?? 0;
  const search = input?.search;

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

export const appRouter = {
  healthCheck: publicProcedure.output(z.string()).handler(() => {
    return 'OK';
  }),
  getStudents: publicProcedure
    .input(getStudentsInputSchema.optional())
    .output(z.array(StudentSchema))
    .handler(async ({ input }) => {
      try {
        const query = buildStudentQuery(input);
        const result = await query;
        return validateStudentResults(result);
      } catch (error) {
        handleStudentQueryError(error);
      }
    }),
  getCivilWarOrphans: publicProcedure
    .input(getCivilWarOrphansInputSchema.optional())
    .output(z.array(CivilWarOrphanSchema))
    .handler(async ({ input }) => {
      try {
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
