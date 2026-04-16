import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { SummaryEntry } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export interface UseSummaryArgs {
  start: string;
  end: string;
  enabled?: boolean;
}

export function useSummary({ start, end, enabled = true }: UseSummaryArgs) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<SummaryEntry[]>({
    queryKey: queryKeys.reports.summary(start, end),
    queryFn: () =>
      apiClient.get<SummaryEntry[]>(endpoints.reports.summary, {
        query: { start, end },
      }),
    enabled: enabled && isAuthenticated && Boolean(start) && Boolean(end),
    staleTime: 60_000,
  });
}
