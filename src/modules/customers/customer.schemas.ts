import { z } from "zod";

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome é obrigatório"),
    phone: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    notes: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    name: z.string().min(2, "Nome é obrigatório").optional(),
    phone: z.string().optional().nullable(),
    email: z.string().email("Email inválido").optional().nullable().or(z.literal("")),
    notes: z.string().optional().nullable(),
  }),
});

export const getCustomerSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const listCustomersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || "1", 10)),
    limit: z.string().optional().transform((val) => parseInt(val || "20", 10)),
    search: z.string().optional(),
  }),
});

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>["body"];
export type UpdateCustomerDTO = z.infer<typeof updateCustomerSchema>;
export type ListCustomersDTO = z.infer<typeof listCustomersSchema>["query"];
