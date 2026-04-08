import { z } from "zod";

export const NationSchema = z.object({
  nationId: z.number(),
  nation: z.string().nullable(),
  band: z.string().nullable(),
});

export type Nation = z.infer<typeof NationSchema>;
