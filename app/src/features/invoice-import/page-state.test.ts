import { describe, expect, it } from "vitest";
import {
  reducer,
  initialState,
  canSubmit,
  includedCount,
  type ImportPageState,
  type ImportPageAction,
} from "./page-state";
import type {
  InvoicePreviewDetectedCard,
  InvoicePreviewItem,
} from "./types";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const CARD_DETECTED: InvoicePreviewDetectedCard = {
  last_four_digits: "1234",
  matched_card_id: 10,
  matched_card_alias: "Nubank",
  matched_card_bank: "Nubank",
};

const CARD_NOT_DETECTED: InvoicePreviewDetectedCard = {
  last_four_digits: null,
  matched_card_id: null,
  matched_card_alias: null,
  matched_card_bank: null,
};

const ITEM_NORMAL: InvoicePreviewItem = {
  temp_id: "t1",
  date: "2026-03-15",
  establishment: "iFood",
  description: "Pizza",
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
};

const ITEM_DUPLICATE: InvoicePreviewItem = {
  temp_id: "t2",
  date: "2026-03-16",
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
  duplicate_of_transaction_id: "abc-123",
  confidence: 0.78,
};

const ITEM_NO_CATEGORY: InvoicePreviewItem = {
  temp_id: "t3",
  date: "2026-03-17",
  establishment: "Loja X",
  description: null,
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
};

function makePreviewState(overrides?: Partial<Extract<ImportPageState, { kind: "preview" }>>): Extract<ImportPageState, { kind: "preview" }> {
  return {
    kind: "preview",
    fileName: "fatura.pdf",
    detectedCard: CARD_DETECTED,
    selectedCardId: 10,
    rows: [
      {
        ...ITEM_NORMAL,
        included: true,
        selected_category_id: 1,
      },
    ],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// reducer — FILE_SELECTED
// ---------------------------------------------------------------------------

describe("reducer — FILE_SELECTED", () => {
  it("moves idle → uploading with the file name", () => {
    const file = new File(["content"], "fatura.pdf", { type: "application/pdf" });
    const next = reducer(initialState, { type: "FILE_SELECTED", file });
    expect(next).toEqual({ kind: "uploading", fileName: "fatura.pdf" });
  });
});

// ---------------------------------------------------------------------------
// reducer — PREVIEW_OK
// ---------------------------------------------------------------------------

describe("reducer — PREVIEW_OK", () => {
  it("moves uploading → preview", () => {
    const uploading: ImportPageState = { kind: "uploading", fileName: "fatura.pdf" };
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      items: [ITEM_NORMAL],
    };
    const next = reducer(uploading, action);
    expect(next.kind).toBe("preview");
  });

  it("maps items to rows with included=true for non-duplicates", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      items: [ITEM_NORMAL],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].included).toBe(true);
  });

  it("maps items with is_possible_duplicate=true to included=false", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      items: [ITEM_DUPLICATE],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].included).toBe(false);
  });

  it("sets selected_category_id to suggested_category_id", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      items: [ITEM_NORMAL, ITEM_NO_CATEGORY],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].selected_category_id).toBe(1);
    expect(next.rows[1].selected_category_id).toBeNull();
  });

  it("sets selectedCardId from detectedCard.matched_card_id", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      items: [ITEM_NORMAL],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.selectedCardId).toBe(10);
  });

  it("sets selectedCardId to null when card not detected", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_NOT_DETECTED,
      items: [ITEM_NORMAL],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.selectedCardId).toBeNull();
  });

  it("orders rows by date ascending regardless of incoming order", () => {
    const action: ImportPageAction = {
      type: "PREVIEW_OK",
      fileName: "fatura.pdf",
      detectedCard: CARD_DETECTED,
      // Intentionally shuffled: NO_CATEGORY (2026-03-17), NORMAL (2026-03-15), DUPLICATE (2026-03-16)
      items: [ITEM_NO_CATEGORY, ITEM_NORMAL, ITEM_DUPLICATE],
    };
    const next = reducer(initialState, action);
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows.map((r) => r.date)).toEqual([
      "2026-03-15",
      "2026-03-16",
      "2026-03-17",
    ]);
  });
});

// ---------------------------------------------------------------------------
// reducer — PREVIEW_FAIL
// ---------------------------------------------------------------------------

describe("reducer — PREVIEW_FAIL", () => {
  it("transitions to error with the message", () => {
    const uploading: ImportPageState = { kind: "uploading", fileName: "fatura.pdf" };
    const next = reducer(uploading, { type: "PREVIEW_FAIL", message: "Server error" });
    expect(next).toEqual({ kind: "error", message: "Server error" });
  });
});

// ---------------------------------------------------------------------------
// reducer — TOGGLE_INCLUDE
// ---------------------------------------------------------------------------

