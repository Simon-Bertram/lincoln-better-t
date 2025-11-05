import { z } from "zod";

// Pagination and validation constants
const PAGINATION_LIMITS = {
  MAX_LIMIT: 100,
  MAX_SEARCH_LENGTH: 200,
  MAX_OFFSET: 10_000,
} as const;

// Define the complete CivilWarOrphan type based on the database schema
export const CivilWarOrphanSchema = z.object({
  id: z.number(),
  familyName: z.string().nullable(),
  givenName: z.string().nullable(),
  aliases: z.string().nullable(),
  birthDate: z.string().nullable(),
  arrival: z.string().nullable(),
  departure: z.string().nullable(),
  scholarships: z.string().nullable(),
  assignments: z.string().nullable(),
  situation1878: z.string().nullable(),
  assignmentScholarshipYear: z.string().nullable(),
  references: z.string().nullable(),
  comments: z.string().nullable(),
  birthDateOriginalText: z.string().nullable(),
  birthDateUncertain: z.string().nullable(),
  birthDateClean: z.string().nullable(),
  arrivalOriginalText: z.string().nullable(),
  arrivalUncertain: z.string().nullable(),
  arrivalAtLincoln: z.string().nullable(),
  departureOriginalText: z.string().nullable(),
  departureUncertain: z.string().nullable(),
  departureAtLincoln: z.string().nullable(),
  departureFromLincoln: z.string().nullable(),
});

export type CivilWarOrphan = z.infer<typeof CivilWarOrphanSchema>;

// Input schemas for API procedures
export const getCivilWarOrphansInputSchema = z.object({
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

export type GetCivilWarOrphansInput = z.infer<
  typeof getCivilWarOrphansInputSchema
>;
