import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CardCreateRequest,
  CardResponse,
} from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

function useInvalidateCards() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
  };
}

export function useCreateCard() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCards();

  return useMutation<CardResponse, Error, CardCreateRequest>({
    mutationFn: (body) =>
      apiClient.post<CardResponse>(endpoints.cards.list, body),
    onSuccess: invalidate,
  });
}

export interface UpdateCardArgs {
  id: number;
  body: Partial<CardCreateRequest>;
}

export function useUpdateCard() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCards();

  return useMutation<CardResponse, Error, UpdateCardArgs>({
    mutationFn: ({ id, body }) =>
      apiClient.put<CardResponse>(endpoints.cards.byId(id), body),
    onSuccess: invalidate,
  });
}

export function useDeleteCard() {
  const { apiClient } = useAuth();
  const invalidate = useInvalidateCards();

  return useMutation<void, Error, number>({
    mutationFn: (id) => apiClient.del<void>(endpoints.cards.byId(id)),
    onSuccess: invalidate,
  });
}
