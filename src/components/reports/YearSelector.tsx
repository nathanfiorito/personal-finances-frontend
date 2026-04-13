"use client";

import { useRouter, usePathname } from "next/navigation";

export function YearSelector({ currentYear }: { currentYear: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  return (
    <select
      value={currentYear}
      onChange={e => router.push(`${pathname}?year=${e.target.value}`)}
      className="rounded-md border border-neutral-200 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {years.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  );
}
