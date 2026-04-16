import { z } from "zod";

export const cardFormSchema = z.object({
  alias: z.string().min(1, "Alias is required.").max(100, "Alias must be 100 characters or fewer."),
  bank: z.string().min(1, "Bank is required.").max(100, "Bank must be 100 characters or fewer."),
  last_four_digits: z.string().regex(/^\d{4}$/, "Must be exactly 4 digits."),
  closing_day: z.number().int().min(1, "Must be between 1 and 31.").max(31, "Must be between 1 and 31."),
  due_day: z.number().int().min(1, "Must be between 1 and 31.").max(31, "Must be between 1 and 31."),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;
