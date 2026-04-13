import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CategoryList } from "@/components/categories/CategoryList";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
const deactivateMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/api/client", () => ({
  deactivateCategory: (...args: unknown[]) => deactivateMock(...args),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
}));

const categories = [
  { id: 1, name: "Alimentação", is_active: true },
  { id: 2, name: "Transporte", is_active: false },
];

describe("CategoryList", () => {
  it("shows deactivate button only for active categories", () => {
    render(<CategoryList categories={categories} />);
    const deactivateButtons = screen.getAllByRole("button", { name: /deactivate/i });
    expect(deactivateButtons).toHaveLength(1);
  });

  it("shows confirmation before deactivating", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const user = userEvent.setup();
    render(<CategoryList categories={categories} />);
    await user.click(screen.getByRole("button", { name: /deactivate/i }));
    expect(confirmSpy).toHaveBeenCalled();
    expect(deactivateMock).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("calls deactivateCategory when confirmed", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const user = userEvent.setup();
    render(<CategoryList categories={categories} />);
    await user.click(screen.getByRole("button", { name: /deactivate/i }));
    expect(deactivateMock).toHaveBeenCalledWith(1);
  });
});
