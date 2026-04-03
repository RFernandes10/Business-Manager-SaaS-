import { z } from "zod";

export const entryTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const createFinancialEntrySchema = z.object({
  body: z.object({
    type: entryTypeEnum,
    amount: z.number().positive("Valor deve ser positivo"),
    description: z.string().min(1, "Descrição é obrigatória"),
    category: z.string().optional(),
    date: z.string().datetime("Data inválida"),
  }),
});

export const updateFinancialEntrySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
  body: z.object({
    type: entryTypeEnum.optional(),
    amount: z.number().positive("Valor deve ser positivo").optional(),
    description: z.string().min(1, "Descrição é obrigatória").optional(),
    category: z.string().optional().nullable(),
    date: z.string().datetime("Data inválida").optional(),
  }),
});

export const getFinancialEntrySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID inválido"),
  }),
});

export const listFinancialEntriesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => parseInt(val || "1", 10)),
    limit: z.string().optional().transform((val) => parseInt(val || "50", 10)),
    type: entryTypeEnum.optional(),
    category: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export type CreateFinancialEntryDTO = z.infer<typeof createFinancialEntrySchema>["body"];
export type UpdateFinancialEntryDTO = z.infer<typeof updateFinancialEntrySchema>;
export type ListFinancialEntriesDTO = z.infer<typeof listFinancialEntriesSchema>["query"];
