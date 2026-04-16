import { describe, expect, it } from "vitest";
import {
  addAmounts,
  formatMoney,
  isNegative,
  negateAmount,
  parseAmount,
  sumAmounts,
} from "./format-money";

describe("format-money", () => {
  it("formats an amount as BRL currency by default", () => {
    const result = formatMoney("1234.56");
    // NBSP / narrow-NBSP vary by ICU version; check meaningful parts
    expect(result).toContain("R$");
    expect(result).toContain("1.234,56");
  });

  it("formats without currency symbol when asked", () => {
    const result = formatMoney("1234.56", { withSymbol: false });
    expect(result).toBe("1.234,56");
  });

  it("preserves 2-decimal precision without coercing to Number for math", () => {
    expect(addAmounts("0.10", "0.20")).toBe("0.30");
    expect(sumAmounts(["0.1", "0.2", "0.3"])).toBe("0.60");
  });

  it("negates and detects negative amounts", () => {
    expect(negateAmount("10.00")).toBe("-10.00");
    expect(isNegative("-0.01")).toBe(true);
    expect(isNegative("0.00")).toBe(false);
  });

  it("parses into a Big", () => {
    const big = parseAmount("12.34");
    expect(big.toFixed(2)).toBe("12.34");
  });
});
