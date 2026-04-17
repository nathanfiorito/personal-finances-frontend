import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InvoiceDropzone } from "./InvoiceDropzone";
import { InvoicePreviewTable } from "./InvoicePreviewTable";
import {
  canSubmit,
  includedCount,
  type ImportPageAction,
  type ImportPageState,
} from "./page-state";
import type {
  InvoicePreviewCardOption,
  InvoicePreviewCategoryOption,
} from "./types";

export interface InvoiceImportViewProps {
  state: ImportPageState;
  categories: InvoicePreviewCategoryOption[];
  cardOptions: InvoicePreviewCardOption[];
  dispatch: (action: ImportPageAction) => void;
  onUploadFile: (file: File) => void;
  onSubmitImport: () => void;
}

export function InvoiceImportView({
  state,
  categories,
  cardOptions,
  dispatch,
  onUploadFile,
  onSubmitImport,
}: InvoiceImportViewProps) {
  switch (state.kind) {
    case "idle":
    case "error":
    case "uploading":
      return (
        <div className="space-y-4">
          {state.kind === "error" && (
            <Alert variant="destructive">
              <AlertTitle>Falha ao analisar a fatura</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <InvoiceDropzone
            status={state.kind}
            errorMessage={state.kind === "error" ? state.message : undefined}
            onFileSelected={onUploadFile}
            onCancel={
              state.kind === "uploading"
                ? () => dispatch({ type: "RESET" })
                : undefined
            }
          />
        </div>
      );

    case "preview":
      return (
        <div className="space-y-4">
          <InvoicePreviewTable
            rows={state.rows}
            categories={categories}
            detectedCard={state.detectedCard}
            cardOptions={cardOptions}
            selectedCardId={state.selectedCardId}
            onToggleInclude={(tempId) =>
              dispatch({ type: "TOGGLE_INCLUDE", tempId })
            }
            onChangeCategory={(tempId, categoryId) =>
              dispatch({ type: "CHANGE_CATEGORY", tempId, categoryId })
            }
            onChangeCard={(cardId) => dispatch({ type: "CHANGE_CARD", cardId })}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "RESET" })}
            >
              Cancelar
            </Button>
            <Button disabled={!canSubmit(state)} onClick={onSubmitImport}>
              Importar {includedCount(state)} transações
            </Button>
          </div>
        </div>
      );

    case "importing":
      return <p className="text-muted-foreground">Salvando...</p>;

    case "done":
      return (
        <div className="space-y-3">
          <Alert>
            <AlertTitle>Importação concluída</AlertTitle>
            <AlertDescription>
              {state.importedCount} transações importadas com sucesso.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={() => dispatch({ type: "RESET" })}>
              Importar outra fatura
            </Button>
          </div>
        </div>
      );
  }
}
