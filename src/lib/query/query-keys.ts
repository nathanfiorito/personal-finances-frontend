export const queryKeys = {
  transactions: {
    all: ["transactions"] as const,
    list: (page: number, pageSize: number) =>
      ["transactions", "list", { page, pageSize }] as const,
    recent: (limit: number) => ["transactions", "recent", { limit }] as const,
    byId: (id: string) => ["transactions", "byId", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: ["categories", "list"] as const,
  },
  reports: {
    summary: (start: string, end: string) =>
      ["reports", "summary", { start, end }] as const,
    monthly: (year: number) => ["reports", "monthly", { year }] as const,
  },
  bff: {
    transactions: (page: number, pageSize: number) =>
      ["bff", "transactions", { page, pageSize }] as const,
  },
} as const;
