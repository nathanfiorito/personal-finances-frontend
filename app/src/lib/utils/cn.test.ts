import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("dedupes tailwind classes, keeping the latter", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    const enabled = false as boolean;
    expect(cn("a", enabled && "b", undefined, null, "c")).toBe("a c");
  });
});
