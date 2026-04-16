import { describe, expect, it } from "vitest";
import { PERIOD_LABELS, rangeForPreset } from "./period";

describe("rangeForPreset", () => {
  const now = new Date("2026-04-15T12:00:00Z");

  it("returns start and end of the current month for this-month", () => {
    expect(rangeForPreset("this-month", now)).toEqual({
      start: "2026-04-01",
      end: "2026-04-30",
    });
  });

  it("returns the previous month for last-month", () => {
    expect(rangeForPreset("last-month", now)).toEqual({
      start: "2026-03-01",
      end: "2026-03-31",
    });
  });

  it("returns a 30-day range ending today for last-30-days", () => {
    expect(rangeForPreset("last-30-days", now)).toEqual({
      start: "2026-03-17",
      end: "2026-04-15",
    });
  });

  it("returns a 90-day range ending today for last-90-days", () => {
    expect(rangeForPreset("last-90-days", now)).toEqual({
      start: "2026-01-16",
      end: "2026-04-15",
    });
  });

  it("returns the full year for this-year", () => {
    expect(rangeForPreset("this-year", now)).toEqual({
      start: "2026-01-01",
      end: "2026-12-31",
    });
  });
});

describe("PERIOD_LABELS", () => {
  it("has a label for every preset", () => {
    expect(Object.keys(PERIOD_LABELS)).toEqual([
      "this-month",
      "last-month",
      "last-30-days",
      "last-90-days",
      "this-year",
    ]);
  });
});
