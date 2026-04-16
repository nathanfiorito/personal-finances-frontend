import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { PageResponse, TransactionResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export interface UseTransactionsArgs {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useTransactions({
  page = 0,
  pageSize = 20,
  enabled = true,
}: UseTransactionsArgs = {}) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<PageResponse<TransactionResponse>>({
    queryKey: queryKeys.transactions.list(page, pageSize),
    queryFn: () =>
      apiClient.get<PageResponse<TransactionResponse>>(endpoints.transactions.list, {
        query: { page, page_size: pageSize },
      }),
    enabled: enabled && isAuthenticated,
    placeholderData: (previous) => previous,
  });
}
