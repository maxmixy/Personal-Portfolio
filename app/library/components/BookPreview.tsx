import Link from "next/link";
import type { BookshelfBook } from "../lib/catalog.display";
import BookCover from "./BookCover";

interface BookPreviewProps {
  book: BookshelfBook | null;
}

export default function BookPreview({ book }: BookPreviewProps) {
  if (!book) {
    return (
      <div className="book-preview is-empty" role="status">
        <p>Select a spine to preview a title. Keyboard focus and tap work as well as hover.</p>
      </div>
    );
  }

  return (
    <article className="book-preview" aria-live="polite">
      <BookCover src={book.coverUrl} title={book.title} size="M" />
      <div>
        <p className="project-type">{book.readingStatus}</p>
        <h3>{book.title}</h3>
        <p className="book-preview-author">by {book.authorLabel}</p>
        <dl>
          <div>
            <dt>Published</dt>
            <dd>{book.publicationYear}</dd>
          </div>
          <div>
            <dt>Language</dt>
            <dd>{book.language}</dd>
          </div>
        </dl>
        <Link href={`/library/${book.slug}`} className="text-link">
          View book <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
