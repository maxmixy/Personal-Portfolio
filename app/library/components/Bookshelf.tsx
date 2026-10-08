"use client";

import { useMemo, useState } from "react";
import type { BookshelfBook } from "../lib/catalog.display";
import BookPreview from "./BookPreview";
import BookSpine from "./BookSpine";
import Shelf from "./Shelf";

interface BookshelfProps {
  books: BookshelfBook[];
}

function chunkBooks(books: BookshelfBook[], size: number) {
  const rows: BookshelfBook[][] = [];
  for (let index = 0; index < books.length; index += size) {
    rows.push(books.slice(index, index + size));
  }
  return rows;
}

export default function Bookshelf({ books }: BookshelfProps) {
  const [activeId, setActiveId] = useState<number | null>(books[0]?.id ?? null);
  const shelves = useMemo(() => chunkBooks(books, 14), [books]);
  const activeBook = books.find((book) => book.id === activeId) ?? null;
  const spineIds = books.map((book) => book.id);

  function moveSelection(delta: number) {
    if (!spineIds.length || activeId === null) {
      return;
    }

    const currentIndex = Math.max(spineIds.indexOf(activeId), 0);
    const nextId = spineIds[(currentIndex + delta + spineIds.length) % spineIds.length];
    setActiveId(nextId);
    document.querySelector<HTMLButtonElement>(`[data-book-id="${nextId}"]`)?.focus();
  }

  function handleSpineKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    }
  }

  return (
    <div className="bookshelf" onKeyDown={handleSpineKeyDown}>
      {shelves.map((shelf, index) => (
        <Shelf key={index} label={`Shelf ${index + 1}`}>
          {shelf.map((book) => (
            <div key={book.id} role="listitem">
              <BookSpine
                book={book}
                selected={book.id === activeId}
                tabIndex={book.id === activeId ? 0 : -1}
                onSelect={setActiveId}
              />
            </div>
          ))}
        </Shelf>
      ))}
      <BookPreview book={activeBook} />
    </div>
  );
}
