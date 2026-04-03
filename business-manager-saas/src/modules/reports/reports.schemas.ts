import { z } from "zod";

export const reportPeriodSchema = z.enum(["day", "week", "month", "year"]);

export const financialReportSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    period: reportPeriodSchema.optional(),
    category: z.string().optional(),
  }),
});

export const appointmentsReportSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    period: reportPeriodSchema.optional(),
    userId: z.string().uuid().optional(),
  }),
});

export const comparisonReportSchema = z.object({
  query: z.object({
    currentStart: z.string().datetime(),
    currentEnd: z.string().datetime(),
    previousStart: z.string().datetime(),
    previousEnd: z.string().datetime(),
  }),
});

export type FinancialReportDTO = z.infer<typeof financialReportSchema>["query"];
export type AppointmentsReportDTO = z.infer<typeof appointmentsReportSchema>["query"];
export type ComparisonReportDTO = z.infer<typeof comparisonReportSchema>["query"];
