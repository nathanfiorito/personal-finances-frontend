"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Tag,
  LogOut,
  Wallet,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Despesas", icon: CreditCard },
  { href: "/reports", label: "Relatórios", icon: BarChart3 },
  { href: "/categories", label: "Categorias", icon: Tag },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast("Erro ao sair. Tente novamente.", "error");
      return;
    }
    router.push("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white dark:bg-dark-surface border-r border-neutral-200 dark:border-dark-border">
        <div className="p-6 border-b border-neutral-200 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <Wallet className="text-brand-500" size={24} />
            <span className="text-lg font-bold text-neutral-900 dark:text-dark-primary">
              Finanças
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 dark:text-dark-secondary dark:hover:text-dark-primary dark:hover:bg-dark-surface2"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-dark-border flex items-center justify-between">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-danger dark:text-dark-muted dark:hover:text-danger-dark transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-dark-surface border-b border-neutral-200 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <Wallet className="text-brand-500" size={20} />
          <span className="font-bold text-neutral-900 dark:text-dark-primary">Finanças</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-2 text-neutral-500 hover:text-danger dark:text-dark-muted dark:hover:text-danger-dark transition-colors"
            aria-label="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-dark-border flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                active
                  ? "text-brand-500 dark:text-brand-400"
                  : "text-neutral-400 hover:text-neutral-600 dark:text-dark-muted dark:hover:text-dark-secondary"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
