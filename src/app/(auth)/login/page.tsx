"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 mb-4">
            <span className="text-white font-bold text-lg">₿</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-dark-primary">Personal Finances</h1>
          <p className="text-sm text-neutral-500 dark:text-dark-muted mt-1">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface rounded-xl border border-neutral-200 dark:border-dark-border shadow p-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
        </form>
      </div>
    </div>
  );
}
