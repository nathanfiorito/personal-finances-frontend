"use client";

import { createClient } from "@/lib/supabase/client";

export interface Expense {
  id: string;
  valor: string;
  data: string;
  estabelecimento: string | null;
  descricao: string | null;
  categoria: string;
  categoria_id: number | null;
  cnpj: string | null;
  tipo_entrada: string;
  transaction_type: "income" | "outcome";
  confianca: number | null;
  created_at: string;
}

export interface CategoryOut {
  id: number;
  nome: string;
  ativo: boolean;
}

export interface SummaryItem {
  categoria: string;
  total: string;
}

export interface MonthlyItem {
  month: number;
  total: string;
  by_category: { categoria: string; total: string }[];
}

export interface PaginatedExpenses {
  items: Expense[];
  total: number;
  page: number;
  page_size: number;
}

export interface ExpenseFilters {
  start?: string;
  end?: string;
  categoria_id?: number;
  transaction_type?: "income" | "outcome";
  page?: number;
  page_size?: number;
}

export interface ExpenseInput {
  valor: number;
  data: string;
  estabelecimento?: string;
  descricao?: string;
  categoria_id?: number;
  tipo_entrada: string;
  transaction_type: "income" | "outcome";
}

async function getJwt(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const jwt = await getJwt();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Sign out and redirect
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      errorMessage = body.detail || body.message || errorMessage;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ─── Expenses ────────────────────────────────────────────────────────────────

export async function getExpenses(filters: ExpenseFilters = {}): Promise<PaginatedExpenses> {
  const params = new URLSearchParams();
  if (filters.start) params.set("start", filters.start);
  if (filters.end) params.set("end", filters.end);
  if (filters.categoria_id !== undefined) params.set("categoria_id", String(filters.categoria_id));
  if (filters.transaction_type) params.set("transaction_type", filters.transaction_type);
  if (filters.page !== undefined) params.set("page", String(filters.page));
  if (filters.page_size !== undefined) params.set("page_size", String(filters.page_size));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<PaginatedExpenses>(`/api/transactions${query}`);
}

export async function getExpense(id: string): Promise<Expense> {
  return apiFetch<Expense>(`/api/transactions/${id}`);
}

export async function createExpense(data: ExpenseInput): Promise<Expense> {
  return apiFetch<Expense>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpense(id: string, data: Partial<ExpenseInput>): Promise<Expense> {
  return apiFetch<Expense>(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExpense(id: string): Promise<void> {
  return apiFetch<void>(`/api/transactions/${id}`, { method: "DELETE" });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryOut[]> {
  return apiFetch<CategoryOut[]>("/api/categories");
}

export async function createCategory(nome: string): Promise<CategoryOut> {
  return apiFetch<CategoryOut>("/api/categories", {
    method: "POST",
    body: JSON.stringify({ nome }),
  });
}

export async function updateCategory(id: number, data: Partial<CategoryOut>): Promise<CategoryOut> {
  return apiFetch<CategoryOut>(`/api/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deactivateCategory(id: number): Promise<void> {
  return apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" });
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function getSummary(
  start: string,
  end: string,
  transaction_type?: "income" | "outcome"
): Promise<SummaryItem[]> {
  const params = new URLSearchParams({ start, end });
  if (transaction_type) params.set("transaction_type", transaction_type);
  return apiFetch<SummaryItem[]>(`/api/reports/summary?${params.toString()}`);
}

export async function getMonthly(year: number): Promise<MonthlyItem[]> {
  return apiFetch<MonthlyItem[]>(`/api/reports/monthly?year=${year}`);
}

// ─── Export ──────────────────────────────────────────────────────────────────

export async function exportCsv(start: string, end: string): Promise<Blob> {
  const jwt = await getJwt();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${baseUrl}/api/export/csv?start=${start}&end=${end}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });

  if (response.status === 401 || response.status === 403) {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.blob();
}
