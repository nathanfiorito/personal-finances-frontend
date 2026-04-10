"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password. Try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-14 w-14 bg-brand-500 rounded-2xl shadow-md mb-4">
            <Wallet className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Personal Finances</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-dark-surface border border-neutral-200 dark:border-dark-border rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="rounded-md bg-danger-bg dark:bg-danger-bg-dark border border-danger/20 dark:border-danger-dark/20 px-3 py-2">
                <p className="text-sm text-danger dark:text-danger-dark">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
