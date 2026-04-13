export interface Transaction {
  id: string;
  amount: string;
  date: string;
  establishment: string | null;
  description: string | null;
  category: string;
  category_id: number | null;
  tax_id: string | null;
  entry_type: string;
  transaction_type: "income" | "expense";
  payment_method: "credit" | "debit";
  confidence: number | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  is_active: boolean;
}

export interface SummaryItem {
  category: string;
  total: string;
}

export interface ReportMonth {
  month: number;
  income_total: string;
  expense_total: string;
  expense_by_category: { category: string; total: string }[];
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
}

export interface BffDashboardResponse {
  expense_summary: SummaryItem[];
  income_summary: SummaryItem[];
  transaction_count: number;
}

export interface BffExpensesResponse {
  transactions: PaginatedTransactions;
  categories: Category[];
}

export interface TransactionFilters {
  start?: string;
  end?: string;
  category_id?: number;
  transaction_type?: "income" | "expense";
  page?: number;
  page_size?: number;
}

export interface TransactionInput {
  amount: number;
  date: string;
  establishment?: string;
  description?: string;
  category_id: number;
  entry_type: string;
  transaction_type: "income" | "expense";
  payment_method: "credit" | "debit";
}
