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
  cards: {
    all: ["cards"] as const,
    list: ["cards", "list"] as const,
    byId: (id: number) => ["cards", "byId", id] as const,
    invoiceCurrent: (id: number) => ["cards", "invoice", "current", id] as const,
    invoiceByMonth: (id: number, year: number, month: number) => ["cards", "invoice", year, month, id] as const,
    invoiceTimeline: (id: number) => ["cards", "invoice", "timeline", id] as const,
    invoicePrediction: (id: number) => ["cards", "invoice", "prediction", id] as const,
  },
} as const;
