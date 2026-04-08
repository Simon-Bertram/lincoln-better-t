import type { RouterClient } from "@orpc/server";
import { and, eq, inArray, like, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import {
  agencies,
  civilWarOrphans,
  enrollments,
  nations,
  students,
} from "../db/schema";
import { publicProcedure } from "../lib/orpc";
import {
  CivilWarOrphanSchema,
  getCivilWarOrphansInputSchema,
} from "../types/civil-war-orphans";
import {
  getStudentsInputSchema,
  StudentEntitySchema,
  StudentTableRowSchema,
} from "../types/student";

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
  if (!search || typeof search !== "string") {
    return "";
  }

  return (
    search
      // Remove potentially dangerous SQL characters
      .replace(/[%_\\]/g, "") // Remove SQL wildcards and escape characters
      .replace(/[<>'"&]/g, "") // Remove HTML/XML special characters
      .replace(/[;()]/g, "") // Remove SQL statement terminators
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
  if (typeof offset !== "number" || offset < 0 || !Number.isInteger(offset)) {
    return 0;
  }
  return Math.min(offset, SECURITY_LIMITS.MAX_OFFSET);
}

/**
 * Builds a database query for students with optional search and offset
 * @param input - Optional input containing search and offset parameters
 * @returns Database query builder
 */
function buildStudentQuery(input?: {
  search?: string;
  offset?: number;
  limit?: number;
}) {
  const offset = sanitizeOffset(input?.offset);
  const search = input?.search ? sanitizeSearchInput(input.search) : undefined;
  const limit =
    typeof input?.limit === "number" && input.limit > 0
      ? Math.min(input.limit, 100)
      : undefined;

  const whereClause = search
    ? or(
        like(students.familyName, `%${search}%`),
        like(students.givenName, `%${search}%`),
        like(students.indianName, `%${search}%`)
      )
    : undefined;

  const baseQuery = db.select().from(students).offset(offset);

  if (whereClause) {
    if (typeof limit === "number") {
      return baseQuery.where(whereClause).limit(limit);
    }
    return baseQuery.where(whereClause);
  }

  if (typeof limit === "number") {
    return baseQuery.limit(limit);
  }
  return baseQuery;
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

  const whereClause = search
    ? like(civilWarOrphans.familyName, `%${search}%`)
    : undefined;

  if (whereClause) {
    return db.select().from(civilWarOrphans).where(whereClause).offset(offset);
  }

  return db.select().from(civilWarOrphans).offset(offset);
}

/**
 * Validates student results against the schema
 * @param results - Raw database results
 * @returns Validated student array
 */
function validateStudentResults(results: unknown[]) {
  return z.array(StudentTableRowSchema).parse(results);
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
    `Failed to fetch students: ${error instanceof Error ? error.message : "Unknown error"}`
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
    `Failed to fetch civil war orphans: ${error instanceof Error ? error.message : "Unknown error"}`
  );
}

export const appRouter = {
  healthCheck: publicProcedure.output(z.string()).handler(() => {
    return "OK";
  }),
  getStudents: publicProcedure
    .input(getStudentsInputSchema.optional())
    .output(z.array(StudentTableRowSchema))
    .handler(async ({ input }) => {
      try {
        const studentRows = await buildStudentQuery(input);
        const validatedStudents = z.array(StudentEntitySchema).parse(studentRows);

        if (!validatedStudents.length) {
          return [];
        }

        const studentIds = validatedStudents.map((student) => student.studentId);
        const nationIds = validatedStudents
          .map((student) => student.nationId)
          .filter((id): id is number => typeof id === "number");
        const agencyIds = validatedStudents
          .map((student) => student.agencyId)
          .filter((id): id is number => typeof id === "number");

        const [nationRows, agencyRows, enrollmentRows] = await Promise.all([
          nationIds.length
            ? db
                .select({
                  nationId: nations.nationId,
                  nation: nations.nation,
                })
                .from(nations)
                .where(inArray(nations.nationId, nationIds))
            : Promise.resolve([]),
          agencyIds.length
            ? db
                .select({
                  agencyId: agencies.agencyId,
                  agency: agencies.agency,
                })
                .from(agencies)
                .where(inArray(agencies.agencyId, agencyIds))
            : Promise.resolve([]),
          db
            .select({
              studentId: enrollments.studentId,
              arrivalDateFull: enrollments.arrivalDateFull,
              departureDateFull: enrollments.departureDateFull,
              arrivalYearNumeric: enrollments.arrivalYearNumeric,
              departureYearNumeric: enrollments.departureYearNumeric,
              trade: enrollments.trade,
              diedAtLincoln: enrollments.diedAtLincoln,
            })
            .from(enrollments)
            .where(inArray(enrollments.studentId, studentIds)),
        ]);

        const nationById = new Map(nationRows.map((row) => [row.nationId, row.nation]));
        const agencyById = new Map(agencyRows.map((row) => [row.agencyId, row.agency]));
        const enrollmentByStudentId = new Map<number, (typeof enrollmentRows)[number]>();

        for (const enrollment of enrollmentRows) {
          if (enrollment.studentId === null) {
            continue;
          }
          const existing = enrollmentByStudentId.get(enrollment.studentId);
          if (!existing) {
            enrollmentByStudentId.set(enrollment.studentId, enrollment);
            continue;
          }

          const existingDepartureYear = existing.departureYearNumeric ?? Number.MIN_SAFE_INTEGER;
          const nextDepartureYear =
            enrollment.departureYearNumeric ?? Number.MIN_SAFE_INTEGER;
          const existingArrivalYear = existing.arrivalYearNumeric ?? Number.MIN_SAFE_INTEGER;
          const nextArrivalYear = enrollment.arrivalYearNumeric ?? Number.MIN_SAFE_INTEGER;

          const shouldReplace =
            nextDepartureYear > existingDepartureYear ||
            (nextDepartureYear === existingDepartureYear &&
              nextArrivalYear > existingArrivalYear);

          if (shouldReplace) {
            enrollmentByStudentId.set(enrollment.studentId, enrollment);
          }
        }

        const result = validatedStudents.map((student) => {
          const enrollment = enrollmentByStudentId.get(student.studentId);
          return {
            studentId: student.studentId,
            familyName: student.familyName,
            givenName: student.givenName,
            indianName: student.indianName,
            sex: student.sex,
            birthYear: student.birthYear,
            nation:
              student.nationId === null
                ? null
                : (nationById.get(student.nationId) ?? null),
            agency:
              student.agencyId === null
                ? null
                : (agencyById.get(student.agencyId) ?? null),
            arrivalDateFull: enrollment?.arrivalDateFull ?? null,
            departureDateFull: enrollment?.departureDateFull ?? null,
            trade: enrollment?.trade ?? null,
            diedAtLincoln: enrollment?.diedAtLincoln ?? null,
          };
        });

        return validateStudentResults(result);
      } catch (error) {
        handleStudentQueryError(error);
      }
    }),
  getNations: publicProcedure.output(z.array(z.object({
    nationId: z.number(),
    nation: z.string().nullable(),
    band: z.string().nullable(),
  }))).handler(async () => {
    return db.select().from(nations);
  }),
  getAgencies: publicProcedure.output(z.array(z.object({
    agencyId: z.number(),
    agency: z.string().nullable(),
  }))).handler(async () => {
    return db.select().from(agencies);
  }),
  getEnrollments: publicProcedure.output(z.array(z.object({
    studentId: z.number().nullable(),
    arrivalDateFull: z.string().nullable(),
    departureDateFull: z.string().nullable(),
    arrivalYearNumeric: z.number().nullable(),
    departureYearNumeric: z.number().nullable(),
    lengthOfStayDays: z.number().nullable(),
    diedAtLincoln: z.boolean().nullable(),
    trade: z.string().nullable(),
  }))).handler(async () => {
    return db.select().from(enrollments);
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
