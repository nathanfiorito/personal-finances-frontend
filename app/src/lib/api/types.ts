export type TransactionType = "expense" | "income";
export type PaymentMethod = "credit" | "debit";
export type EntryType = "manual" | "image" | "text" | "pdf";

export interface TransactionResponse {
  id: string;
  amount: string;
  date: string;
  establishment: string | null;
  description: string | null;
  category_id: number;
  category: string;
  tax_id: string | null;
  entry_type: EntryType;
  transaction_type: TransactionType;
  payment_method: PaymentMethod;
  confidence: number;
  created_at: string;
}

export interface TransactionCreateRequest {
  amount: string;
  category_id: number;
  payment_method: PaymentMethod;
  date?: string;
  transaction_type?: TransactionType;
  entry_type?: EntryType;
  establishment?: string;
  description?: string;
  tax_id?: string;
}

export type TransactionUpdateRequest = Partial<TransactionCreateRequest>;

export interface CategoryResponse {
  id: number;
  name: string;
  is_active: boolean;
}

export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  is_active?: boolean;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface PageParams {
  page?: number;
  page_size?: number;
}

export interface SummaryEntry {
  category: string;
  total: string;
  count: number;
}

export interface MonthlyReportEntry {
  month: number;
  total: string;
  by_category: Array<{ category: string; total: string }>;
}

export interface DateRangeParams {
  start: string;
  end: string;
}

export interface BffTransactionsResponse {
  transactions: PageResponse<TransactionResponse>;
  categories: CategoryResponse[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_in: number;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly details: unknown;

  constructor(args: {
    status: number;
    message: string;
    code?: string | null;
    details?: unknown;
  }) {
    super(args.message);
    this.name = "ApiError";
    this.status = args.status;
    this.code = args.code ?? null;
    this.details = args.details ?? null;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}
