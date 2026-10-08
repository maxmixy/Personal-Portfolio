import type { BookshelfBook } from "../lib/catalog.display";
import { getSpineTreatment } from "../lib/catalog.spine";

interface BookSpineProps {
  book: BookshelfBook;
  selected: boolean;
  tabIndex?: number;
  onSelect: (id: number) => void;
}

export default function BookSpine({
  book,
  selected,
  tabIndex = -1,
  onSelect,
}: BookSpineProps) {
  const treatment = getSpineTreatment(book.title, book.id);

  return (
    <button
      type="button"
      data-book-id={book.id}
      className={`book-spine${selected ? " is-selected" : ""}`}
      style={{
        width: `${treatment.width}px`,
        background: treatment.background,
        color: treatment.color,
      }}
      aria-pressed={selected}
      aria-label={`${book.title} by ${book.authorLabel}`}
      tabIndex={tabIndex}
      onMouseEnter={() => onSelect(book.id)}
      onClick={() => onSelect(book.id)}
      onFocus={() => onSelect(book.id)}
    >
      <span className="book-spine-title">{book.title}</span>
      <span className="book-spine-author">{book.authorLabel}</span>
    </button>
  );
}
