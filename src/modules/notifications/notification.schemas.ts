import { z } from "zod";

export const createNotificationSchema = z.object({
  body: z.object({
    customerId: z.string().uuid("ID de cliente inválido").optional(),
    type: z.enum([
      "APPOINTMENT_REMINDER",
      "APPOINTMENT_CONFIRMATION",
      "APPOINTMENT_CANCELLATION",
      "FINANCIAL_ALERT",
      "MARKETING",
    ]),
    channel: z.string().default("email"),
    recipient: z.string().min(1, "Destinatário é obrigatório"),
    subject: z.string().optional(),
    content: z.string().min(1, "Conteúdo é obrigatório"),
    scheduledFor: z.string().datetime().optional(),
  }),
});

export const updateNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    status: z.enum(["PENDING", "SENT", "FAILED", "READ"]).optional(),
    content: z.string().min(1).optional(),
  }),
});

export const getNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const listNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || "1", 10)),
    limit: z.string().optional().transform((val) => parseInt(val || "20", 10)),
    status: z.enum(["PENDING", "SENT", "FAILED", "READ"]).optional(),
    type: z.enum([
      "APPOINTMENT_REMINDER",
      "APPOINTMENT_CONFIRMATION",
      "APPOINTMENT_CANCELLATION",
      "FINANCIAL_ALERT",
      "MARKETING",
    ]).optional(),
  }),
});

export type CreateNotificationDTO = z.infer<typeof createNotificationSchema>["body"];
export type UpdateNotificationDTO = z.infer<typeof updateNotificationSchema>;
export type ListNotificationsDTO = z.infer<typeof listNotificationsSchema>["query"];
