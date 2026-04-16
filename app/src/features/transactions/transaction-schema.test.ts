import { describe, expect, it } from "vitest";
import { transactionFormSchema } from "./transaction-schema";

const validBase = {
  amount: "42.50",
  category_id: 1,
  transaction_type: "expense" as const,
  payment_method: "credit" as const,
  date: "2026-04-14",
  establishment: "",
  description: "",
  card_id: 1,
};

describe("transactionFormSchema", () => {
  it("accepts a minimal valid payload", () => {
    const result = transactionFormSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("rejects an amount of zero", () => {
    const result = transactionFormSchema.safeParse({ ...validBase, amount: "0" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain("amount");
    }
  });

  it("rejects a negative amount", () => {
    const result = transactionFormSchema.safeParse({ ...validBase, amount: "-5" });
    expect(result.success).toBe(false);
  });

  it("requires a category", () => {
    const result = transactionFormSchema.safeParse({ ...validBase, category_id: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain("category_id");
    }
  });

  it("rejects an invalid date format", () => {
    const result = transactionFormSchema.safeParse({ ...validBase, date: "14/04/2026" });
    expect(result.success).toBe(false);
  });
});
