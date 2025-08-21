import { z } from 'zod';

// Pagination and validation constants
const PAGINATION_LIMITS = {
  MAX_LIMIT: 100,
  MAX_SEARCH_LENGTH: 200,
} as const;

// Define the complete Student type based on the database schema
export const StudentSchema = z.object({
  id: z.number(),
  censusRecord1900: z.string().nullable(),
  indianName: z.string().nullable(),
  familyName: z.string().nullable(),
  englishGivenName: z.string().nullable(),
  alias: z.string().nullable(),
  sex: z.string().nullable(),
  yearOfBirth: z.number().nullable(),
  yearOfBirthUncertain: z.boolean().nullable(),
  yearOfBirthUncertaintyType: z.string().nullable(),
  yearOfBirthOriginalText: z.string().nullable(),
  arrivalAtLincoln: z.string().nullable(), // Date as string from database
  arrivalAtLincolnUncertain: z.boolean().nullable(),
  arrivalAtLincolnUncertaintyType: z.string().nullable(),
  arrivalAtLincolnOriginalText: z.string().nullable(),
  departureFromLincoln: z.string().nullable(), // Date as string from database
  departureFromLincolnUncertain: z.boolean().nullable(),
  departureFromLincolnUncertaintyType: z.string().nullable(),
  departureFromLincolnOriginalText: z.string().nullable(),
  nation: z.string().nullable(),
  band: z.string().nullable(),
  agency: z.string().nullable(),
  trade: z.string().nullable(),
  source: z.string().nullable(),
  comments: z.string().nullable(),
  causeOfDeath: z.string().nullable(),
  cemeteryBurial: z.string().nullable(),
  relevantLinks: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export type Student = z.infer<typeof StudentSchema>;

// Input schemas for API procedures
export const getStudentsInputSchema = z.object({
  limit: z.number().min(1).max(PAGINATION_LIMITS.MAX_LIMIT).optional(),
  offset: z.number().min(0).optional(),
  search: z.string().max(PAGINATION_LIMITS.MAX_SEARCH_LENGTH).optional(),
});

export type GetStudentsInput = z.infer<typeof getStudentsInputSchema>;
