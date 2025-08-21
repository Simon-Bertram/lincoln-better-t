import type { RouterClient } from '@orpc/server';
import { like } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { students } from '../db/migrations/schema';
import { publicProcedure } from '../lib/orpc';

const PAGINATION_LIMITS = {
  MAX_LIMIT: 100,
  MAX_SEARCH_LENGTH: 200,
} as const;

const getStudentsSchema = z.object({
  limit: z.number().min(1).max(PAGINATION_LIMITS.MAX_LIMIT).optional(),
  offset: z.number().min(0).optional(),
  search: z.string().max(PAGINATION_LIMITS.MAX_SEARCH_LENGTH).optional(),
});

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),
  getStudents: publicProcedure
    .input(getStudentsSchema.optional())
    .handler(async ({ input }) => {
      try {
        // Validate and use input
        const { offset = 0, search } = input || {};

        const query = db.select().from(students);
        const whereClause = search
          ? like(students.familyName, `%${search}%`)
          : undefined;

        return await query.where(whereClause).offset(offset);
      } catch (error) {
        // In production, log to external service (Sentry, etc.)
        throw new Error(
          `Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
