import { describe, expect, it } from "vitest";
import { createQueryClient } from "./query-client";
import { ApiError } from "@/lib/api/types";

describe("createQueryClient", () => {
  it("sets sensible defaults", () => {
    const client = createQueryClient();
    const defaults = client.getDefaultOptions().queries!;
    expect(defaults.staleTime).toBe(30_000);
    expect(defaults.refetchOnWindowFocus).toBe(false);
  });

  it("does not retry on 401/403/404/422", () => {
    const client = createQueryClient();
    const retry = client.getDefaultOptions().queries!.retry as (
      failureCount: number,
      error: unknown
    ) => boolean;

    expect(retry(0, new ApiError({ status: 401, message: "nope" }))).toBe(false);
    expect(retry(0, new ApiError({ status: 403, message: "nope" }))).toBe(false);
    expect(retry(0, new ApiError({ status: 404, message: "nope" }))).toBe(false);
    expect(retry(0, new ApiError({ status: 422, message: "nope" }))).toBe(false);
  });

  it("retries once on generic errors", () => {
    const client = createQueryClient();
    const retry = client.getDefaultOptions().queries!.retry as (
      failureCount: number,
      error: unknown
    ) => boolean;

    expect(retry(0, new Error("network"))).toBe(true);
    expect(retry(1, new Error("network"))).toBe(false);
  });
});
