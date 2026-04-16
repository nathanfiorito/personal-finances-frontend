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
} as const;
