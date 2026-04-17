import type {
  InvoicePreviewDetectedCard,
  InvoicePreviewItem,
} from "./types";
import type { InvoicePreviewTableRow } from "./InvoicePreviewTable";

export type ImportPageState =
  | { kind: "idle" }
  | { kind: "uploading"; fileName: string }
  | {
      kind: "preview";
      fileName: string;
      detectedCard: InvoicePreviewDetectedCard;
      selectedCardId: number | null;
      rows: InvoicePreviewTableRow[];
    }
  | { kind: "importing" }
  | { kind: "done"; importedCount: number }
  | { kind: "error"; message: string };

export type ImportPageAction =
  | { type: "FILE_SELECTED"; file: File }
  | {
      type: "PREVIEW_OK";
      fileName: string;
      detectedCard: InvoicePreviewDetectedCard;
      items: InvoicePreviewItem[];
    }
  | { type: "PREVIEW_FAIL"; message: string }
  | { type: "TOGGLE_INCLUDE"; tempId: string }
  | { type: "CHANGE_CATEGORY"; tempId: string; categoryId: number }
  | { type: "CHANGE_CARD"; cardId: number }
  | { type: "IMPORT_START" }
  | { type: "IMPORT_OK"; importedCount: number }
  | { type: "IMPORT_FAIL"; message: string }
  | { type: "RESET" };

export const initialState: ImportPageState = { kind: "idle" };

export function reducer(
  state: ImportPageState,
  action: ImportPageAction,
): ImportPageState {
  switch (action.type) {
    case "FILE_SELECTED":
      return { kind: "uploading", fileName: action.file.name };

    case "PREVIEW_OK":
      return {
        kind: "preview",
        fileName: action.fileName,
        detectedCard: action.detectedCard,
        selectedCardId: action.detectedCard.matched_card_id,
        rows: [...action.items]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((i) => ({
            ...i,
            included: !i.is_possible_duplicate,
            selected_category_id: i.suggested_category_id,
          })),
      };

    case "PREVIEW_FAIL":
      return { kind: "error", message: action.message };

    case "TOGGLE_INCLUDE":
      if (state.kind !== "preview") return state;
      return {
        ...state,
        rows: state.rows.map((r) =>
          r.temp_id === action.tempId ? { ...r, included: !r.included } : r,
        ),
      };

    case "CHANGE_CATEGORY":
      if (state.kind !== "preview") return state;
      return {
        ...state,
        rows: state.rows.map((r) =>
          r.temp_id === action.tempId
            ? { ...r, selected_category_id: action.categoryId }
            : r,
        ),
      };

    case "CHANGE_CARD":
      if (state.kind !== "preview") return state;
      return { ...state, selectedCardId: action.cardId };

    case "IMPORT_START":
      return { kind: "importing" };

    case "IMPORT_OK":
      return { kind: "done", importedCount: action.importedCount };

    case "IMPORT_FAIL":
      return { kind: "error", message: action.message };

    case "RESET":
      return { kind: "idle" };

    default: {
      // Exhaustiveness check — TypeScript will error here if a new action type is added
      // without a corresponding case.
      action satisfies never;
      return state;
    }
  }
}

export function canSubmit(state: ImportPageState): boolean {
  if (state.kind !== "preview") return false;
  if (state.selectedCardId == null) return false;
  const included = state.rows.filter((r) => r.included);
  if (included.length === 0) return false;
  return included.every((r) => r.selected_category_id != null);
}

export function includedCount(state: ImportPageState): number {
  if (state.kind !== "preview") return 0;
  return state.rows.filter((r) => r.included).length;
}
