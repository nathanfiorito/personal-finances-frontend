import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
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
import { Toaster } from "@/components/ui/sonner";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useCategories } from "@/features/categories/use-categories";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/categories/use-category-mutations";
import { CategoryForm } from "@/features/categories/CategoryForm";
import { CategoryList } from "@/features/categories/CategoryList";
import type { CategoryFormValues } from "@/features/categories/category-schema";
import type { CategoryResponse } from "@/lib/api/types";

type DialogMode = "create" | "edit";

export default function CategoriesPage() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mode, setMode] = useState<DialogMode | null>(null);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [deleting, setDeleting] = useState<CategoryResponse | null>(null);

  const categoriesQuery = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = categoriesQuery.data;

  const openCreate = useCallback(() => {
    setEditing(null);
    setMode("create");
  }, []);

  const openEdit = useCallback((category: CategoryResponse) => {
    setEditing(category);
    setMode("edit");
  }, []);

  const closeForm = useCallback(() => {
    setMode(null);
    setEditing(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: CategoryFormValues) => {
      if (mode === "edit" && editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          body: { name: values.name },
        });
        toast.success("Category renamed");
      } else {
        await createMutation.mutateAsync({ name: values.name });
        toast.success("Category created");
      }
      closeForm();
    },
    [mode, editing, createMutation, updateMutation, closeForm]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success("Category deactivated");
      setDeleting(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to deactivate category");
    }
  }, [deleting, deleteMutation]);

  const formProps = {
    initial: editing ?? undefined,
    onSubmit: handleSubmit,
    onCancel: closeForm,
    submitLabel: mode === "edit" ? "Rename" : "Create",
  } as const;

  return (
    <div className="space-y-6">
      <Toaster />

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground text-sm">
            {categories ? `${categories.length} active categories` : "Manage your tags"}
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus /> New
        </Button>
      </header>

      <CategoryList
        categories={categories}
        isLoading={categoriesQuery.isPending}
        onEdit={openEdit}
        onDelete={(category) => setDeleting(category)}
      />

      {isDesktop ? (
        <Dialog open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {mode === "edit" ? "Rename category" : "New category"}
              </DialogTitle>
              <DialogDescription>
                {mode === "edit"
                  ? "Change the name of this category."
                  : "Add a new category you can tag transactions with."}
              </DialogDescription>
            </DialogHeader>
            {mode !== null ? <CategoryForm {...formProps} /> : null}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={mode !== null} onOpenChange={(open) => (open ? null : closeForm())}>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {mode === "edit" ? "Rename category" : "New category"}
              </SheetTitle>
              <SheetDescription>
                {mode === "edit"
                  ? "Change the name of this category."
                  : "Add a new category you can tag transactions with."}
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              {mode !== null ? <CategoryForm {...formProps} /> : null}
            </div>
          </SheetContent>
        </Sheet>
      )}

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => (open ? null : setDeleting(null))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this category?</AlertDialogTitle>
            <AlertDialogDescription>
              Existing transactions tagged with {deleting?.name ?? "this category"} stay
              untouched. The category will be hidden from new-transaction pickers until
              re-activated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" /> Deactivating…
                </>
              ) : (
                "Deactivate"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
