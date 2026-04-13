import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, currentMonthRange } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats a positive number in BRL", () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/1\.234,56/);
    expect(result).toContain("R$");
  });
  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/0,00/);
    expect(result).toContain("R$");
  });
  it("formats a string value", () => {
    const result = formatCurrency("245.90");
    expect(result).toMatch(/245,90/);
    expect(result).toContain("R$");
  });
  it("formats large numbers", () => {
    const result = formatCurrency(999999.99);
    expect(result).toMatch(/999\.999,99/);
    expect(result).toContain("R$");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    const result = formatDate("2026-04-12");
    expect(result).toContain("2026");
    expect(result).toMatch(/abr\.?/i); // pt-BR short month
  });
});

describe("currentMonthRange", () => {
  it("returns start as first day of month", () => {
    const { start } = currentMonthRange();
    expect(start).toMatch(/^\d{4}-\d{2}-01$/);
  });
  it("returns end as last day of month", () => {
    const { end } = currentMonthRange();
    expect(end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const [, , day] = end.split("-");
    expect(Number(day)).toBeGreaterThanOrEqual(28);
  });
});
