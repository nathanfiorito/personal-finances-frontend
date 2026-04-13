import { describe, it, expect, vi } from "vitest";

// Mock @vercel/otel before importing instrumentation
vi.mock("@vercel/otel", () => ({
  registerOTel: vi.fn(),
}));

describe("instrumentation", () => {
  it("exports a register function", async () => {
    const mod = await import("../instrumentation");
    expect(typeof mod.register).toBe("function");
  });

  it("register calls registerOTel with the correct service name", async () => {
    const { registerOTel } = await import("@vercel/otel");
    const mod = await import("../instrumentation");
    mod.register();
    expect(registerOTel).toHaveBeenCalledWith({
      serviceName: "personal-finances-frontend",
    });
  });
});