describe("reducer — TOGGLE_INCLUDE", () => {
  it("flips the targeted row included flag", () => {
    const state = makePreviewState();
    const next = reducer(state, { type: "TOGGLE_INCLUDE", tempId: "t1" });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].included).toBe(false);
  });

  it("only flips the targeted row, leaves others unchanged", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_DUPLICATE, included: false, selected_category_id: 2 },
      ],
    });
    const next = reducer(state, { type: "TOGGLE_INCLUDE", tempId: "t1" });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].included).toBe(false); // flipped
    expect(next.rows[1].included).toBe(false); // unchanged
  });

  it("returns state unchanged when not in preview", () => {
    const state: ImportPageState = { kind: "idle" };
    const next = reducer(state, { type: "TOGGLE_INCLUDE", tempId: "t1" });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// reducer — CHANGE_CATEGORY
// ---------------------------------------------------------------------------

describe("reducer — CHANGE_CATEGORY", () => {
  it("updates the targeted row selected_category_id", () => {
    const state = makePreviewState();
    const next = reducer(state, { type: "CHANGE_CATEGORY", tempId: "t1", categoryId: 5 });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].selected_category_id).toBe(5);
  });

  it("does not modify other rows", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_DUPLICATE, included: true, selected_category_id: 2 },
      ],
    });
    const next = reducer(state, { type: "CHANGE_CATEGORY", tempId: "t1", categoryId: 99 });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows[0].selected_category_id).toBe(99);
    expect(next.rows[1].selected_category_id).toBe(2); // unchanged
  });

  it("returns state unchanged when not in preview", () => {
    const state: ImportPageState = { kind: "importing" };
    const next = reducer(state, { type: "CHANGE_CATEGORY", tempId: "t1", categoryId: 3 });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// reducer — CHANGE_CARD
// ---------------------------------------------------------------------------

describe("reducer — CHANGE_CARD", () => {
  it("updates selectedCardId", () => {
    const state = makePreviewState({ selectedCardId: null });
    const next = reducer(state, { type: "CHANGE_CARD", cardId: 11 });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.selectedCardId).toBe(11);
  });

  it("returns state unchanged when not in preview", () => {
    const state: ImportPageState = { kind: "idle" };
    const next = reducer(state, { type: "CHANGE_CARD", cardId: 11 });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// reducer — IMPORT_START
// ---------------------------------------------------------------------------

describe("reducer — IMPORT_START", () => {
  it("transitions to importing", () => {
    const state = makePreviewState();
    const next = reducer(state, { type: "IMPORT_START" });
    expect(next).toEqual({ kind: "importing" });
  });
});

// ---------------------------------------------------------------------------
// reducer — IMPORT_OK
// ---------------------------------------------------------------------------

describe("reducer — IMPORT_OK", () => {
  it("transitions to done with importedCount", () => {
    const state: ImportPageState = { kind: "importing" };
    const next = reducer(state, { type: "IMPORT_OK", importedCount: 42 });
    expect(next).toEqual({ kind: "done", importedCount: 42 });
  });
});

// ---------------------------------------------------------------------------
// reducer — IMPORT_FAIL
// ---------------------------------------------------------------------------

describe("reducer — IMPORT_FAIL", () => {
  it("transitions to error with message", () => {
    const state: ImportPageState = { kind: "importing" };
    const next = reducer(state, { type: "IMPORT_FAIL", message: "Timeout" });
    expect(next).toEqual({ kind: "error", message: "Timeout" });
  });
});

// ---------------------------------------------------------------------------
// reducer — RESET
// ---------------------------------------------------------------------------

describe("reducer — RESET", () => {
  it("returns idle from uploading", () => {
    const state: ImportPageState = { kind: "uploading", fileName: "fatura.pdf" };
    expect(reducer(state, { type: "RESET" })).toEqual({ kind: "idle" });
  });

  it("returns idle from preview", () => {
    expect(reducer(makePreviewState(), { type: "RESET" })).toEqual({ kind: "idle" });
  });

  it("returns idle from importing", () => {
    const state: ImportPageState = { kind: "importing" };
    expect(reducer(state, { type: "RESET" })).toEqual({ kind: "idle" });
  });

  it("returns idle from done", () => {
    const state: ImportPageState = { kind: "done", importedCount: 10 };
    expect(reducer(state, { type: "RESET" })).toEqual({ kind: "idle" });
  });

  it("returns idle from error", () => {
    const state: ImportPageState = { kind: "error", message: "oops" };
    expect(reducer(state, { type: "RESET" })).toEqual({ kind: "idle" });
  });
});

// ---------------------------------------------------------------------------
// reducer — CHANGE_DATE
// ---------------------------------------------------------------------------

describe("reducer — CHANGE_DATE", () => {
  it("updates the date of the target row only", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_DUPLICATE, included: true, selected_category_id: 2 },
      ],
    });
    const next = reducer(state, { type: "CHANGE_DATE", tempId: "t1", date: "2026-03-20" });
    if (next.kind !== "preview") throw new Error("expected preview");
    const t1 = next.rows.find((r) => r.temp_id === "t1");
    const t2 = next.rows.find((r) => r.temp_id === "t2");
    expect(t1?.date).toBe("2026-03-20");
    expect(t2?.date).toBe("2026-03-16"); // unchanged
  });

  it("re-sorts rows ascending by date after the change", () => {
    // t1=2026-03-15, t2=2026-03-16 initially; change t2 to 2026-03-10 → t2 first
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },   // t1, 2026-03-15
        { ...ITEM_DUPLICATE, included: true, selected_category_id: 2 }, // t2, 2026-03-16
      ],
    });
    const next = reducer(state, { type: "CHANGE_DATE", tempId: "t2", date: "2026-03-10" });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows.map((r) => r.temp_id)).toEqual(["t2", "t1"]);
    expect(next.rows.map((r) => r.date)).toEqual(["2026-03-10", "2026-03-15"]);
  });

  it("returns state unchanged when not in preview", () => {
    const state: ImportPageState = { kind: "idle" };
    const next = reducer(state, { type: "CHANGE_DATE", tempId: "t1", date: "2026-03-20" });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// reducer — CHANGE_AMOUNT
// ---------------------------------------------------------------------------

describe("reducer — CHANGE_AMOUNT", () => {
  it("updates the amount of the target row only", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_DUPLICATE, included: true, selected_category_id: 2 },
      ],
    });
    const next = reducer(state, { type: "CHANGE_AMOUNT", tempId: "t1", amount: "99.99" });
    if (next.kind !== "preview") throw new Error("expected preview");
    const t1 = next.rows.find((r) => r.temp_id === "t1");
    const t2 = next.rows.find((r) => r.temp_id === "t2");
    expect(t1?.amount).toBe("99.99");
    expect(t2?.amount).toBe("22.00"); // unchanged
  });

  it("does not reorder rows after an amount change", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },   // t1, 2026-03-15
        { ...ITEM_DUPLICATE, included: true, selected_category_id: 2 }, // t2, 2026-03-16
      ],
    });
    const next = reducer(state, { type: "CHANGE_AMOUNT", tempId: "t1", amount: "500.00" });
    if (next.kind !== "preview") throw new Error("expected preview");
    expect(next.rows.map((r) => r.temp_id)).toEqual(["t1", "t2"]);
  });

  it("returns state unchanged when not in preview", () => {
    const state: ImportPageState = { kind: "importing" };
    const next = reducer(state, { type: "CHANGE_AMOUNT", tempId: "t1", amount: "50.00" });
    expect(next).toBe(state);
  });
});

