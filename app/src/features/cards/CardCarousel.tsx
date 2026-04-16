import { Plus, Edit, Trash, MoreVertical } from "lucide-react";
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
import type { CardResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { CreditCardVisual } from "./CreditCardVisual";

export interface CardCarouselProps {
  cards: CardResponse[];
  selectedCardId: number | null;
  onSelectCard: (id: number) => void;
  onAddCard: () => void;
  onEditCard: (card: CardResponse) => void;
  onDeleteCard: (card: CardResponse) => void;
  isLoading?: boolean;
  className?: string;
}

function CardActions({
  card,
  onEdit,
  onDelete,
}: {
  card: CardResponse;
  onEdit: (card: CardResponse) => void;
  onDelete: (card: CardResponse) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label={`Actions for ${card.alias}`}
          className="absolute right-2 top-2 text-white/80 hover:bg-white/20 hover:text-white"
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Card</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onEdit(card)}>
          <Edit /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onDelete(card)}>
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddCardPlaceholder({ onAddCard }: { onAddCard: () => void }) {
  return (
    <button
      type="button"
      onClick={onAddCard}
      className={cn(
        "aspect-[1.586] w-full shrink-0 snap-center rounded-2xl",
        "flex flex-col items-center justify-center gap-2",
        "border-2 border-dashed border-muted-foreground/25",
        "text-muted-foreground transition-colors",
        "hover:border-muted-foreground/50 hover:text-foreground",
        "cursor-pointer"
      )}
    >
      <Plus className="size-6" />
      <span className="text-sm font-medium">Add card</span>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="w-72 shrink-0 snap-center sm:w-80">
      <Skeleton className="aspect-[1.586] w-full rounded-2xl" />
    </div>
  );
}

export function CardCarousel({
  cards,
  selectedCardId,
  onSelectCard,
  onAddCard,
  onEditCard,
  onDeleteCard,
  isLoading,
  className,
}: CardCarouselProps) {
  if (isLoading) {
    return (
      <div className={cn("flex gap-4 overflow-x-auto pb-4 scrollbar-hide", className)}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide",
        className
      )}
    >
      {cards.map((card) => (
        <div key={card.id} className="relative w-72 shrink-0 snap-center sm:w-80">
          <CreditCardVisual
            card={card}
            isSelected={card.id === selectedCardId}
            onClick={() => onSelectCard(card.id)}
          />
          <CardActions card={card} onEdit={onEditCard} onDelete={onDeleteCard} />
        </div>
      ))}

      {/* Add card placeholder */}
      <div className="w-72 shrink-0 snap-center sm:w-80">
        <AddCardPlaceholder onAddCard={onAddCard} />
      </div>
    </div>
  );
}
