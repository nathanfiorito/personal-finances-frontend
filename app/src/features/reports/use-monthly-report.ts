import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { endpoints } from "@/lib/api/endpoints";
import type { MonthlyReportEntry } from "@/lib/api/types";
import { queryKeys } from "@/lib/query/query-keys";

export interface UseMonthlyReportArgs {
  year: number;
  enabled?: boolean;
}

export function useMonthlyReport({ year, enabled = true }: UseMonthlyReportArgs) {
  const { apiClient, isAuthenticated } = useAuth();

  return useQuery<MonthlyReportEntry[]>({
    queryKey: queryKeys.reports.monthly(year),
    queryFn: () =>
      apiClient.get<MonthlyReportEntry[]>(endpoints.reports.monthly, {
        query: { year },
      }),
    enabled: enabled && isAuthenticated,
    staleTime: 60_000,
  });
}
