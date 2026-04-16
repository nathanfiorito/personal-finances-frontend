import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthContext, type AuthState } from "@/lib/auth/auth-context-value";
import { createApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import { LoginForm } from "./LoginForm";

function renderLoginForm(auth: Partial<AuthState> = {}) {
  const value: AuthState = {
    isAuthenticated: false,
    isInitializing: false,
    login: vi.fn(async () => {}),
    logout: vi.fn(),
    apiClient: createApiClient({ baseUrl: "http://localhost", getToken: () => null }),
    ...auth,
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </MemoryRouter>
  );

  return { ...render(<LoginForm />, { wrapper }), value };
}

describe("LoginForm", () => {
  it("shows validation errors when submitting empty fields", async () => {
    const user = userEvent.setup();
    const { value } = renderLoginForm();

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(value.login).not.toHaveBeenCalled();
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    const { value } = renderLoginForm();

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(value.login).not.toHaveBeenCalled();
  });

  it("calls login with the submitted credentials on success", async () => {
    const user = userEvent.setup();
    const login = vi.fn(async () => {});
    const { value } = renderLoginForm({ login });

    await user.type(screen.getByLabelText(/email/i), "nathan@example.com");
    await user.type(screen.getByLabelText(/password/i), "hunter2");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(value.login).toHaveBeenCalledWith({
      email: "nathan@example.com",
      password: "hunter2",
    });
  });

  it("surfaces a 401 from the server as a friendly alert", async () => {
    const user = userEvent.setup();
    const login = vi.fn(async () => {
      throw new ApiError({ status: 401, message: "Invalid email or password." });
    });
    renderLoginForm({ login });

    await user.type(screen.getByLabelText(/email/i), "nathan@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/invalid email or password/i);
  });

  it("surfaces a generic error when the network fails", async () => {
    const user = userEvent.setup();
    const login = vi.fn(async () => {
      throw new Error("Failed to fetch");
    });
    renderLoginForm({ login });

    await user.type(screen.getByLabelText(/email/i), "nathan@example.com");
    await user.type(screen.getByLabelText(/password/i), "hunter2");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to fetch/i);
  });
});
