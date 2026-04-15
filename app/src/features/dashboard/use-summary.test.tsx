import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import type { ApiClient } from "@/lib/api/client";
import type { SummaryEntry } from "@/lib/api/types";
import { useSummary } from "./use-summary";

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

describe("useSummary", () => {
  it("fetches the summary for the given range", async () => {
    const payload: SummaryEntry[] = [
      { category: "Food", total: "100.00", count: 3 },
    ];
    const get = vi.fn().mockResolvedValue(payload);
    const apiClient = makeApi(get);

    const { result } = renderHook(
      () => useSummary({ start: "2026-04-01", end: "2026-04-30" }),
      { wrapper: wrap(apiClient) }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledWith("/api/v1/reports/summary", {
      query: { start: "2026-04-01", end: "2026-04-30" },
    });
    expect(result.current.data).toEqual(payload);
  });

  it("does not fetch while unauthenticated", async () => {
    const get = vi.fn();
    const apiClient = makeApi(get);

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestProviders
        queryClient={queryClient}
        apiClient={apiClient}
        auth={{ isAuthenticated: false }}
      >
        {children}
      </TestProviders>
    );

    const { result } = renderHook(
      () => useSummary({ start: "2026-04-01", end: "2026-04-30" }),
      { wrapper }
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.fetchStatus).toBe("idle");
    expect(get).not.toHaveBeenCalled();
  });
});
