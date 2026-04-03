import { z } from "zod";

export const appointmentStatusEnum = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const createAppointmentSchema = z.object({
  body: z.object({
    customerId: z.string().uuid("ID do cliente inválido"),
    userId: z.string().uuid("ID do usuário inválido"),
    date: z.string().datetime("Data inválida"),
    endDate: z.string().datetime("Data de fim inválida"),
    service: z.string().min(1, "Serviço é obrigatório"),
    notes: z.string().optional(),
  }),
});

export const updateAppointmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    customerId: z.string().uuid("ID do cliente inválido").optional(),
    userId: z.string().uuid("ID do usuário inválido").optional(),
    date: z.string().datetime("Data inválida").optional(),
    endDate: z.string().datetime("Data de fim inválida").optional(),
    service: z.string().min(1, "Serviço é obrigatório").optional(),
    status: appointmentStatusEnum.optional(),
    notes: z.string().optional().nullable(),
  }),
});

export const getAppointmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const listAppointmentsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "1", 10)),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "20", 10)),
    customerId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    status: appointmentStatusEnum.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export type CreateAppointmentDTO = z.infer<
  typeof createAppointmentSchema
>["body"];
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
export type ListAppointmentsDTO = z.infer<
  typeof listAppointmentsSchema
>["query"];
