import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    tenantName: z.string().min(2),
    tenantSlug: z.string().min(2),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    tenantSlug: z.string().min(2),
  }),
});
