import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { CategoryResponse } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export function useCategories(enabled = true) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<CategoryResponse[]>({
    queryKey: queryKeys.categories.list,
    queryFn: () => apiClient.get<CategoryResponse[]>(endpoints.categories.list),
    enabled: enabled && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
