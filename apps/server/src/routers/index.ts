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

export const appRouter = {
  healthCheck: publicProcedure.output(z.string()).handler(() => {
    return 'OK';
  }),
  getStudents: publicProcedure
    .input(getStudentsInputSchema.optional())
    .output(z.array(StudentSchema))
    .handler(async ({ input }) => {
      try {
        // Validate and use input
        const { offset = 0, search } = input || {};

        const query = db.select().from(students);
        const whereClause = search
          ? like(students.familyName, `%${search}%`)
          : undefined;

        const result = await query.where(whereClause).offset(offset);

        // Validate the result against our schema
        return z.array(StudentSchema).parse(result);
      } catch (error) {
        // In production, log to external service (Sentry, etc.)
        throw new Error(
          `Failed to fetch students: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }),
  getCivilWarOrphans: publicProcedure
    .input(getCivilWarOrphansInputSchema.optional())
    .output(z.array(CivilWarOrphanSchema))
    .handler(async ({ input }) => {
      try {
        // Validate and use input
        const { offset = 0, search } = input || {};

        const query = db.select().from(civilWarOrphans);
        const whereClause = search
          ? like(civilWarOrphans.familyName, `%${search}%`)
          : undefined;

        const result = await query.where(whereClause).offset(offset);

        // Validate the result against our schema
        return z.array(CivilWarOrphanSchema).parse(result);
      } catch (error) {
        // In production, log to external service (Sentry, etc.)
        throw new Error(
          `Failed to fetch civil war orphans: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