// ---------------------------------------------------------------------------
// canSubmit
// ---------------------------------------------------------------------------

describe("canSubmit", () => {
  it("returns false when not in preview state", () => {
    expect(canSubmit({ kind: "idle" })).toBe(false);
    expect(canSubmit({ kind: "uploading", fileName: "f.pdf" })).toBe(false);
    expect(canSubmit({ kind: "importing" })).toBe(false);
    expect(canSubmit({ kind: "done", importedCount: 1 })).toBe(false);
    expect(canSubmit({ kind: "error", message: "x" })).toBe(false);
  });

  it("returns false when selectedCardId is null", () => {
    const state = makePreviewState({ selectedCardId: null });
    expect(canSubmit(state)).toBe(false);
  });

  it("returns false when no row is included", () => {
    const state = makePreviewState({
      rows: [{ ...ITEM_NORMAL, included: false, selected_category_id: 1 }],
    });
    expect(canSubmit(state)).toBe(false);
  });

  it("returns false when an included row has null selected_category_id", () => {
    const state = makePreviewState({
      rows: [{ ...ITEM_NO_CATEGORY, included: true, selected_category_id: null }],
    });
    expect(canSubmit(state)).toBe(false);
  });

  it("returns true for a valid preview state", () => {
    const state = makePreviewState();
    expect(canSubmit(state)).toBe(true);
  });

  it("returns true when all included rows have a category even if some rows are excluded", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_NO_CATEGORY, included: false, selected_category_id: null },
      ],
    });
    expect(canSubmit(state)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// includedCount
// ---------------------------------------------------------------------------

describe("includedCount", () => {
  it("returns 0 when not in preview state", () => {
    expect(includedCount({ kind: "idle" })).toBe(0);
    expect(includedCount({ kind: "importing" })).toBe(0);
    expect(includedCount({ kind: "done", importedCount: 5 })).toBe(0);
  });

  it("returns accurate count in preview", () => {
    const state = makePreviewState({
      rows: [
        { ...ITEM_NORMAL, included: true, selected_category_id: 1 },
        { ...ITEM_DUPLICATE, included: false, selected_category_id: 2 },
        { ...ITEM_NO_CATEGORY, temp_id: "t3x", included: true, selected_category_id: null },
      ],
    });
    expect(includedCount(state)).toBe(2);
  });

  it("returns 0 when all rows are excluded", () => {
    const state = makePreviewState({
      rows: [{ ...ITEM_NORMAL, included: false, selected_category_id: 1 }],
    });
    expect(includedCount(state)).toBe(0);
  });
});
