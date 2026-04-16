import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { PageResponse, TransactionResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export interface UseRecentTransactionsArgs {
  limit?: number;
  enabled?: boolean;
}

export function useRecentTransactions({
  limit = 5,
  enabled = true,
}: UseRecentTransactionsArgs = {}) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<PageResponse<TransactionResponse>, Error, TransactionResponse[]>({
    queryKey: queryKeys.transactions.recent(limit),
    queryFn: () =>
      apiClient.get<PageResponse<TransactionResponse>>(endpoints.transactions.list, {
        query: { page: 0, page_size: limit },
      }),
    select: (page) => page.items,
    enabled: enabled && isAuthenticated,
  });
}
