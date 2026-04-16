import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { CategoryResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

function sortByName(categories: CategoryResponse[]): CategoryResponse[] {
  return [...categories].sort((a, b) => collator.compare(a.name, b.name));
}

export function useCategories(enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<CategoryResponse[], Error, CategoryResponse[]>({
    queryKey: queryKeys.categories.list,
    queryFn: () => apiClient.get<CategoryResponse[]>(endpoints.categories.list),
    select: sortByName,
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
