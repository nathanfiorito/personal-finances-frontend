import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  const jwt = data.session?.access_token;

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        ...(options.headers as Record<string, string> | undefined),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}
