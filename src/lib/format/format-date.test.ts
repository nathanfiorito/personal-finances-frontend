import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, toApiDate } from "./format-date";

describe("format-date", () => {
  it("formats an ISO date using the default pt-BR pattern", () => {
    expect(formatDate("2026-04-15")).toBe("15/04/2026");
  });

  it("formats datetime strings", () => {
    expect(formatDateTime("2026-04-15T13:45:00Z")).toMatch(/15\/04\/2026 \d{2}:\d{2}/);
  });

  it("serializes a Date to the backend date format", () => {
    expect(toApiDate(new Date("2026-04-15T10:00:00Z"))).toBe("2026-04-15");
  });
});
