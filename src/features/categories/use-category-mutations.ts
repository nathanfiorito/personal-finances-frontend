import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CategoryCreateRequest,
  CategoryResponse,
  CategoryUpdateRequest,
} from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

function useInvalidateCategories() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
  };
}

export function useCreateCategory() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCategories();

  return useMutation<CategoryResponse, Error, CategoryCreateRequest>({
    mutationFn: (body) =>
      apiClient.post<CategoryResponse>(endpoints.categories.list, body),
    onSuccess: invalidate,
  });
}

export interface UpdateCategoryArgs {
  id: number;
  body: CategoryUpdateRequest;
}

export function useUpdateCategory() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCategories();

  return useMutation<CategoryResponse, Error, UpdateCategoryArgs>({
    mutationFn: ({ id, body }) =>
      apiClient.patch<CategoryResponse>(endpoints.categories.byId(id), body),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCategories();

  return useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.del<void>(endpoints.categories.byId(id)),
    onSuccess: invalidate,
  });
}
