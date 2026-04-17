import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import type { ApiClient } from "@/lib/api/client";
import type { PageResponse, TransactionResponse } from "@/lib/api/types";
import { useTransactions } from "./use-transactions";

function makeApi(get: ReturnType<typeof vi.fn>): ApiClient {
  return {
    get: get as unknown as ApiClient["get"],
    post: vi.fn() as unknown as ApiClient["post"],
    put: vi.fn() as unknown as ApiClient["put"],
    patch: vi.fn() as unknown as ApiClient["patch"],
    del: vi.fn() as unknown as ApiClient["del"],
    postMultipart: vi.fn() as unknown as ApiClient["postMultipart"],
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

describe("useTransactions", () => {
  it("fetches the given page with the requested page size", async () => {
    const payload: PageResponse<TransactionResponse> = {
      items: [],
      total: 42,
      page: 1,
      page_size: 20,
    };
    const get = vi.fn().mockResolvedValue(payload);
    const apiClient = makeApi(get);

    const { result } = renderHook(() => useTransactions({ page: 1, pageSize: 20 }), {
      wrapper: wrap(apiClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledWith("/api/v1/transactions", {
      query: { page: 1, page_size: 20 },
    });
    expect(result.current.data?.total).toBe(42);
  });
});
