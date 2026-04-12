/**
 * Tests for src/lib/api.ts — verifies route paths and query param building.
 * Mocks fetch and the Supabase client so no real network calls are made.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client before importing api functions
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: "test-jwt" } },
      }),
      signOut: vi.fn().mockResolvedValue({}),
    },
  }),
}));

import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getMonthly,
} from "@/lib/api";

// ─── helpers ─────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown = {}) {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
    blob: vi.fn(),
  };
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
  return response;
}

function capturedUrl(): string {
  const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
  return calls[calls.length - 1][0] as string;
}

beforeEach(() => {
  vi.unstubAllGlobals();
  // Set a predictable base URL
  process.env.NEXT_PUBLIC_API_BASE_URL = "http://api.test";
});

// ─── Route paths ─────────────────────────────────────────────────────────────

describe("route paths — migrated to /api/v2/transactions", () => {
  it("getExpenses calls /api/v2/transactions", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses();
    expect(capturedUrl()).toContain("/api/v2/transactions");
    expect(capturedUrl()).not.toContain("/api/expenses");
  });

  it("getExpense calls /api/v2/transactions/{id}", async () => {
    mockFetch(200, {});
    await getExpense("abc-123");
    expect(capturedUrl()).toBe("http://api.test/api/v2/transactions/abc-123");
  });

  it("createExpense POSTs to /api/v2/transactions", async () => {
    mockFetch(201, {});
    await createExpense({
      amount: 50,
      date: "2025-03-01",
      entry_type: "texto",
      transaction_type: "outcome",
    });
    expect(capturedUrl()).toBe("http://api.test/api/v2/transactions");
  });

  it("updateExpense PUTs to /api/v2/transactions/{id}", async () => {
    mockFetch(200, {});
    await updateExpense("abc-123", { transaction_type: "income" });
    expect(capturedUrl()).toBe("http://api.test/api/v2/transactions/abc-123");
  });

  it("deleteExpense DELETEs /api/v2/transactions/{id}", async () => {
    mockFetch(204);
    await deleteExpense("abc-123");
    expect(capturedUrl()).toBe("http://api.test/api/v2/transactions/abc-123");
  });
});

// ─── getExpenses — query params ──────────────────────────────────────────────

describe("getExpenses — query params", () => {
  it("no filters → no query string", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses();
    expect(capturedUrl()).toBe("http://api.test/api/v2/transactions");
  });

  it("transaction_type=income is appended", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses({ transaction_type: "income" });
    expect(capturedUrl()).toContain("transaction_type=income");
  });

  it("transaction_type=outcome is appended", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses({ transaction_type: "outcome" });
    expect(capturedUrl()).toContain("transaction_type=outcome");
  });

  it("undefined transaction_type is not appended", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses({ transaction_type: undefined });
    expect(capturedUrl()).not.toContain("transaction_type");
  });

  it("date filters are appended", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses({ start: "2025-01-01", end: "2025-01-31" });
    const url = capturedUrl();
    expect(url).toContain("start=2025-01-01");
    expect(url).toContain("end=2025-01-31");
  });

  it("all filters combined", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses({
      start: "2025-03-01",
      end: "2025-03-31",
      category_id: 2,
      transaction_type: "income",
      page: 2,
      page_size: 10,
    });
    const url = capturedUrl();
    expect(url).toContain("start=2025-03-01");
    expect(url).toContain("end=2025-03-31");
    expect(url).toContain("category_id=2");
    expect(url).toContain("transaction_type=income");
    expect(url).toContain("page=2");
    expect(url).toContain("page_size=10");
  });
});

// ─── getSummary — transaction_type filter ────────────────────────────────────

describe("getSummary — transaction_type filter", () => {
  it("no transaction_type → only start and end", async () => {
    mockFetch(200, []);
    await getSummary("2025-03-01", "2025-03-31");
    const url = capturedUrl();
    expect(url).toContain("start=2025-03-01");
    expect(url).toContain("end=2025-03-31");
    expect(url).not.toContain("transaction_type");
  });

  it("transaction_type=outcome appended", async () => {
    mockFetch(200, []);
    await getSummary("2025-03-01", "2025-03-31", "outcome");
    expect(capturedUrl()).toContain("transaction_type=outcome");
  });

  it("transaction_type=income appended", async () => {
    mockFetch(200, []);
    await getSummary("2025-03-01", "2025-03-31", "income");
    expect(capturedUrl()).toContain("transaction_type=income");
  });
});

// ─── HTTP method verification ─────────────────────────────────────────────────

describe("HTTP methods", () => {
  it("createExpense sends POST", async () => {
    mockFetch(201, {});
    await createExpense({
      amount: 100,
      date: "2025-03-01",
      entry_type: "texto",
      transaction_type: "outcome",
    });
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.method).toBe("POST");
  });

  it("updateExpense sends PUT", async () => {
    mockFetch(200, {});
    await updateExpense("abc-123", {});
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.method).toBe("PUT");
  });

  it("deleteExpense sends DELETE", async () => {
    mockFetch(204);
    await deleteExpense("abc-123");
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.method).toBe("DELETE");
  });

  it("JWT is sent in Authorization header", async () => {
    mockFetch(200, { items: [], total: 0, page: 1, page_size: 20 });
    await getExpenses();
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer test-jwt");
  });
});
