import { formatMoney, sumAmounts } from "@/lib/format/format-money";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { AmountInput } from "@/features/transactions/AmountInput";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  InvoicePreviewCategoryOption,
  InvoicePreviewCardOption,
  InvoicePreviewDetectedCard,
  InvoicePreviewItem,
} from "./types";

export interface InvoicePreviewTableRow extends InvoicePreviewItem {
  included: boolean;
  selected_category_id: number | null;
}

export interface InvoicePreviewTableProps {
  rows: InvoicePreviewTableRow[];
  categories: InvoicePreviewCategoryOption[];
  detectedCard: InvoicePreviewDetectedCard;
  cardOptions: InvoicePreviewCardOption[];
  selectedCardId: number | null;
  onToggleInclude: (tempId: string) => void;
  onChangeCategory: (tempId: string, categoryId: number) => void;
  onChangeCard: (cardId: number) => void;
  onChangeDate: (tempId: string, date: string) => void;
  onChangeAmount: (tempId: string, amount: string) => void;
}

function formatCardLabel(card: InvoicePreviewCardOption): string {
  return `${card.alias} — ${card.bank} ****${card.last_four_digits}`;
}

function formatInternationalAmount(amount: string): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function InvoicePreviewTable({
  rows,
  categories,
  detectedCard,
  cardOptions,
  selectedCardId,
  onToggleInclude,
  onChangeCategory,
  onChangeCard,
  onChangeDate,
  onChangeAmount,
}: InvoicePreviewTableProps) {
  const includedRows = rows.filter((r) => r.included);
  const duplicateCount = rows.filter((r) => r.is_possible_duplicate).length;
  const includedTotal =
    includedRows.length > 0
      ? sumAmounts(includedRows.map((r) => r.amount))
      : "0.00";

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Card info / picker */}
        <div className="text-sm">
          {detectedCard.matched_card_id !== null ? (
            <span>
              Fatura do cartão{" "}
              <strong>{detectedCard.matched_card_alias}</strong>{" "}
              &mdash; {detectedCard.matched_card_bank}{" "}
              ****{detectedCard.last_four_digits}
            </span>
          ) : (
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-muted-foreground">
                Não identificamos o cartão desta fatura. Selecione:
              </span>
              <Select
                value={selectedCardId !== null ? String(selectedCardId) : ""}
                onValueChange={(val) => onChangeCard(Number(val))}
                required
              >
                <SelectTrigger
                  className="w-fit"
                  aria-label="Selecionar cartão"
                  data-testid="card-select-trigger"
                >
                  <SelectValue placeholder="Selecionar cartão..." />
                </SelectTrigger>
                <SelectContent>
                  {cardOptions.map((card) => (
                    <SelectItem key={card.id} value={String(card.id)}>
                      {formatCardLabel(card)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* KPI line */}
        <div className="text-sm text-muted-foreground" data-testid="kpi-line">
          <span>
            {rows.length} lançamentos &bull; {duplicateCount} duplicatas &bull;{" "}
            total selecionado:{" "}
            <span className="font-medium text-foreground">
              {formatMoney(includedTotal)}
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption className="sr-only">
          Lançamentos extraídos da fatura para revisão antes da importação
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">{/* checkbox col */}</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Estabelecimento</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Flags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isDimmed = row.is_possible_duplicate && !row.included;
              return (
                <TableRow
                  key={row.temp_id}
                  className={
                    isDimmed
                      ? "bg-yellow-50 opacity-60 dark:bg-yellow-950/20"
                      : undefined
                  }
                  data-testid={`row-${row.temp_id}`}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={row.included}
                      onChange={() => onToggleInclude(row.temp_id)}
                      aria-label={`Incluir ${row.establishment}`}
                      className="size-4 rounded border-input accent-primary"
                      data-testid={`checkbox-${row.temp_id}`}
                    />
                  </TableCell>

                  {/* Date */}
                  <TableCell className="whitespace-nowrap">
                    <DatePicker
                      value={row.date}
                      onChange={(next) => onChangeDate(row.temp_id, next)}
                      id={`date-picker-${row.temp_id}`}
                    />
                  </TableCell>

                  {/* Establishment */}
                  <TableCell>{row.establishment}</TableCell>

                  {/* Description */}
                  <TableCell>
                    {row.description !== null && row.description !== ""
                      ? row.description
                      : "\u2014"}
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="text-right">
                    <AmountInput
                      value={row.amount}
                      onChange={(next) => onChangeAmount(row.temp_id, next)}
                      id={`amount-input-${row.temp_id}`}
                      className="w-28 text-right"
                    />
                  </TableCell>

                  {/* Category select */}
                  <TableCell>
                    <Select
                      value={
                        row.selected_category_id !== null
                          ? String(row.selected_category_id)
                          : ""
                      }
                      onValueChange={(val) =>
                        onChangeCategory(row.temp_id, Number(val))
                      }
                    >
                      <SelectTrigger
                        className="w-40"
                        size="sm"
                        aria-label={`Categoria de ${row.establishment}`}
                        data-testid={`category-select-${row.temp_id}`}
                      >
                        <SelectValue placeholder="Sem categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Flags */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {row.is_possible_duplicate && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                          data-testid={`badge-duplicate-${row.temp_id}`}
                        >
                          Duplicata
                        </Badge>
                      )}
                      {row.is_international && (
                        <Badge
                          variant="outline"
                          data-testid={`badge-international-${row.temp_id}`}
                        >
                          Internacional {row.original_currency}{" "}
                          {formatInternationalAmount(row.original_amount || "0")}
                        </Badge>
                      )}
                      {row.selected_category_id === null && (
                        <Badge
                          variant="destructive"
                          data-testid={`badge-no-category-${row.temp_id}`}
                        >
                          Sem categoria
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Footer */}
      <p className="text-sm text-muted-foreground" data-testid="footer-count">
        {includedRows.length} de {rows.length} selecionados para importar.
      </p>
    </div>
  );
}
