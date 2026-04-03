import { z } from "zod";

export const dashboardSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export type DashboardDTO = z.infer<typeof dashboardSchema>["query"];
