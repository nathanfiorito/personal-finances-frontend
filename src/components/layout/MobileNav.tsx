"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, BarChart2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { href: "/transactions", icon: ArrowLeftRight,  label: "Transactions" },
  { href: "/reports",      icon: BarChart2,        label: "Reports" },
  { href: "/categories",   icon: Tag,              label: "Categories" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-dark-border flex items-center justify-around px-2 h-14">
      {NAV.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex flex-col items-center gap-0.5 p-2 min-w-[44px] min-h-[44px] justify-center rounded-md text-neutral-500 dark:text-dark-muted",
            pathname.startsWith(href) && "text-brand-500 dark:text-brand-400"
          )}
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
