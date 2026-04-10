"use client";

import { useState } from "react";
import { MonthlyItem } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getCategoryColor } from "@/lib/chart-colors";

interface MonthlySummaryTableProps {
  data: MonthlyItem[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MonthlySummaryTable({ data }: MonthlySummaryTableProps) {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <Card>
        <p className="text-sm text-neutral-400 dark:text-dark-muted text-center py-8">
          No data to display
        </p>
      </Card>
    );
  }

  const toggle = (month: number) => {
    setExpandedMonth((prev) => (prev === month ? null : month));
  };

  return (
    <Card padding={false}>
      <div className="p-4 border-b border-neutral-200 dark:border-dark-border">
        <h3 className="font-semibold text-neutral-900 dark:text-dark-primary">Breakdown by Month</h3>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-dark-border">
        {data.map((item) => {
          const isExpanded = expandedMonth === item.month;
          return (
            <div key={item.month}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 dark:hover:bg-dark-surface2 transition-colors text-left"
                onClick={() => toggle(item.month)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-neutral-400" />
                  ) : (
                    <ChevronRight size={16} className="text-neutral-400" />
                  )}
                  <span className="text-sm font-medium text-neutral-900 dark:text-dark-primary">
                    {MONTH_NAMES[item.month - 1]}
                  </span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-dark-primary">
                  {formatCurrency(item.total)}
                </span>
              </button>

              {isExpanded && item.by_category.length > 0 && (
                <div className="bg-neutral-50 dark:bg-dark-surface2 px-4 pb-3">
                  <table className="w-full text-sm mt-1">
                    <tbody>
                      {item.by_category
                        .slice()
                        .sort((a, b) => parseFloat(b.total) - parseFloat(a.total))
                        .map((cat) => (
                          <tr key={cat.category} className="border-t border-neutral-100 dark:border-dark-border">
                            <td className="py-2 pl-6">
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: getCategoryColor(cat.category) }}
                                />
                                <span className="text-neutral-600 dark:text-dark-secondary">
                                  {cat.category}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 pr-2 text-right font-bold text-neutral-700 dark:text-dark-primary">
                              {formatCurrency(cat.total)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Year total */}
      <div className="p-4 border-t border-neutral-200 dark:border-dark-border flex justify-between items-center bg-neutral-50 dark:bg-dark-surface2 rounded-b-xl">
        <span className="text-sm font-semibold text-neutral-700 dark:text-dark-secondary">Year total</span>
        <span className="text-base font-bold text-neutral-900 dark:text-dark-primary">
          {formatCurrency(
            data.reduce((sum, item) => sum + parseFloat(item.total), 0)
          )}
        </span>
      </div>
    </Card>
  );
}
