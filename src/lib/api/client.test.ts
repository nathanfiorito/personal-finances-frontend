import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "./client";

function makeResponse(
  body: unknown,
  init: { status?: number; contentType?: string; isBlob?: boolean } = {}
): Response {
  const { status = 200, contentType = "application/json", isBlob = false } = init;
  if (isBlob) {
    return new Response(body as BodyInit, {
      status,
      headers: { "content-type": contentType },
    });
  }
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(payload, {
    status,
    headers: { "content-type": contentType },
  });
}

describe("createApiClient", () => {
  const baseUrl = "https://api.test.local";
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
  });

  it("injects Bearer token when one is provided", async () => {
    fetchMock.mockResolvedValueOnce(makeResponse({ ok: true }));
    const client = createApiClient({
      baseUrl,
      getToken: () => "jwt-123",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.get("/api/v1/transactions");

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer jwt-123");
  });

  it("omits Authorization when no token is available", async () => {
    fetchMock.mockResolvedValueOnce(makeResponse({ ok: true }));
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.get("/api/v1/transactions");

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("serializes JSON bodies and sets Content-Type", async () => {
    fetchMock.mockResolvedValueOnce(makeResponse({ id: "x" }));
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.post("/api/v1/transactions", { amount: "10.00" });

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ amount: "10.00" }));
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("appends query params, skipping null/undefined", async () => {
    fetchMock.mockResolvedValueOnce(makeResponse({ items: [] }));
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await client.get("/api/v1/transactions", {
      query: { page: 1, page_size: 20, category_id: null, since: undefined },
    });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toBe("https://api.test.local/api/v1/transactions?page=1&page_size=20");
  });

  it("calls onUnauthorized and throws ApiError on 401", async () => {
    fetchMock.mockResolvedValueOnce(
      makeResponse({ message: "expired" }, { status: 401 })
    );
    const onUnauthorized = vi.fn();
    const client = createApiClient({
      baseUrl,
      getToken: () => "jwt-123",
      onUnauthorized,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.get("/api/v1/transactions")).rejects.toMatchObject({
      status: 401,
      message: "expired",
    });
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("normalizes non-JSON error bodies into ApiError with the HTTP status", async () => {
    fetchMock.mockResolvedValueOnce(
      makeResponse("boom", { status: 500, contentType: "text/plain" })
    );
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(client.get("/api/v1/transactions")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: "boom",
    });
  });

  it("returns Blob when expect=blob is requested", async () => {
    const csv = "col1,col2\na,b";
    const blob = new Blob([csv], { type: "text/csv" });
    fetchMock.mockResolvedValueOnce(
      new Response(blob, { status: 200, headers: { "content-type": "text/csv" } })
    );
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await client.get<Blob>("/api/v1/export/csv", { expect: "blob" });
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe("text/csv");
    expect(result.size).toBe(csv.length);
  });

  it("returns undefined on 204 responses", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await client.del("/api/v1/transactions/abc");
    expect(result).toBeUndefined();
  });
});
