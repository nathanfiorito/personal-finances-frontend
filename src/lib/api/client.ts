"use client";

import { createClient } from "@/lib/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function getJwt(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function handleUnauthorized(): Promise<never> {
  const supabase = createClient();
  await supabase.auth.signOut();
  window.location.href = "/login";
  throw new Error("Unauthorized");
}

export async function clientFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const jwt = await getJwt();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  if (res.status === 401 || res.status === 403) return handleUnauthorized();
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.detail || body.message || message;
    } catch {}
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Transactions
export async function createTransaction(data: object) {
  return clientFetch("/api/v2/transactions", { method: "POST", body: JSON.stringify(data) });
}
export async function updateTransaction(id: string, data: object) {
  return clientFetch(`/api/v2/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteTransaction(id: string) {
  return clientFetch(`/api/v2/transactions/${id}`, { method: "DELETE" });
}

// Categories
export async function createCategory(name: string) {
  return clientFetch("/api/v2/categories", { method: "POST", body: JSON.stringify({ name }) });
}
export async function updateCategory(id: number, data: object) {
  return clientFetch(`/api/v2/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}
export async function deactivateCategory(id: number) {
  return clientFetch(`/api/v2/categories/${id}`, { method: "DELETE" });
}

// CSV export (returns Blob, not JSON)
export async function exportCsv(start: string, end: string): Promise<Blob> {
  const jwt = await getJwt();
  const res = await fetch(`${BASE_URL}/api/v2/export/csv?start=${start}&end=${end}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
  if (res.status === 401 || res.status === 403) return handleUnauthorized();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}
