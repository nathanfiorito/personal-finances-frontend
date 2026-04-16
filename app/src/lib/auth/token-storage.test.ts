import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { computeExpiresAt, tokenStorage } from "./token-storage";

describe("tokenStorage", () => {
  beforeEach(() => {
    tokenStorage.clear();
  });

  afterEach(() => {
    tokenStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(tokenStorage.read()).toBeNull();
  });

  it("round-trips a stored token", () => {
    const stored = { token: "abc", expires_at: Date.now() + 10_000 };
    tokenStorage.write(stored);
    expect(tokenStorage.read()).toEqual(stored);
  });

  it("returns null when the stored payload is malformed", () => {
    localStorage.setItem("pf.auth", "not-json");
    expect(tokenStorage.read()).toBeNull();

    localStorage.setItem("pf.auth", JSON.stringify({ token: 123 }));
    expect(tokenStorage.read()).toBeNull();
  });

  it("clears the stored token", () => {
    tokenStorage.write({ token: "abc", expires_at: Date.now() + 10_000 });
    tokenStorage.clear();
    expect(tokenStorage.read()).toBeNull();
  });

  it("treats missing or expired tokens as expired", () => {
    expect(tokenStorage.isExpired(null)).toBe(true);
    expect(
      tokenStorage.isExpired({ token: "x", expires_at: 1_000 }, 2_000)
    ).toBe(true);
    expect(
      tokenStorage.isExpired({ token: "x", expires_at: 5_000 }, 2_000)
    ).toBe(false);
  });
});

describe("computeExpiresAt", () => {
  it("converts seconds to an absolute ms timestamp", () => {
    expect(computeExpiresAt(60, 1_000)).toBe(61_000);
    expect(computeExpiresAt(604_800, 0)).toBe(604_800_000);
  });
});
