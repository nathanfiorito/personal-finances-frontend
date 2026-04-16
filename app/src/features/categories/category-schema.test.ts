import { describe, expect, it } from "vitest";
import { categoryFormSchema } from "./category-schema";

describe("categoryFormSchema", () => {
  it("accepts a trimmed name", () => {
    const result = categoryFormSchema.safeParse({ name: "Alimentação" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = categoryFormSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects names longer than 80 characters", () => {
    const result = categoryFormSchema.safeParse({ name: "x".repeat(81) });
    expect(result.success).toBe(false);
  });
});
