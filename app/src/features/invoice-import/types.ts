export type InvoiceDropzoneStatus = "idle" | "uploading" | "error";

export interface InvoicePreviewItem {
  temp_id: string;
  date: string; // ISO
  establishment: string;
  description: string | null;
  amount: string; // decimal string, e.g. "112.20"
  transaction_type: "EXPENSE";
  payment_method: "CREDIT";
  suggested_category_id: number | null;
  suggested_category_name: string | null;
  issuer_hint: string | null;
  is_international: boolean;
  original_currency: string | null;
  original_amount: string | null;
  is_possible_duplicate: boolean;
  duplicate_of_transaction_id: string | null;
  confidence: number | null;
}

export interface InvoicePreviewDetectedCard {
  last_four_digits: string | null;
  matched_card_id: number | null;
  matched_card_alias: string | null;
  matched_card_bank: string | null;
}

export interface InvoicePreviewCategoryOption {
  id: number;
  name: string;
}

export interface InvoicePreviewCardOption {
  id: number;
  alias: string;
  bank: string;
  last_four_digits: string;
}

export interface InvoiceImportPreviewResponse {
  source_file_name: string;
  detected_card: InvoicePreviewDetectedCard;
  items: InvoicePreviewItem[];
}

export interface InvoiceImportCommitItem {
  date: string;
  establishment: string;
  description: string | null;
  amount: string;
  category_id: number;
}

export interface InvoiceImportCommitRequest {
  card_id: number;
  items: InvoiceImportCommitItem[];
}

export interface InvoiceImportCommitResponse {
  imported_count: number;
  card_id: number;
  transaction_ids: string[];
}
