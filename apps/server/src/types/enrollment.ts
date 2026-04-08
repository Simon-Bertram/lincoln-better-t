import { z } from "zod";

export const EnrollmentSchema = z.object({
  studentId: z.number().nullable(),
  arrivalDateFull: z.string().nullable(),
  departureDateFull: z.string().nullable(),
  arrivalYearNumeric: z.number().nullable(),
  departureYearNumeric: z.number().nullable(),
  lengthOfStayDays: z.number().nullable(),
  diedAtLincoln: z.boolean().nullable(),
  trade: z.string().nullable(),
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;
