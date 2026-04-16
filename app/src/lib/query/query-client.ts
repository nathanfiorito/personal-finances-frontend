import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/types";

const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 422]);

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && NON_RETRYABLE_STATUSES.has(error.status)) {
            return false;
          }
          return failureCount < 1;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
