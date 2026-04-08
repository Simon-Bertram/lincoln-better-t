import type { RouterClient } from "@orpc/server";
import { z } from "zod";
import { publicProcedure } from "../lib/orpc";
import { getCivilWarOrphans } from "../services/civil-war-orphans-service";
import {
  getAgencies,
  getEnrollments,
  getNations,
  getStudents,
} from "../services/students-service";
import {
  CivilWarOrphanSchema,
  getCivilWarOrphansInputSchema,
} from "../types/civil-war-orphans";
import {
  getStudentsInputSchema,
  StudentTableRowSchema,
} from "../types/student";

export const appRouter = {
  healthCheck: publicProcedure.output(z.string()).handler(() => {
    return "OK";
  }),
  getStudents: publicProcedure
    .input(getStudentsInputSchema.optional())
    .output(z.array(StudentTableRowSchema))
    .handler(({ input }) => getStudents(input)),
  getNations: publicProcedure.output(z.array(z.object({
    nationId: z.number(),
    nation: z.string().nullable(),
    band: z.string().nullable(),
  }))).handler(() => getNations()),
  getAgencies: publicProcedure.output(z.array(z.object({
    agencyId: z.number(),
    agency: z.string().nullable(),
  }))).handler(() => getAgencies()),
  getEnrollments: publicProcedure.output(z.array(z.object({
    studentId: z.number().nullable(),
    arrivalDateFull: z.string().nullable(),
    departureDateFull: z.string().nullable(),
    arrivalYearNumeric: z.number().nullable(),
    departureYearNumeric: z.number().nullable(),
    lengthOfStayDays: z.number().nullable(),
    diedAtLincoln: z.boolean().nullable(),
    trade: z.string().nullable(),
  }))).handler(() => getEnrollments()),
  getCivilWarOrphans: publicProcedure
    .input(getCivilWarOrphansInputSchema.optional())
    .output(z.array(CivilWarOrphanSchema))
    .handler(({ input }) => getCivilWarOrphans(input)),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
