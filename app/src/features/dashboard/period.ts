import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";

export type PeriodPreset =
  | "this-month"
  | "last-month"
  | "last-30-days"
  | "last-90-days"
  | "this-year";

export interface PeriodRange {
  start: string;
  end: string;
}

export const PERIOD_LABELS: Record<PeriodPreset, string> = {
  "this-month": "This month",
  "last-month": "Last month",
  "last-30-days": "Last 30 days",
  "last-90-days": "Last 90 days",
  "this-year": "This year",
};

const ISO = "yyyy-MM-dd";

export function rangeForPreset(preset: PeriodPreset, now: Date = new Date()): PeriodRange {
  switch (preset) {
    case "this-month":
      return {
        start: format(startOfMonth(now), ISO),
        end: format(endOfMonth(now), ISO),
      };
    case "last-month": {
      const prev = subMonths(now, 1);
      return {
        start: format(startOfMonth(prev), ISO),
        end: format(endOfMonth(prev), ISO),
      };
    }
    case "last-30-days":
      return {
        start: format(subDays(now, 29), ISO),
        end: format(now, ISO),
      };
    case "last-90-days":
      return {
        start: format(subDays(now, 89), ISO),
        end: format(now, ISO),
      };
    case "this-year":
      return {
        start: format(startOfYear(now), ISO),
        end: format(endOfYear(now), ISO),
      };
  }
}
