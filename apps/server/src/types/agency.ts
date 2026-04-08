import { z } from "zod";

export const AgencySchema = z.object({
  agencyId: z.number(),
  agency: z.string().nullable(),
});

export type Agency = z.infer<typeof AgencySchema>;
