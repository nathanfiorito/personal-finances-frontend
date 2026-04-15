import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type {
  TransactionCreateRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

function useInvalidateTransactions() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };
}

export function useCreateTransaction() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateTransactions();

  return useMutation<TransactionResponse, Error, TransactionCreateRequest>({
    mutationFn: (body) =>
      apiClient.post<TransactionResponse>(endpoints.transactions.list, body),
    onSuccess: invalidate,
  });
}

export interface UpdateTransactionArgs {
  id: string;
  body: TransactionUpdateRequest;
}

export function useUpdateTransaction() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateTransactions();

  return useMutation<TransactionResponse, Error, UpdateTransactionArgs>({
    mutationFn: ({ id, body }) =>
      apiClient.put<TransactionResponse>(endpoints.transactions.byId(id), body),
    onSuccess: invalidate,
  });
}

export function useDeleteTransaction() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateTransactions();

  return useMutation<void, Error, string>({
    mutationFn: (id) => apiClient.del<void>(endpoints.transactions.byId(id)),
    onSuccess: invalidate,
  });
}

export interface ExportCsvArgs {
  start: string;
  end: string;
}

export function useExportCsv() {
  const { apiClient } = useAuth();

  return useMutation<Blob, Error, ExportCsvArgs>({
    mutationFn: ({ start, end }) =>
      apiClient.get<Blob>(endpoints.export.csv, {
        query: { start, end },
        expect: "blob",
      }),
  });
}

export function downloadCsvBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
