export const endpoints = {
  auth: {
    login: "/api/auth/login",
  },
  transactions: {
    list: "/api/v1/transactions",
    byId: (id: string) => `/api/v1/transactions/${id}`,
  },
  categories: {
    list: "/api/v1/categories",
    byId: (id: number) => `/api/v1/categories/${id}`,
  },
  reports: {
    summary: "/api/v1/reports/summary",
    monthly: "/api/v1/reports/monthly",
  },
  export: {
    csv: "/api/v1/export/csv",
  },
  bff: {
    transactions: "/api/v1/bff/transactions",
  },
  cards: {
    list: "/api/v1/cards",
    byId: (id: number) => `/api/v1/cards/${id}`,
    invoiceCurrent: (id: number) => `/api/v1/cards/${id}/invoices/current`,
    invoiceByMonth: (id: number, year: number, month: number) => `/api/v1/cards/${id}/invoices/${year}/${month}`,
    invoiceTimeline: (id: number) => `/api/v1/cards/${id}/invoices/timeline`,
    invoicePrediction: (id: number) => `/api/v1/cards/${id}/invoices/prediction`,
    invoicePredictionRefresh: (id: number) => `/api/v1/cards/${id}/invoices/prediction/refresh`,
  },
  invoiceImport: {
    preview: "/api/v1/invoices/import/preview",
    commit: "/api/v1/invoices/import",
  },
} as const;
