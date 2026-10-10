import type { RefCallback } from "react";
import type { BookshelfBook } from "../lib/catalog.display";
import BookCover from "./BookCover";

interface BookPreviewProps {
  book: BookshelfBook | null;
  position: { left: number; top: number } | null;
  previewRef?: RefCallback<HTMLElement>;
  variant: "mobile" | "desktop";
}

export default function BookPreview({ book, position, previewRef, variant }: BookPreviewProps) {
  if (!book) {
    return (
      <div ref={previewRef} className={`book-preview is-empty${variant === "mobile" ? " is-mobile" : " is-static"}`} role="status">
        <p>Select a spine to preview a title. Keyboard focus and tap work as well as hover.</p>
      </div>
    );
  }

  return (
    <article
      ref={previewRef}
      className={`book-preview${variant === "mobile" ? " is-mobile" : position ? " is-floating" : " is-static"}`}
      style={position ? { left: `${position.left}px`, top: `${position.top}px` } : undefined}
      aria-live="polite"
    >
      <BookCover src={book.coverUrl} title={book.title} size="M" />
      <div>
        <p className="project-type">{book.readingStatus}</p>
        <h3>{book.title}</h3>
        <p className="book-preview-author">by {book.authorLabel}</p>
        {book.rating !== null && (
          <p className="mt-3 text-sm" aria-label={`Personal rating: ${book.rating} out of 5`}>
            <span aria-hidden="true">{"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}</span>
            <span className="sr-only"> {book.rating} out of 5</span>
          </p>
        )}
        <dl>
          <div>
            <dt>Published</dt>
            <dd>{book.publicationYear}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{book.language}</dd>
          </div>
          <div>
            <dt>Availability</dt>
            <dd>{book.availability === "on-loan" ? "On loan" : book.availability === "reserved" ? "Reserved" : book.availability === "lost" ? "Unavailable" : "Available"}</dd>
          </div>
        </dl>
        <p className="book-preview-open-hint">
          <span className="book-preview-open-desktop">Double-click a spine to open book details</span>
          <span className="book-preview-open-mobile">Tap a spine twice to open book details</span>
          <span aria-hidden="true"> →</span>
        </p>
      </div>
    </article>
  );
}
