import { z } from "zod";

// Pagination and validation constants
const PAGINATION_LIMITS = {
  MAX_LIMIT: 100,
  MAX_SEARCH_LENGTH: 200,
  MAX_OFFSET: 10_000,
} as const;

// Students table row schema
export const StudentEntitySchema = z.object({
  studentId: z.number(),
  familyName: z.string().nullable(),
  givenName: z.string().nullable(),
  indianName: z.string().nullable(),
  sex: z.string().nullable(),
  birthYear: z.number().nullable(),
  nationId: z.number().nullable(),
  agencyId: z.number().nullable(),
});

export type StudentEntity = z.infer<typeof StudentEntitySchema>;

// API response schema for the normalized student table view
export const StudentTableRowSchema = z.object({
  studentId: z.number(),
  familyName: z.string().nullable(),
  givenName: z.string().nullable(),
  indianName: z.string().nullable(),
  sex: z.string().nullable(),
  birthYear: z.number().nullable(),
  nation: z.string().nullable(),
  agency: z.string().nullable(),
  arrivalDateFull: z.string().nullable(),
  departureDateFull: z.string().nullable(),
  trade: z.string().nullable(),
  diedAtLincoln: z.boolean().nullable(),
});

export type StudentTableRow = z.infer<typeof StudentTableRowSchema>;

// Input schemas for API procedures
export const getStudentsInputSchema = z.object({
  limit: z.number().min(1).max(PAGINATION_LIMITS.MAX_LIMIT).optional(),
  offset: z.number().min(0).max(PAGINATION_LIMITS.MAX_OFFSET).optional(),
  search: z
    .string()
    .max(PAGINATION_LIMITS.MAX_SEARCH_LENGTH)
    .regex(
      /^[a-zA-Z0-9\s\-'.]+$/,
      "Search can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    )
    .optional(),
});

export type GetStudentsInput = z.infer<typeof getStudentsInputSchema>;
