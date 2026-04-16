import Big from "big.js";

const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_CURRENCY = "BRL";

export interface MoneyFormatOptions {
  locale?: string;
  currency?: string;
  withSymbol?: boolean;
}

function toBig(amount: string | number | Big): Big {
  return amount instanceof Big ? amount : new Big(amount);
}

export function parseAmount(amount: string): Big {
  return new Big(amount);
}

export function formatMoney(
  amount: string | number | Big,
  options: MoneyFormatOptions = {}
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = DEFAULT_CURRENCY,
    withSymbol = true,
  } = options;

  const value = toBig(amount);
  const asNumber = Number(value.toFixed(2));

  return new Intl.NumberFormat(locale, {
    style: withSymbol ? "currency" : "decimal",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(asNumber);
}

export function addAmounts(a: string, b: string): string {
  return new Big(a).plus(new Big(b)).toFixed(2);
}

export function sumAmounts(amounts: readonly string[]): string {
  return amounts.reduce((acc, next) => acc.plus(new Big(next)), new Big(0)).toFixed(2);
}

export function negateAmount(amount: string): string {
  return new Big(amount).neg().toFixed(2);
}

export function isNegative(amount: string): boolean {
  return new Big(amount).lt(0);
}
