import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { InvoiceTimelineResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export function useInvoiceTimeline(cardId: number, enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<InvoiceTimelineResponse, Error>({
    queryKey: queryKeys.cards.invoiceTimeline(cardId),
    queryFn: () =>
      apiClient.get<InvoiceTimelineResponse>(
        endpoints.cards.invoiceTimeline(cardId)
      ),
    enabled: enabled && cardId > 0 && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
