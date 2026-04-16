import { useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { createQueryClient } from "@/lib/query/query-client";
import { router } from "@/routes";
import { env } from "@/config/env";

export default function App() {
  const queryClient = useMemo(() => createQueryClient(), []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider baseUrl={env.apiBaseUrl}>
          <RouterProvider router={router} />
        </AuthProvider>
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
