import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "test-jwt" } } }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}));

describe("clientFetch", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://api.test";
  });

  it("throws with detail message on non-OK response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ detail: "Amount must be positive" }),
    } as unknown as Response);

    const { clientFetch } = await import("@/lib/api/client");
    await expect(clientFetch("/api/v2/transactions")).rejects.toThrow("Amount must be positive");
  });

  it("returns undefined for 204 responses", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    } as unknown as Response);

    const { clientFetch } = await import("@/lib/api/client");
    const result = await clientFetch("/api/v2/transactions/123");
    expect(result).toBeUndefined();
  });

  it("redirects to /login on 401", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 } as Response);
    Object.defineProperty(window, "location", { value: { href: "" }, writable: true });

    const { clientFetch } = await import("@/lib/api/client");
    await expect(clientFetch("/api/v2/transactions")).rejects.toThrow("Unauthorized");
    expect(window.location.href).toBe("/login");
  });

  it("redirects to /login on 403", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403 } as Response);
    Object.defineProperty(window, "location", { value: { href: "" }, writable: true });

    const { clientFetch } = await import("@/lib/api/client");
    await expect(clientFetch("/api/v2/transactions")).rejects.toThrow("Unauthorized");
    expect(window.location.href).toBe("/login");
  });
});
