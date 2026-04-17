import { describe, expect, it, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/lib/auth/auth-context-value";
import type { ApiClient } from "@/lib/api/client";
import { createTestQueryClient } from "@/test/test-utils";
import { endpoints } from "@/lib/api/endpoints";
import { usePreviewInvoiceMutation, useImportInvoiceMutation } from "./use-invoice-import";
import type {
  InvoiceImportPreviewResponse,
  InvoiceImportCommitRequest,
  InvoiceImportCommitResponse,
} from "./types";

function makeApiClient(overrides?: Partial<ApiClient>): ApiClient {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    del: vi.fn(),
    postMultipart: vi.fn(),
    ...overrides,
  };
}

function makeWrapper(apiClient: ApiClient) {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider
          value={{
            isAuthenticated: true,
            isInitializing: false,
            login: async () => {},
            logout: () => {},
            apiClient,
          }}
        >
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    );
  };
}

const PREVIEW_RESPONSE: InvoiceImportPreviewResponse = {
  source_file_name: "invoice.pdf",
  detected_card: {
    last_four_digits: "1234",
    matched_card_id: 10,
    matched_card_alias: "Nubank",
    matched_card_bank: "Nubank",
  },
  items: [
    {
      temp_id: "t1",
      date: "2026-03-15",
      establishment: "iFood",
      description: "Pizza",
      amount: "62.30",
      transaction_type: "EXPENSE",
      payment_method: "CREDIT",
      suggested_category_id: 1,
      suggested_category_name: "Alimentação",
      issuer_hint: null,
      is_international: false,
      original_currency: null,
      original_amount: null,
      is_possible_duplicate: false,
      duplicate_of_transaction_id: null,
      confidence: 0.97,
    },
  ],
};

const COMMIT_REQUEST: InvoiceImportCommitRequest = {
  card_id: 10,
  items: [
    {
      date: "2026-03-15",
      establishment: "iFood",
      description: "Pizza",
      amount: "62.30",
      category_id: 1,
    },
  ],
};

const COMMIT_RESPONSE: InvoiceImportCommitResponse = {
  imported_count: 1,
  card_id: 10,
  transaction_ids: ["tx-abc-123"],
};

describe("usePreviewInvoiceMutation", () => {
  it("calls postMultipart with the preview endpoint and a FormData containing the file", async () => {
    const apiClient = makeApiClient({
      postMultipart: vi.fn().mockResolvedValue(PREVIEW_RESPONSE),
    });

    const { result } = renderHook(() => usePreviewInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    const file = new File(["pdf-content"], "invoice.pdf", { type: "application/pdf" });

    await act(async () => {
      result.current.mutate(file);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.postMultipart).toHaveBeenCalledOnce();
    const [path, formData] = (apiClient.postMultipart as ReturnType<typeof vi.fn>).mock.calls[0] as [string, FormData];
    expect(path).toBe(endpoints.invoiceImport.preview);
    expect(formData.get("file")).toBe(file);
  });

  it("surfaces the response data on success", async () => {
    const apiClient = makeApiClient({
      postMultipart: vi.fn().mockResolvedValue(PREVIEW_RESPONSE),
    });

    const { result } = renderHook(() => usePreviewInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    const file = new File(["pdf-content"], "invoice.pdf", { type: "application/pdf" });

    await act(async () => {
      result.current.mutate(file);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(PREVIEW_RESPONSE);
  });

  it("surfaces the error when postMultipart rejects", async () => {
    const error = new Error("Upload failed");
    const apiClient = makeApiClient({
      postMultipart: vi.fn().mockRejectedValue(error),
    });

    const { result } = renderHook(() => usePreviewInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    const file = new File(["pdf-content"], "invoice.pdf", { type: "application/pdf" });

    await act(async () => {
      result.current.mutate(file);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});

describe("useImportInvoiceMutation", () => {
  it("calls post with the commit endpoint and the request body", async () => {
    const apiClient = makeApiClient({
      post: vi.fn().mockResolvedValue(COMMIT_RESPONSE),
    });

    const { result } = renderHook(() => useImportInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    await act(async () => {
      result.current.mutate(COMMIT_REQUEST);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.post).toHaveBeenCalledOnce();
    expect(apiClient.post).toHaveBeenCalledWith(
      endpoints.invoiceImport.commit,
      COMMIT_REQUEST,
    );
  });

  it("surfaces the response data on success", async () => {
    const apiClient = makeApiClient({
      post: vi.fn().mockResolvedValue(COMMIT_RESPONSE),
    });

    const { result } = renderHook(() => useImportInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    await act(async () => {
      result.current.mutate(COMMIT_REQUEST);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(COMMIT_RESPONSE);
  });

  it("surfaces the error when post rejects", async () => {
    const error = new Error("Commit failed");
    const apiClient = makeApiClient({
      post: vi.fn().mockRejectedValue(error),
    });

    const { result } = renderHook(() => useImportInvoiceMutation(), {
      wrapper: makeWrapper(apiClient),
    });

    await act(async () => {
      result.current.mutate(COMMIT_REQUEST);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
