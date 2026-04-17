import type {
  InvoicePreviewCategoryOption,
  InvoicePreviewCardOption,
  InvoicePreviewDetectedCard,
} from "./types";
import type { InvoicePreviewTableRow } from "./InvoicePreviewTable";

export const FIXTURE_CATEGORIES: InvoicePreviewCategoryOption[] = [
  { id: 1, name: "Alimentação" },
  { id: 2, name: "Transporte" },
  { id: 3, name: "Lazer" },
  { id: 4, name: "Saúde" },
  { id: 5, name: "Mercado" },
];

export const FIXTURE_CARD_OPTIONS: InvoicePreviewCardOption[] = [
  { id: 10, alias: "Nubank", bank: "Nubank", last_four_digits: "1234" },
  { id: 11, alias: "Inter Gold", bank: "Banco Inter", last_four_digits: "5678" },
  { id: 12, alias: "XP Visa", bank: "XP Investimentos", last_four_digits: "9012" },
];

export const FIXTURE_CARD_DETECTED: InvoicePreviewDetectedCard = {
  last_four_digits: "1234",
  matched_card_id: 10,
  matched_card_alias: "Nubank",
  matched_card_bank: "Nubank",
};

export const FIXTURE_CARD_NOT_DETECTED: InvoicePreviewDetectedCard = {
  last_four_digits: null,
  matched_card_id: null,
  matched_card_alias: null,
  matched_card_bank: null,
};

export const FIXTURE_ROWS_NORMAL: InvoicePreviewTableRow[] = [
  {
    temp_id: "t1",
    date: "2026-03-15",
    establishment: "iFood",
    description: "Pizza de domingo",
    amount: "62.30",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 1,
    suggested_category_name: "Alimentação",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.97,
    included: true,
    selected_category_id: 1,
  },
  {
    temp_id: "t2",
    date: "2026-03-16",
    establishment: "99 Táxi",
    description: null,
    amount: "28.50",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 2,
    suggested_category_name: "Transporte",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.92,
    included: true,
    selected_category_id: 2,
  },
  {
    temp_id: "t3",
    date: "2026-03-17",
    establishment: "Netflix",
    description: "Assinatura mensal",
    amount: "55.90",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 3,
    suggested_category_name: "Lazer",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.99,
    included: true,
    selected_category_id: 3,
  },
  {
    temp_id: "t4",
    date: "2026-03-18",
    establishment: "Pão de Açúcar",
    description: null,
    amount: "189.45",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 5,
    suggested_category_name: "Mercado",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.95,
    included: true,
    selected_category_id: 5,
  },
];

export const FIXTURE_ROWS_WITH_DUPLICATES: InvoicePreviewTableRow[] = [
  {
    ...FIXTURE_ROWS_NORMAL[0],
    temp_id: "d1",
  },
  {
    temp_id: "d2",
    date: "2026-03-12",
    establishment: "iFood",
    description: "Jantar repetido",
    amount: "45.00",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 1,
    suggested_category_name: "Alimentação",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: true,
    duplicate_of_transaction_id: "abc-123",
    confidence: 0.85,
    included: true, // user kept it
    selected_category_id: 1,
  },
  {
    ...FIXTURE_ROWS_NORMAL[1],
    temp_id: "d3",
  },
  {
    temp_id: "d4",
    date: "2026-03-10",
    establishment: "Uber",
    description: null,
    amount: "22.00",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 2,
    suggested_category_name: "Transporte",
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: true,
    duplicate_of_transaction_id: "def-456",
    confidence: 0.78,
    included: false, // user unchecked it (dimmed)
    selected_category_id: 2,
  },
];

export const FIXTURE_ROWS_UNCATEGORIZED: InvoicePreviewTableRow[] = [
  {
    ...FIXTURE_ROWS_NORMAL[0],
    temp_id: "u1",
  },
  {
    temp_id: "u2",
    date: "2026-03-20",
    establishment: "Loja Desconhecida",
    description: "Compra sem categoria",
    amount: "99.99",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: null,
    suggested_category_name: null,
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.60,
    included: true,
    selected_category_id: null,
  },
  {
    ...FIXTURE_ROWS_NORMAL[2],
    temp_id: "u3",
  },
];

export const FIXTURE_ROWS_INTERNATIONAL: InvoicePreviewTableRow[] = [
  {
    ...FIXTURE_ROWS_NORMAL[0],
    temp_id: "i1",
  },
  {
    temp_id: "i2",
    date: "2026-03-21",
    establishment: "Amazon US",
    description: "Kindle book",
    amount: "112.20",
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: 3,
    suggested_category_name: "Lazer",
    issuer_hint: null,
    is_international: true,
    original_currency: "USD",
    original_amount: "20.00",
    is_possible_duplicate: false,
    duplicate_of_transaction_id: null,
    confidence: 0.93,
    included: true,
    selected_category_id: 3,
  },
  {
    ...FIXTURE_ROWS_NORMAL[1],
    temp_id: "i3",
  },
];

function makeRow(index: number): InvoicePreviewTableRow {
  return {
    temp_id: `large-${index}`,
    date: `2026-03-${String((index % 28) + 1).padStart(2, "0")}`,
    establishment: `Estabelecimento ${index + 1}`,
    description: index % 3 === 0 ? `Descrição da compra ${index + 1}` : null,
    amount: ((index + 1) * 15.5).toFixed(2),
    transaction_type: "EXPENSE",
    payment_method: "CREDIT",
    suggested_category_id: FIXTURE_CATEGORIES[index % FIXTURE_CATEGORIES.length].id,
    suggested_category_name: FIXTURE_CATEGORIES[index % FIXTURE_CATEGORIES.length].name,
    issuer_hint: null,
    is_international: false,
    original_currency: null,
    original_amount: null,
    is_possible_duplicate: index % 10 === 0,
    duplicate_of_transaction_id: index % 10 === 0 ? `dup-${index}` : null,
    confidence: 0.8 + (index % 5) * 0.04,
    included: index % 10 !== 0,
    selected_category_id: FIXTURE_CATEGORIES[index % FIXTURE_CATEGORIES.length].id,
  };
}

export const FIXTURE_ROWS_LARGE: InvoicePreviewTableRow[] = Array.from(
  { length: 80 },
  (_, i) => makeRow(i)
);
