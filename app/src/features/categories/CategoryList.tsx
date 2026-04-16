import { Edit, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export interface CategoryListProps {
  categories: CategoryResponse[] | undefined;
  isLoading?: boolean;
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (category: CategoryResponse) => void;
  className?: string;
}

function RowActions({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryResponse;
  onEdit?: (category: CategoryResponse) => void;
  onDelete?: (category: CategoryResponse) => void;
}) {
  if (!onEdit && !onDelete) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Actions for ${category.name}`}
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Category</DropdownMenuLabel>
        {onEdit ? (
          <DropdownMenuItem onSelect={() => onEdit(category)}>
            <Edit /> Rename
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(category)}>
              <Trash /> Deactivate
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  className,
}: CategoryListProps) {
  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (!categories || categories.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <ul
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {categories.map((category) => (
        <li
          key={category.id}
          className="bg-card text-card-foreground border-border flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{category.name}</p>
            <p className="text-muted-foreground text-xs">
              {category.is_active ? "Active" : "Inactive"}
            </p>
          </div>
          <RowActions category={category} onEdit={onEdit} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-card text-muted-foreground flex flex-col items-center gap-1 rounded-lg border px-6 py-16 text-center text-sm",
        className
      )}
    >
      <p className="text-foreground font-medium">No categories yet</p>
      <p>Create your first one to start tagging transactions.</p>
    </div>
  );
}

function LoadingState({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="bg-card rounded-lg border px-4 py-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-3 w-12" />
        </li>
      ))}
    </ul>
  );
}
