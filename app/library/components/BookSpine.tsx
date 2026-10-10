import { getCoverUrlForSize, type BookshelfBook } from "../lib/catalog.display";
import { getSpineColorsFromCover, getSpineTreatment, type SpineColors } from "../lib/catalog.spine";
import type { CSSProperties, FocusEvent, PointerEvent } from "react";
import Image from "next/image";

interface BookSpineProps {
  book: BookshelfBook;
  orientation?: "upright" | "horizontal";
  coverColors?: SpineColors;
  onCoverColors?: (id: number, colors: SpineColors) => void;
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
  orientation,
  coverColors,
  onCoverColors,
  selected,
  tabIndex = -1,
  onPointerEnter,
  onPointerMove,
  onPointerDown,
  onFocus,
  onSelect,
  onOpen,
}: BookSpineProps) {
  const treatment = getSpineTreatment(book.title, book.id, orientation);
  const coverSamplerSrc = getCoverUrlForSize(book.coverUrl, "S");
  const spineStyle = {
    width: `${treatment.width}px`,
    height: `${treatment.height}px`,
    background: coverColors?.background ?? treatment.background,
    color: coverColors?.color ?? treatment.color,
    "--spine-tilt": treatment.tilt,
  } as CSSProperties;

  return (
    <button
      type="button"
      data-book-id={book.id}
      className={`book-spine is-${treatment.orientation}${selected ? " is-selected" : ""}`}
      style={spineStyle}
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
      {coverSamplerSrc && !coverColors && onCoverColors && (
        <Image
          src={coverSamplerSrc}
          alt=""
          aria-hidden="true"
          width={72}
          height={108}
          className="book-spine-cover-sampler"
          onLoad={(event) => {
            const colors = getSpineColorsFromCover(event.currentTarget);
            if (colors) onCoverColors(book.id, colors);
          }}
        />
      )}
    </button>
  );
}
