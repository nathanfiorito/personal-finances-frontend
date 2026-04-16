import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { AuthContext, type AuthState } from "@/lib/auth/auth-context-value";
import { createApiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";

function makeAuth(overrides: Partial<AuthState> = {}): AuthState {
  return {
    isAuthenticated: false,
    isInitializing: false,
    login: async () => {},
    logout: () => {},
    apiClient: createApiClient({ baseUrl: "http://localhost", getToken: () => null }),
    ...overrides,
  };
}

function MockAuth({ value, children }: { value: AuthState; children: ReactNode }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function StoryShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-background text-foreground flex min-h-screen w-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Personal Finances</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}

const meta: Meta<typeof LoginForm> = {
  title: "Features/Auth/LoginForm",
  component: LoginForm,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Empty: Story = {
  render: () => (
    <MockAuth value={makeAuth()}>
      <StoryShell>
        <LoginForm />
      </StoryShell>
    </MockAuth>
  ),
};

export const Submitting: Story = {
  render: () => (
    <MockAuth
      value={makeAuth({
        login: () => new Promise(() => {}),
      })}
    >
      <StoryShell>
        <LoginForm />
      </StoryShell>
    </MockAuth>
  ),
  parameters: {
    docs: {
      description: {
        story: "Click **Sign in** after filling valid credentials to see the loading state.",
      },
    },
  },
};

export const InvalidCredentials: Story = {
  render: () => (
    <MockAuth
      value={makeAuth({
        login: async () => {
          throw new ApiError({
            status: 401,
            message: "Invalid email or password.",
          });
        },
      })}
    >
      <StoryShell>
        <LoginForm />
      </StoryShell>
    </MockAuth>
  ),
  parameters: {
    docs: {
      description: {
        story: "Submit with any credentials to see the 401 path.",
      },
    },
  },
};

export const NetworkError: Story = {
  render: () => (
    <MockAuth
      value={makeAuth({
        login: async () => {
          throw new Error("Failed to fetch");
        },
      })}
    >
      <StoryShell>
        <LoginForm />
      </StoryShell>
    </MockAuth>
  ),
};
