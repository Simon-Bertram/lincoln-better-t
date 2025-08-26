import type { RouterClient } from '@orpc/server';
import { like } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { students } from '../db/migrations/schema';
import { publicProcedure } from '../lib/orpc';
import { getStudentsInputSchema, StudentSchema } from '../types/student';

export const appRouter = {
  healthCheck: publicProcedure.output(z.string()).handler(() => {
    return 'OK';
  }),
<<<<<<< HEAD
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
=======
  getStudents: publicProcedure.handler(async () => {
    const allStudents = await db.select().from(students).limit(838);
    return allStudents;
  }),
>>>>>>> 84aae68 (Add Vercel analytics)
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
