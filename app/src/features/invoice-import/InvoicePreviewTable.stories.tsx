import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { InvoicePreviewTable } from "./InvoicePreviewTable";
import {
  FIXTURE_CATEGORIES,
  FIXTURE_CARD_OPTIONS,
  FIXTURE_CARD_DETECTED,
  FIXTURE_CARD_NOT_DETECTED,
  FIXTURE_ROWS_NORMAL,
  FIXTURE_ROWS_WITH_DUPLICATES,
  FIXTURE_ROWS_UNCATEGORIZED,
  FIXTURE_ROWS_INTERNATIONAL,
  FIXTURE_ROWS_LARGE,
} from "./invoice-preview-fixtures";

const meta: Meta<typeof InvoicePreviewTable> = {
  title: "Features/InvoiceImport/InvoicePreviewTable",
  component: InvoicePreviewTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    categories: FIXTURE_CATEGORIES,
    cardOptions: FIXTURE_CARD_OPTIONS,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
    onToggleInclude: fn(),
    onChangeCategory: fn(),
    onChangeCard: fn(),
    onChangeDate: fn(),
    onChangeAmount: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof InvoicePreviewTable>;

/**
 * Empty state — no rows extracted from the invoice.
 */
export const Empty: Story = {
  args: {
    rows: [],
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};

/**
 * Normal batch of 4 clean rows, all categorised and included.
 */
export const NormalBatch: Story = {
  args: {
    rows: FIXTURE_ROWS_NORMAL,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};

/**
 * 4 rows, 2 flagged as possible duplicates.
 * One duplicate is included (user kept it); the other is unchecked and dimmed.
 */
export const WithDuplicates: Story = {
  args: {
    rows: FIXTURE_ROWS_WITH_DUPLICATES,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};

/**
 * Includes 1 row where the AI could not suggest a category.
 * Shows the "Sem categoria" destructive badge.
 */
export const WithUncategorizedRows: Story = {
  args: {
    rows: FIXTURE_ROWS_UNCATEGORIZED,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};

/**
 * Includes 1 row where the purchase was made in a foreign currency (USD).
 * Shows the "Internacional USD 20.00" outline badge.
 */
export const WithInternationalRow: Story = {
  args: {
    rows: FIXTURE_ROWS_INTERNATIONAL,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};

/**
 * Card was not detected in the invoice.
 * Shows the card picker select instead of the read-only card info line.
 */
export const CardNotDetected: Story = {
  args: {
    rows: FIXTURE_ROWS_NORMAL,
    detectedCard: FIXTURE_CARD_NOT_DETECTED,
    selectedCardId: null,
  },
};

/**
 * Large batch of 80 generated rows to check table performance and scroll.
 */
export const LargeBatch: Story = {
  args: {
    rows: FIXTURE_ROWS_LARGE,
    detectedCard: FIXTURE_CARD_DETECTED,
    selectedCardId: 10,
  },
};
