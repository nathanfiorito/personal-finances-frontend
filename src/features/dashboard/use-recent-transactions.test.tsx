import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders, createTestQueryClient } from "@/test/test-utils";
import type { ApiClient } from "@/lib/api/client";
import type { PageResponse, TransactionResponse } from "@/lib/api/types";
import { useRecentTransactions } from "./use-recent-transactions";

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

describe("useRecentTransactions", () => {
  it("fetches page 0 with the requested limit and unwraps items", async () => {
    const items: TransactionResponse[] = [
      {
        id: "1",
        amount: "10.00",
        date: "2026-04-14",
        establishment: "Starbucks",
        description: null,
        category_id: 3,
        category: "Cafeteria",
        tax_id: null,
        entry_type: "image",
        transaction_type: "expense",
        payment_method: "credit",
        confidence: 1,
        created_at: "2026-04-14T09:00:00Z",
      },
    ];
    const payload: PageResponse<TransactionResponse> = {
      items,
      total: 1,
      page: 0,
      page_size: 5,
    };
    const get = vi.fn().mockResolvedValue(payload);
    const apiClient = makeApi(get);

    const { result } = renderHook(() => useRecentTransactions(), { wrapper: wrap(apiClient) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(get).toHaveBeenCalledWith("/api/v1/transactions", {
      query: { page: 0, page_size: 5 },
    });
    expect(result.current.data).toEqual(items);
  });

  it("respects a custom limit", async () => {
    const payload: PageResponse<TransactionResponse> = {
      items: [],
      total: 0,
      page: 0,
      page_size: 10,
    };
    const get = vi.fn().mockResolvedValue(payload);
    const apiClient = makeApi(get);

    const { result } = renderHook(() => useRecentTransactions({ limit: 10 }), {
      wrapper: wrap(apiClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith("/api/v1/transactions", {
      query: { page: 0, page_size: 10 },
    });
  });
});
