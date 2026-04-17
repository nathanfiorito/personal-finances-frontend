import { describe, expect, it, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Radix UI Select requires pointer / scroll APIs that jsdom does not implement.
beforeAll(() => {
  if (!window.HTMLElement.prototype.hasPointerCapture) {
    window.HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (!window.HTMLElement.prototype.releasePointerCapture) {
    window.HTMLElement.prototype.releasePointerCapture = () => undefined;
  }
  if (!window.HTMLElement.prototype.setPointerCapture) {
    window.HTMLElement.prototype.setPointerCapture = () => undefined;
  }
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = () => undefined;
  }
});
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
} from "./invoice-preview-fixtures";
import type { InvoicePreviewTableRow } from "./InvoicePreviewTable";

function makeRow(overrides: Partial<InvoicePreviewTableRow> = {}): InvoicePreviewTableRow {
  return {
    temp_id: "r1",
    date: "2026-03-15",
    establishment: "Loja Teste",
    description: "Compra de teste",
    amount: "100.00",
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
    confidence: 0.95,
    included: true,
    selected_category_id: 1,
    ...overrides,
  };
}

function defaultProps() {
  return {
    rows: FIXTURE_ROWS_NORMAL,
    categories: FIXTURE_CATEGORIES,
    detectedCard: FIXTURE_CARD_DETECTED,
    cardOptions: FIXTURE_CARD_OPTIONS,
    selectedCardId: 10 as number | null,
    onToggleInclude: vi.fn(),
    onChangeCategory: vi.fn(),
    onChangeCard: vi.fn(),
  };
}

