import type { RouterClient } from '@orpc/server';
import { db } from '../db';
import { students } from '../db/migrations/schema';
import { publicProcedure } from '../lib/orpc';

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),
  getStudents: publicProcedure.handler(async () => {
    const allStudents = await db.select().from(students);
    return allStudents;
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
