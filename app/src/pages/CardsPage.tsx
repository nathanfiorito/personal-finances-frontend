import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";
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
import { Toaster } from "@/components/ui/sonner";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useCards } from "@/features/cards/use-cards";
import {
  useCreateCard,
  useDeleteCard,
  useUpdateCard,
} from "@/features/cards/use-card-mutations";
import { useCurrentInvoice } from "@/features/cards/use-invoice";
import { useInvoiceTimeline } from "@/features/cards/use-invoice-timeline";
import { useInvoicePrediction } from "@/features/cards/use-invoice-prediction";
import { CardCarousel } from "@/features/cards/CardCarousel";
import { CardForm } from "@/features/cards/CardForm";
import { InvoiceKpiRow } from "@/features/cards/InvoiceKpiRow";
import { InvoiceChart } from "@/features/cards/InvoiceChart";
import { InvoiceTransactionList } from "@/features/cards/InvoiceTransactionList";
import type { CardFormValues } from "@/features/cards/card-schema";
import type { CardResponse } from "@/lib/api/types";

type DialogMode = "create" | "edit";

export default function CardsPage() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [userSelectedCardId, setUserSelectedCardId] = useState<number | null>(null);
  const [mode, setMode] = useState<DialogMode | null>(null);
  const [editingCard, setEditingCard] = useState<CardResponse | null>(null);
  const [deletingCard, setDeletingCard] = useState<CardResponse | null>(null);

  const cardsQuery = useCards();
  const cards = useMemo(() => cardsQuery.data ?? [], [cardsQuery.data]);

  // Derive effective selected card: user pick, or auto-select first card
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);
  const selectedCardId = useMemo(() => {
    if (userSelectedCardId !== null && cardIds.includes(userSelectedCardId)) {
      return userSelectedCardId;
    }
    return cardIds.length > 0 ? cardIds[0] : null;
  }, [userSelectedCardId, cardIds]);

  const cardSelected = selectedCardId !== null;
  const invoiceQuery = useCurrentInvoice(selectedCardId!, cardSelected);
  const timelineQuery = useInvoiceTimeline(selectedCardId!, cardSelected);
  const predictionQuery = useInvoicePrediction(selectedCardId!, cardSelected);

  const createMutation = useCreateCard();
  const updateMutation = useUpdateCard();
  const deleteMutation = useDeleteCard();

  const openCreate = useCallback(() => {
    setEditingCard(null);
    setMode("create");
  }, []);

  const openEdit = useCallback((card: CardResponse) => {
    setEditingCard(card);
    setMode("edit");
  }, []);

  const closeForm = useCallback(() => {
    setMode(null);
    setEditingCard(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: CardFormValues) => {
      if (mode === "edit" && editingCard) {
        await updateMutation.mutateAsync({ id: editingCard.id, body: values });
        toast.success("Card updated");
        closeForm();
      } else {
        const newCard = await createMutation.mutateAsync(values);
        toast.success("Card added");
        closeForm();
        setUserSelectedCardId(newCard.id);
      }
    },
    [mode, editingCard, createMutation, updateMutation, closeForm]
  );

  const confirmDelete = useCallback(async () => {
    if (!deletingCard) return;
    try {
      await deleteMutation.mutateAsync(deletingCard.id);
      toast.success("Card deleted");
      if (selectedCardId === deletingCard.id) {
        setUserSelectedCardId(null);
      }
      setDeletingCard(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete card");
    }
  }, [deletingCard, deleteMutation, selectedCardId]);

  const invoice = invoiceQuery.data;

  const formInitial: CardFormValues | undefined = editingCard
    ? {
        alias: editingCard.alias,
        bank: editingCard.bank,
        last_four_digits: editingCard.last_four_digits,
        closing_day: editingCard.closing_day,
        due_day: editingCard.due_day,
      }
    : undefined;

  const formProps = {
    initial: formInitial,
    onSubmit: handleSubmit,
    onCancel: closeForm,
    submitLabel: mode === "edit" ? "Save" : "Add card",
    isPending: createMutation.isPending || updateMutation.isPending,
  } as const;

  return (
    <div className="space-y-6">
      <Toaster />

      <header>
        <h1 className="text-2xl font-semibold">Cards</h1>
        <p className="text-muted-foreground text-sm">
          {cards.length > 0
            ? `${cards.length} card${cards.length === 1 ? "" : "s"}`
            : "Manage your credit cards"}
        </p>
      </header>

      <CardCarousel
        cards={cards}
        selectedCardId={selectedCardId}
        onSelectCard={setUserSelectedCardId}
        onAddCard={openCreate}
        onEditCard={openEdit}
        onDeleteCard={(card) => setDeletingCard(card)}
        isLoading={cardsQuery.isPending}
      />

      {!cardsQuery.isPending && cards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <CreditCard className="text-muted-foreground size-12" />
          <div>
            <p className="font-medium">No cards yet</p>
            <p className="text-muted-foreground text-sm">
              Use the &ldquo;Add card&rdquo; placeholder above to add your first credit card.
            </p>
          </div>
        </div>
      ) : null}

      {selectedCardId !== null ? (
        <>
          <InvoiceKpiRow
            total={invoice?.total ?? null}
            dueDate={invoice?.due_date ?? null}
            closingDate={invoice?.closing_date ?? null}
            isLoading={invoiceQuery.isPending}
          />

          <InvoiceChart
            timeline={timelineQuery.data}
            prediction={predictionQuery.data}
            isTimelineLoading={timelineQuery.isPending}
            isPredictionLoading={predictionQuery.isPending}
          />

          <InvoiceTransactionList
            transactions={invoice?.transactions ?? []}
            isLoading={invoiceQuery.isPending}
          />
        </>
      ) : null}

      {isDesktop ? (
        <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{mode === "edit" ? "Edit card" : "Add card"}</DialogTitle>
              <DialogDescription>
                {mode === "edit"
                  ? "Update the details for this card."
                  : "Enter your card details to start tracking invoices."}
              </DialogDescription>
            </DialogHeader>
            {mode !== null ? <CardForm {...formProps} /> : null}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{mode === "edit" ? "Edit card" : "Add card"}</SheetTitle>
              <SheetDescription>
                {mode === "edit"
                  ? "Update the details for this card."
                  : "Enter your card details to start tracking invoices."}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              {mode !== null ? <CardForm {...formProps} /> : null}
            </div>
          </SheetContent>
        </Sheet>
      )}

      <AlertDialog
        open={deletingCard !== null}
        onOpenChange={(open) => (open ? null : setDeletingCard(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              {deletingCard?.alias ?? "this card"} and all its invoice data.
              This action cannot be undone.
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
