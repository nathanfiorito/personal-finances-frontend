import { useRef, useState } from "react";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type InvoiceDropzoneStatus = "idle" | "uploading" | "error";

export interface InvoiceDropzoneProps {
  status: InvoiceDropzoneStatus;
  errorMessage?: string;
  onFileSelected: (file: File) => void;
  onCancel?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function InvoiceDropzone({
  status,
  errorMessage,
  onFileSelected,
  onCancel,
}: InvoiceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  function showInlineError(message: string) {
    setInlineError(message);
    setTimeout(() => setInlineError(null), 3000);
  }

  function validateAndSelect(file: File) {
    if (file.type !== "application/pdf") {
      showInlineError("Apenas arquivos PDF");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showInlineError("Arquivo excede 10 MB");
      return;
    }
    onFileSelected(file);
  }

  function handleClick() {
    if (status === "uploading") return;
    inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (status === "uploading") return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (status !== "uploading") setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (status === "uploading") return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndSelect(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    // Reset the input so the same file can be selected again if needed
    e.target.value = "";
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          data-testid="file-input"
          onChange={handleInputChange}
          tabIndex={-1}
          aria-hidden="true"
        />

        {status === "idle" && (
          <div
            role="button"
            tabIndex={0}
            aria-label="Selecionar fatura em PDF"
            data-dragover={isDragOver ? "true" : "false"}
            className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/30 data-[dragover=true]:border-primary data-[dragover=true]:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="size-10 text-muted-foreground" />

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                Arraste e solte ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                Fatura do cartão em PDF, até 10 MB
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Selecionar PDF
            </Button>

            {inlineError && (
              <p
                role="alert"
                className="text-sm font-medium text-destructive"
                data-testid="inline-error"
              >
                {inlineError}
              </p>
            )}
          </div>
        )}

        {status === "uploading" && (
          <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center">
            <Loader2 className="size-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Analisando fatura... (pode levar até 30 segundos)
            </p>
            {onCancel && (
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col gap-4">
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Erro ao importar fatura</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
