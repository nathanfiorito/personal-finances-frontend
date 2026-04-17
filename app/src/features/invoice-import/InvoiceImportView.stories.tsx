import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InvoiceImportView } from "./InvoiceImportView";
import {
  FIXTURE_CATEGORIES,
  FIXTURE_CARD_OPTIONS,
  FIXTURE_CARD_DETECTED,
  FIXTURE_CARD_NOT_DETECTED,
  FIXTURE_ROWS_NORMAL,
  FIXTURE_ROWS_WITH_DUPLICATES,
} from "./invoice-preview-fixtures";
import type { InvoicePreviewItem } from "./types";
import type { InvoicePreviewTableRow } from "./InvoicePreviewTable";

function toPreviewRows(items: InvoicePreviewItem[]): InvoicePreviewTableRow[] {
  return items.map((i) => ({
    ...i,
    included: !i.is_possible_duplicate,
    selected_category_id: i.suggested_category_id,
  }));
}

const meta: Meta<typeof InvoiceImportView> = {
  title: "Features/InvoiceImport/InvoiceImportPage",
  component: InvoiceImportView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    categories: FIXTURE_CATEGORIES,
    cardOptions: FIXTURE_CARD_OPTIONS,
    dispatch: fn(),
    onUploadFile: fn(),
    onSubmitImport: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoiceImportView>;

/**
 * Initial state — dropzone ready to receive a PDF.
 */
export const Idle: Story = {
  args: {
    state: { kind: "idle" },
  },
};

/**
 * File selected, waiting for the AI to finish extracting items.
 * The dropzone shows its spinner and a cancel button.
 */
export const Uploading: Story = {
  args: {
    state: { kind: "uploading", fileName: "fatura.pdf" },
  },
};

/**
 * Preview with a detected card — the card identity line is shown read-only.
 * All rows are clean and categorised; the import button is enabled.
 */
export const PreviewWithCardDetected: Story = {
  args: {
    state: {
      kind: "preview",
      fileName: "fatura.pdf",
      detectedCard: FIXTURE_CARD_DETECTED,
      selectedCardId: FIXTURE_CARD_DETECTED.matched_card_id,
      rows: toPreviewRows(
        FIXTURE_ROWS_NORMAL.map((r) => ({
          ...r,
          is_possible_duplicate: false,
          duplicate_of_transaction_id: null,
        })),
      ),
    },
  },
};

/**
 * Preview showing rows that include possible duplicates.
 * Duplicate rows start unchecked and dimmed; user can toggle them back in.
 */
export const PreviewWithDuplicates: Story = {
  args: {
    state: {
      kind: "preview",
      fileName: "fatura-duplicatas.pdf",
      detectedCard: FIXTURE_CARD_DETECTED,
      selectedCardId: FIXTURE_CARD_DETECTED.matched_card_id,
      rows: FIXTURE_ROWS_WITH_DUPLICATES,
    },
  },
};

/**
 * Preview where the card could not be identified.
 * Shows the card picker select; the import button is disabled until the user picks a card.
 */
export const PreviewCardNotDetected: Story = {
  args: {
    state: {
      kind: "preview",
      fileName: "fatura-sem-cartao.pdf",
      detectedCard: FIXTURE_CARD_NOT_DETECTED,
      selectedCardId: null,
      rows: toPreviewRows(
        FIXTURE_ROWS_NORMAL.map((r) => ({
          ...r,
          is_possible_duplicate: false,
          duplicate_of_transaction_id: null,
        })),
      ),
    },
  },
};

/**
 * Import in progress — saving to the backend.
 */
export const Importing: Story = {
  args: {
    state: { kind: "importing" },
  },
};

/**
 * Import completed successfully with 52 transactions persisted.
 */
export const Done: Story = {
  args: {
    state: { kind: "done", importedCount: 52 },
  },
};

/**
 * Error state after a failed analysis — shows the destructive alert above the dropzone,
 * which allows the user to retry by selecting another file.
 */
export const Error: Story = {
  args: {
    state: {
      kind: "error",
      message: "OpenRouter está fora do ar. Tente novamente.",
    },
  },
};
