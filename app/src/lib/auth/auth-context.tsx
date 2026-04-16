import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { endpoints } from "@/lib/api/endpoints";
import type { LoginRequest, LoginResponse } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";
import { createApiClient } from "@/lib/api/client";
import { AuthContext, type AuthState } from "./auth-context-value";
import { computeExpiresAt, tokenStorage, type StoredToken } from "./token-storage";

interface AuthProviderProps {
  baseUrl: string;
  children: ReactNode;
  onUnauthenticatedRedirect?: () => void;
  fetchImpl?: typeof fetch;
}

export function AuthProvider({
  baseUrl,
  children,
  onUnauthenticatedRedirect,
  fetchImpl,
}: AuthProviderProps) {
  const [stored, setStored] = useState<StoredToken | null>(() => {
    const existing = tokenStorage.read();
    if (tokenStorage.isExpired(existing)) {
      if (existing) tokenStorage.clear();
      return null;
    }
    return existing;
  });
  const [isInitializing, setIsInitializing] = useState(false);

  const storedRef = useRef(stored);
  useEffect(() => {
    storedRef.current = stored;
  }, [stored]);

  const handleUnauthorized = useCallback(() => {
    tokenStorage.clear();
    setStored(null);
    onUnauthenticatedRedirect?.();
  }, [onUnauthenticatedRedirect]);

  const apiClient = useMemo(
    () =>
      createApiClient({
        baseUrl,
        getToken: () => {
          const current = storedRef.current;
          if (!current || tokenStorage.isExpired(current)) {
            return null;
          }
          return current.token;
        },
        onUnauthorized: handleUnauthorized,
        fetchImpl,
      }),
    [baseUrl, handleUnauthorized, fetchImpl]
  );

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsInitializing(true);
      try {
        const unauthenticatedClient = createApiClient({
          baseUrl,
          getToken: () => null,
          fetchImpl,
        });
        const response = await unauthenticatedClient.post<LoginResponse>(
          endpoints.auth.login,
          credentials
        );
        const value: StoredToken = {
          token: response.token,
          expires_at: computeExpiresAt(response.expires_in),
        };
        tokenStorage.write(value);
        setStored(value);
      } catch (err) {
        if (err instanceof ApiError && err.isUnauthorized) {
          throw new ApiError({
            status: err.status,
            message: "Invalid email or password.",
            code: err.code,
            details: err.details,
          });
        }
        throw err;
      } finally {
        setIsInitializing(false);
      }
    },
    [baseUrl, fetchImpl]
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setStored(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: stored !== null && !tokenStorage.isExpired(stored),
      isInitializing,
      login,
      logout,
      apiClient,
    }),
    [stored, isInitializing, login, logout, apiClient]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
