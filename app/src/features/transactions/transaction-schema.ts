import { z } from "zod";
import Big from "big.js";

const amountSchema = z
  .string()
  .min(1, { message: "Amount is required." })
  .refine(
    (value) => {
      try {
        return new Big(value).gt(0);
      } catch {
        return false;
      }
    },
    { message: "Amount must be greater than zero." }
  );

export const transactionFormSchema = z
  .object({
    amount: amountSchema,
    category_id: z
      .number({ error: "Category is required." })
      .int()
      .positive({ message: "Category is required." }),
    transaction_type: z.enum(["expense", "income"]),
    payment_method: z.enum(["credit", "debit"]),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Enter a valid date.",
    }),
    establishment: z.string().max(200).optional().or(z.literal("")),
    description: z.string().max(500).optional().or(z.literal("")),
    card_id: z.number().int().positive("Card is required.").nullable(),
  })
  .refine(
    (data) => data.payment_method !== "credit" || data.card_id != null,
    { message: "Card is required for credit transactions.", path: ["card_id"] }
  );

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
