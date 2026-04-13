"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, BarChart2, Tag } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight,  label: "Transactions" },
  { href: "/reports",      icon: BarChart2,        label: "Reports" },
  { href: "/categories",   icon: Tag,              label: "Categories" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col items-center w-14 shrink-0 border-r border-neutral-200 dark:border-dark-border bg-white dark:bg-dark-surface py-4 gap-2">
      <div className="w-8 h-8 rounded-lg bg-brand-500 mb-4" />
      {NAV.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          title={label}
          className={cn(
            "p-2.5 rounded-md text-neutral-500 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-surface2 hover:text-neutral-900 dark:hover:text-dark-primary transition-colors",
            pathname.startsWith(href) && "bg-brand-50 dark:bg-brand-700/20 text-brand-600 dark:text-brand-400"
          )}
        >
          <Icon size={20} />
        </Link>
      ))}
      <div className="mt-auto"><ThemeToggle /></div>
    </aside>
  );
}
