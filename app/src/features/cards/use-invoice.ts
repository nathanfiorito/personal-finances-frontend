import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { InvoiceResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export function useCurrentInvoice(cardId: number, enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<InvoiceResponse, Error>({
    queryKey: queryKeys.cards.invoiceCurrent(cardId),
    queryFn: () =>
      apiClient.get<InvoiceResponse>(endpoints.cards.invoiceCurrent(cardId)),
    enabled: enabled && cardId > 0 && isAuthenticated,
    staleTime: 30_000,
  });
}
