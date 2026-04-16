import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { CardResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

function sortByAlias(cards: CardResponse[]): CardResponse[] {
  return [...cards].sort((a, b) => collator.compare(a.alias, b.alias));
}

export function useCards(enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<CardResponse[], Error, CardResponse[]>({
    queryKey: queryKeys.cards.list,
    queryFn: () => apiClient.get<CardResponse[]>(endpoints.cards.list),
    select: sortByAlias,
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
