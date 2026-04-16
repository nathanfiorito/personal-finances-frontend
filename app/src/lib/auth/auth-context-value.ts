import { createContext } from "react";
import type { LoginRequest } from "@/lib/api/types";
import type { ApiClient } from "@/lib/api/client";

export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  apiClient: ApiClient;
}

export const AuthContext = createContext<AuthState | null>(null);
