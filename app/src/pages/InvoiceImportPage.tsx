import { useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InvoiceImportView } from "@/features/invoice-import/InvoiceImportView";
import {
  initialState,
  reducer,
} from "@/features/invoice-import/page-state";
import {
  useImportInvoiceMutation,
  usePreviewInvoiceMutation,
} from "@/features/invoice-import/use-invoice-import";
import { useCards } from "@/features/cards/use-cards";
import { useCategories } from "@/features/categories/use-categories";

export function InvoiceImportPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const previewMutation = usePreviewInvoiceMutation();
  const importMutation = useImportInvoiceMutation();
  const cardsQuery = useCards();
  const categoriesQuery = useCategories();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, []);

  const cardOptions = (cardsQuery.data ?? [])
    .filter((c) => c.is_active)
    .map((c) => ({
      id: c.id,
      alias: c.alias,
      bank: c.bank,
      last_four_digits: c.last_four_digits,
    }));

  const categoryOptions = (categoriesQuery.data ?? [])
    .filter((c) => c.is_active)
    .map((c) => ({ id: c.id, name: c.name }));

  const onUploadFile = (file: File) => {
    dispatch({ type: "FILE_SELECTED", file });
    previewMutation.mutate(file, {
      onSuccess: (preview) => {
        dispatch({
          type: "PREVIEW_OK",
          fileName: preview.source_file_name,
          detectedCard: preview.detected_card,
          items: preview.items,
        });
      },
      onError: (err) => {
        dispatch({
          type: "PREVIEW_FAIL",
          message: err.message ?? "Falha ao analisar a fatura",
        });
      },
    });
  };

  const onSubmitImport = () => {
    if (state.kind !== "preview" || state.selectedCardId == null) return;
    const included = state.rows.filter((r) => r.included);
    if (included.length === 0) return;
    dispatch({ type: "IMPORT_START" });
    importMutation.mutate(
      {
        card_id: state.selectedCardId,
        items: included.map((r) => ({
          date: r.date,
          establishment: r.establishment,
          description: r.description ?? null,
          amount: r.amount,
          category_id: r.selected_category_id!,
        })),
      },
      {
        onSuccess: (data) => {
          dispatch({ type: "IMPORT_OK", importedCount: data.imported_count });
          if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = setTimeout(() => navigate("/transactions"), 1500);
        },
        onError: (err) => {
          dispatch({
            type: "IMPORT_FAIL",
            message: err.message ?? "Falha ao importar a fatura",
          });
        },
      },
    );
  };

  if (cardsQuery.isLoading || categoriesQuery.isLoading) {
    return <p className="text-muted-foreground p-6">Carregando...</p>;
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Importar fatura</h1>
      <InvoiceImportView
        state={state}
        categories={categoryOptions}
        cardOptions={cardOptions}
        dispatch={dispatch}
        onUploadFile={onUploadFile}
        onSubmitImport={onSubmitImport}
      />
    </section>
  );
}
