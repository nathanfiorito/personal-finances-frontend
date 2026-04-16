import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import type { ApiClient } from "@/lib/api/client";
import type { MonthlyReportEntry } from "@/lib/api/types";
import { useMonthlyReport } from "./use-monthly-report";

function makeApi(get: ReturnType<typeof vi.fn>): ApiClient {
  return {
    get: get as unknown as ApiClient["get"],
    post: vi.fn() as unknown as ApiClient["post"],
    put: vi.fn() as unknown as ApiClient["put"],
    patch: vi.fn() as unknown as ApiClient["patch"],
    del: vi.fn() as unknown as ApiClient["del"],
  };
}

function wrap(apiClient: ApiClient) {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: ReactNode }) => (
    <TestProviders queryClient={queryClient} apiClient={apiClient}>
      {children}
    </TestProviders>
  );
}

describe("useMonthlyReport", () => {
  it("fetches the monthly report for the given year", async () => {
    const payload: MonthlyReportEntry[] = [
      { month: 1, total: "2850.00", by_category: [] },
      { month: 2, total: "3120.40", by_category: [] },
    ];
    const get = vi.fn().mockResolvedValue(payload);
    const apiClient = makeApi(get);

    const { result } = renderHook(() => useMonthlyReport({ year: 2026 }), {
      wrapper: wrap(apiClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledWith("/api/v1/reports/monthly", {
      query: { year: 2026 },
    });
    expect(result.current.data).toEqual(payload);
  });
});
