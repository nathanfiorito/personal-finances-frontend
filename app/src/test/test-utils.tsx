import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, type AuthState } from "@/lib/auth/auth-context-value";
import type { ApiClient } from "@/lib/api/client";

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface TestProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
  auth?: Partial<AuthState>;
  apiClient: ApiClient;
}

export function TestProviders({
  children,
  queryClient = createTestQueryClient(),
  auth,
  apiClient,
}: TestProvidersProps) {
  const value: AuthState = {
    isAuthenticated: true,
    isInitializing: false,
    login: async () => {},
    logout: () => {},
    apiClient,
    ...auth,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}
