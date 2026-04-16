import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { InvoicePredictionResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export function useInvoicePrediction(cardId: number, enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<InvoicePredictionResponse | null, Error>({
    queryKey: queryKeys.cards.invoicePrediction(cardId),
    queryFn: () =>
      apiClient.get<InvoicePredictionResponse | null>(
        endpoints.cards.invoicePrediction(cardId),
        { expect: "json" }
      ),
    enabled: enabled && cardId > 0 && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
