import { useCallback, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { toast } from "sonner";
import { Download, Loader2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Pagination } from "@/components/app/Pagination";
import { Toaster } from "@/components/ui/sonner";
import { useCategories } from "@/features/categories/use-categories";
import { rangeForPreset } from "@/features/dashboard/period";
import {
  downloadCsvBlob,
  useCreateTransaction,
  useDeleteTransaction,
  useExportCsv,
  useUpdateTransaction,
} from "@/features/transactions/use-transaction-mutations";
import { useTransactions } from "@/features/transactions/use-transactions";
import { TransactionForm } from "@/features/transactions/TransactionForm";
import { TransactionsList } from "@/features/transactions/TransactionsList";
import type {
  TransactionCreateRequest,
  TransactionResponse,
  TransactionUpdateRequest,
} from "@/lib/api/types";
import { todayIso } from "@/lib/format/format-date";

const PAGE_SIZE = 20;

type DialogMode = "create" | "edit";

export default function TransactionsPage() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState<DialogMode | null>(null);
  const [editing, setEditing] = useState<TransactionResponse | null>(null);
  const [deleting, setDeleting] = useState<TransactionResponse | null>(null);

  const transactionsQuery = useTransactions({ page, pageSize: PAGE_SIZE });
  const categoriesQuery = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const exportMutation = useExportCsv();

  const categories = categoriesQuery.data ?? [];
  const transactions = transactionsQuery.data?.items;
  const total = transactionsQuery.data?.total ?? 0;

  const openCreate = useCallback(() => {
    setEditing(null);
    setMode("create");
  }, []);

  const openEdit = useCallback((transaction: TransactionResponse) => {
    setEditing(transaction);
    setMode("edit");
  }, []);

  const closeForm = useCallback(() => {
    setMode(null);
    setEditing(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: TransactionCreateRequest | TransactionUpdateRequest) => {
      if (mode === "edit" && editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          body: values as TransactionUpdateRequest,
        });
        toast.success("Transaction updated");
      } else {
        await createMutation.mutateAsync(values as TransactionCreateRequest);
        toast.success("Transaction created");
      }
      closeForm();
    },
    [mode, editing, createMutation, updateMutation, closeForm]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success("Transaction deleted");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete transaction");
    }
  }, [deleting, deleteMutation]);

  const handleExport = useCallback(async () => {
    const { start, end } = rangeForPreset("this-year");
    try {
      const blob = await exportMutation.mutateAsync({ start, end });
      downloadCsvBlob(blob, `transactions-${todayIso()}.csv`);
      toast.success("CSV export downloaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to export transactions");
    }
  }, [exportMutation]);

  const formProps = {
    categories,
    initial: editing ?? undefined,
    onSubmit: handleSubmit,
    onCancel: closeForm,
    submitLabel: mode === "edit" ? "Save changes" : "Create",
  } as const;

  return (
    <div className="space-y-6">
      <Toaster />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-muted-foreground text-sm">
            {total > 0 ? `${total} transactions` : "Your expense history"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? <Loader2 className="animate-spin" /> : <Download />}
            Export CSV
          </Button>
          <Button type="button" onClick={openCreate}>
            <Plus /> New
          </Button>
        </div>
      </header>

      <TransactionsList
        transactions={transactions}
        isLoading={transactionsQuery.isPending}
        isFetching={transactionsQuery.isFetching}
        onEdit={openEdit}
        onDelete={(tx) => setDeleting(tx)}
      />

      {total > 0 ? (
        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
      ) : null}

      {isDesktop ? (
        <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{mode === "edit" ? "Edit transaction" : "New transaction"}</DialogTitle>
              <DialogDescription>
                {mode === "edit"
                  ? "Update the details for this transaction."
                  : "Manually record a new transaction."}
              </DialogDescription>
            </DialogHeader>
            {mode !== null ? <TransactionForm {...formProps} /> : null}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <SheetContent side="bottom" className="h-[92vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {mode === "edit" ? "Edit transaction" : "New transaction"}
              </SheetTitle>
              <SheetDescription>
                {mode === "edit"
                  ? "Update the details for this transaction."
                  : "Manually record a new transaction."}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              {mode !== null ? <TransactionForm {...formProps} /> : null}
            </div>
          </SheetContent>
        </Sheet>
      )}

      <AlertDialog open={deleting !== null} onOpenChange={(open) => (open ? null : setDeleting(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The transaction will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
