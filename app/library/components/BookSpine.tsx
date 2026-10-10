import type { BookshelfBook } from "../lib/catalog.display";
import { getSpineTreatment } from "../lib/catalog.spine";
import type { FocusEvent, PointerEvent } from "react";

interface BookSpineProps {
  book: BookshelfBook;
  selected: boolean;
  tabIndex?: number;
  onPointerEnter: (id: number, event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (id: number, event: PointerEvent<HTMLButtonElement>) => void;
  onPointerDown: (id: number, event: PointerEvent<HTMLButtonElement>) => void;
  onFocus: (id: number, event: FocusEvent<HTMLButtonElement>) => void;
  onSelect: (id: number) => void;
  onOpen: (id: number) => void;
}

export default function BookSpine({
  book,
  selected,
  tabIndex = -1,
  onPointerEnter,
  onPointerMove,
  onPointerDown,
  onFocus,
  onSelect,
  onOpen,
}: BookSpineProps) {
  const treatment = getSpineTreatment(book.title, book.id);

  return (
    <button
      type="button"
      data-book-id={book.id}
      className={`book-spine${selected ? " is-selected" : ""}`}
      style={{
        width: `${treatment.width}px`,
        height: `${treatment.height}px`,
        background: treatment.background,
        color: treatment.color,
      }}
      aria-pressed={selected}
      aria-label={`${book.title} by ${book.authorLabel}. Double-click or press Enter to open details.`}
      tabIndex={tabIndex}
      onPointerEnter={(event) => onPointerEnter(book.id, event)}
      onPointerMove={(event) => onPointerMove(book.id, event)}
      onPointerDown={(event) => onPointerDown(book.id, event)}
      onClick={() => onSelect(book.id)}
      onDoubleClick={() => onOpen(book.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onOpen(book.id);
        }
      }}
      onFocus={(event) => onFocus(book.id, event)}
    >
      <span className="book-spine-title">{book.title}</span>
      <span className="book-spine-author">{book.authorLabel}</span>
    </button>
  );
}