describe("InvoicePreviewTable", () => {
  describe("renders all rows", () => {
    it("renders one row per item in rows", () => {
      render(<InvoicePreviewTable {...defaultProps()} />);
      // Each row has a checkbox with aria-label containing the establishment name
      for (const row of FIXTURE_ROWS_NORMAL) {
        expect(
          screen.getByRole("checkbox", { name: new RegExp(row.establishment, "i") })
        ).toBeInTheDocument();
      }
    });

    it("renders an empty-state message when rows is empty", () => {
      render(<InvoicePreviewTable {...defaultProps()} rows={[]} />);
      expect(screen.getByText(/nenhum lançamento encontrado/i)).toBeInTheDocument();
    });

    it("renders null description as em dash", () => {
      const row = makeRow({ description: null });
      render(<InvoicePreviewTable {...defaultProps()} rows={[row]} />);
      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("checkbox interactions", () => {
    it("calls onToggleInclude with the correct temp_id when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleInclude = vi.fn();
      render(
        <InvoicePreviewTable
          {...defaultProps()}
          rows={FIXTURE_ROWS_NORMAL}
          onToggleInclude={onToggleInclude}
        />
      );

      const firstRow = FIXTURE_ROWS_NORMAL[0];
      const checkbox = screen.getByRole("checkbox", {
        name: new RegExp(firstRow.establishment, "i"),
      });
      await user.click(checkbox);

      expect(onToggleInclude).toHaveBeenCalledWith(firstRow.temp_id);
    });

    it("calls onToggleInclude with the second row's temp_id when its checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleInclude = vi.fn();
      render(
        <InvoicePreviewTable
          {...defaultProps()}
          rows={FIXTURE_ROWS_NORMAL}
          onToggleInclude={onToggleInclude}
        />
      );

      const secondRow = FIXTURE_ROWS_NORMAL[1];
      const checkbox = screen.getByRole("checkbox", {
        name: new RegExp(secondRow.establishment, "i"),
      });
      await user.click(checkbox);

      expect(onToggleInclude).toHaveBeenCalledWith(secondRow.temp_id);
    });
  });

  describe("category select interactions", () => {
    it("calls onChangeCategory with (tempId, categoryId) when a category is picked", async () => {
      const user = userEvent.setup();
      const onChangeCategory = vi.fn();
      const row = makeRow({ temp_id: "row-cat-test", selected_category_id: 1 });

      render(
        <InvoicePreviewTable
          {...defaultProps()}
          rows={[row]}
          onChangeCategory={onChangeCategory}
        />
      );

      // Open the category select for this row
      const trigger = screen.getByTestId("category-select-row-cat-test");
      await user.click(trigger);

      // Pick "Transporte" (id=2)
      const option = await screen.findByRole("option", { name: /transporte/i });
      await user.click(option);

      expect(onChangeCategory).toHaveBeenCalledWith("row-cat-test", 2);
    });
  });

  describe("badge rendering", () => {
    it("renders the duplicate badge when is_possible_duplicate is true", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      // There are 2 duplicate rows in FIXTURE_ROWS_WITH_DUPLICATES — check by data-testid
      expect(screen.getByTestId("badge-duplicate-d2")).toBeInTheDocument();
      expect(screen.getByTestId("badge-duplicate-d4")).toBeInTheDocument();
    });

    it("renders the international badge with currency and amount", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_INTERNATIONAL} />
      );
      const badge = screen.getByTestId("badge-international-i2");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent(/USD/);
      expect(badge).toHaveTextContent(/20,00/);
    });

    it("renders the 'sem categoria' badge when selected_category_id is null", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_UNCATEGORIZED} />
      );
      // Use the data-testid badge for the uncategorized row (u2)
      expect(screen.getByTestId("badge-no-category-u2")).toBeInTheDocument();
    });

    it("does not render duplicate badges for non-duplicate rows", () => {
      render(<InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_NORMAL} />);
      // No row in FIXTURE_ROWS_NORMAL is a duplicate
      expect(screen.queryByTestId(/badge-duplicate-/)).toBeNull();
    });

    it("does not render international badges for domestic rows", () => {
      render(<InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_NORMAL} />);
      expect(screen.queryByTestId(/badge-international-/)).toBeNull();
    });
  });

  describe("KPI line", () => {
    it("shows correct count of lançamentos", () => {
      render(<InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_NORMAL} />);
      const kpi = screen.getByTestId("kpi-line");
      expect(kpi).toHaveTextContent(`${FIXTURE_ROWS_NORMAL.length} lançamentos`);
    });

    it("shows correct duplicate count", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      const kpi = screen.getByTestId("kpi-line");
      expect(kpi).toHaveTextContent("2 duplicatas");
    });

    it("shows total of only included rows in BRL", () => {
      // FIXTURE_ROWS_NORMAL has 4 rows all included: 62.30 + 28.50 + 55.90 + 189.45 = 336.15
      render(<InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_NORMAL} />);
      const kpi = screen.getByTestId("kpi-line");
      // formatMoney(336.15) → "R$ 336,15"
      expect(kpi).toHaveTextContent("R$");
      expect(kpi).toHaveTextContent("336,15");
    });

    it("excludes unchecked rows from the total", () => {
      // FIXTURE_ROWS_WITH_DUPLICATES: d1=62.30(in), d2=45.00(in), d3=28.50(in), d4=22.00(out)
      // Included total: 62.30 + 45.00 + 28.50 = 135.80
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      const kpi = screen.getByTestId("kpi-line");
      expect(kpi).toHaveTextContent("135,80");
    });
  });

  describe("footer", () => {
    it("shows included count / total count", () => {
      render(<InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_NORMAL} />);
      const footer = screen.getByTestId("footer-count");
      expect(footer).toHaveTextContent("4 de 4 selecionados para importar");
    });

    it("reflects unchecked rows in the footer count", () => {
      // d4 is not included
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      const footer = screen.getByTestId("footer-count");
      expect(footer).toHaveTextContent("3 de 4 selecionados para importar");
    });
  });

  describe("card detection", () => {
    it("shows read-only card info when detectedCard has a matched_card_id", () => {
      render(<InvoicePreviewTable {...defaultProps()} />);
      // The header span containing "Fatura do cartão" also has the alias, bank, and last four
      const headerSpan = screen.getByText(/fatura do cartão/i, { selector: "span" });
      expect(headerSpan).toBeInTheDocument();
      expect(headerSpan).toHaveTextContent("****1234");
    });

    it("shows the card picker when detectedCard has no matched_card_id", () => {
      render(
        <InvoicePreviewTable
          {...defaultProps()}
          detectedCard={FIXTURE_CARD_NOT_DETECTED}
          selectedCardId={null}
        />
      );
      expect(
        screen.getByText(/não identificamos o cartão desta fatura/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId("card-select-trigger")).toBeInTheDocument();
    });

    it("calls onChangeCard with the picked card id when the card select changes", async () => {
      const user = userEvent.setup();
      const onChangeCard = vi.fn();
      render(
        <InvoicePreviewTable
          {...defaultProps()}
          detectedCard={FIXTURE_CARD_NOT_DETECTED}
          selectedCardId={null}
          onChangeCard={onChangeCard}
        />
      );

      const trigger = screen.getByTestId("card-select-trigger");
      await user.click(trigger);

      // Pick the first card option — "Nubank — Nubank ****1234" (id=10)
      const option = await screen.findByRole("option", { name: /nubank.*1234/i });
      await user.click(option);

      expect(onChangeCard).toHaveBeenCalledWith(10);
    });
  });

  describe("row dimming", () => {
    it("applies dimmed styling to rows that are duplicate and not included", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      // d4 is the unchecked duplicate row
      const dimmedRow = screen.getByTestId("row-d4");
      expect(dimmedRow.className).toMatch(/opacity/);
    });

    it("does not dim duplicate rows that are included", () => {
      render(
        <InvoicePreviewTable {...defaultProps()} rows={FIXTURE_ROWS_WITH_DUPLICATES} />
      );
      // d2 is the included duplicate row
      const keptRow = screen.getByTestId("row-d2");
      expect(keptRow.className).not.toMatch(/opacity/);
    });
  });

  describe("date formatting", () => {
    it("formats date as dd/MM/yyyy in pt-BR", () => {
      const row = makeRow({ date: "2026-03-15" });
      render(<InvoicePreviewTable {...defaultProps()} rows={[row]} />);
      expect(screen.getByText("15/03/2026")).toBeInTheDocument();
    });
  });

  describe("money formatting", () => {
    it("formats amount with BRL symbol and pt-BR decimal separator", () => {
      const row = makeRow({ amount: "1234.56", temp_id: "money-test" });
      render(<InvoicePreviewTable {...defaultProps()} rows={[row]} />);
      const tableRow = screen.getByTestId("row-money-test");
      // The amount cell renders as font-mono; check that the row has the formatted value
      expect(tableRow).toHaveTextContent("1.234,56");
    });
  });
});
