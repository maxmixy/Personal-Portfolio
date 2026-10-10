"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookshelfBook } from "../lib/catalog.display";
import { getSpineTreatment, type SpineColors } from "../lib/catalog.spine";
import BookPreview from "./BookPreview";
import BookSpine from "./BookSpine";
import Shelf from "./Shelf";

interface BookshelfProps {
  books: BookshelfBook[];
}

interface ShelfItem {
  books: BookshelfBook[];
  width: number;
  height: number;
  stacked: boolean;
  orientation?: "upright" | "horizontal";
}

const STACK_GAP = 6;
const STACK_SEPARATION = 20;

function getShelfItem(
  books: BookshelfBook[],
  orientationOverride?: "upright" | "horizontal",
): ShelfItem {
  const stacked = books.length > 1;
  const treatments = books.map((book) =>
    getSpineTreatment(book.title, book.id, stacked ? "horizontal" : orientationOverride),
  );
  const width = Math.max(...treatments.map((treatment) => treatment.width));
  const height = treatments.reduce((total, treatment) => total + treatment.height, 0)
    - STACK_GAP * Math.max(0, treatments.length - 1);

  return {
    books,
    width,
    height,
    stacked,
    orientation: stacked ? "horizontal" : orientationOverride,
  };
}

function groupHorizontalBooks(books: BookshelfBook[]): ShelfItem[] {
  const booksByAuthor = new Map<string, BookshelfBook[]>();

  for (const book of books) {
    const authorKey = book.authors[0]?.trim().toLowerCase();
    if (!authorKey) continue;
    const group = booksByAuthor.get(authorKey) ?? [];
    group.push(book);
    booksByAuthor.set(authorKey, group);
  }

  const stackByBookId = new Map<number, BookshelfBook[]>();
  for (const group of booksByAuthor.values()) {
    if (group.length < 2 || !group.some((book) => getSpineTreatment(book.title, book.id).orientation === "horizontal")) {
      continue;
    }
    for (const book of group) stackByBookId.set(book.id, group);
  }

  const addedStackIds = new Set<number>();
  const items: ShelfItem[] = [];
  for (const book of books) {
    const stack = stackByBookId.get(book.id);
    if (!stack) {
      items.push(getShelfItem([book]));
      continue;
    }
    if (addedStackIds.has(book.id)) continue;
    items.push(getShelfItem(stack));
    for (const stackedBook of stack) addedStackIds.add(stackedBook.id);
  }
  return items;
}

function separateHorizontalStacks(items: ShelfItem[]): ShelfItem[] {
  const separated = [...items];

  for (let index = 0; index < separated.length - 1; index += 1) {
    if (!separated[index].stacked || !separated[index + 1].stacked) continue;

    const uprightIndex = separated.findIndex((item, itemIndex) =>
      itemIndex > index + 1 && !item.stacked && item.books.length === 1,
    );

    if (uprightIndex >= 0) {
      const [uprightBook] = separated.splice(uprightIndex, 1);
      separated.splice(index + 1, 0, getShelfItem(uprightBook.books, "upright"));
      continue;
    }

    const nextStack = separated[index + 1];
    const [uprightBook, ...remainingBooks] = nextStack.books;
    separated[index + 1] = getShelfItem(
      remainingBooks,
      remainingBooks.length === 1 ? "upright" : undefined,
    );
    separated.splice(index + 1, 0, getShelfItem([uprightBook], "upright"));
  }

  return separated;
}

function chunkBooks(books: BookshelfBook[], width: number) {
  const items = separateHorizontalStacks(groupHorizontalBooks(books));
  if (width <= 0) return items.length ? [items] : [];

  const availableWidth = Math.max(1, width - 24);
  const rows: ShelfItem[][] = [];
  let row: ShelfItem[] = [];
  let rowWidth = 0;

  for (const item of items) {
    const adjacentStackGap = row[row.length - 1]?.stacked && item.stacked ? STACK_SEPARATION : 0;
    const itemGap = (row.length ? 4 : 0) + adjacentStackGap;
    const nextWidth = rowWidth + itemGap + item.width;
    if (row.length && nextWidth > availableWidth) {
      rows.push(row);
      row = [];
      rowWidth = 0;
    }
    const gapBefore = row.length
      ? 4 + (row[row.length - 1].stacked && item.stacked ? STACK_SEPARATION : 0)
      : 0;
    rowWidth += gapBefore + item.width;
    row.push(item);
  }
  if (row.length) rows.push(row);
  return rows;
}

export default function Bookshelf({ books }: BookshelfProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<number | null>(books[0]?.id ?? null);
  const [shelfWidth, setShelfWidth] = useState(0);
  const [previewPosition, setPreviewPosition] = useState<{ left: number; top: number } | null>(null);
  const [coverColors, setCoverColors] = useState<Record<number, SpineColors>>({});
  const bookshelfRef = useRef<HTMLDivElement>(null);
  const previewElementRef = useRef<HTMLElement | null>(null);
  const desktopPreviewElementRef = useRef<HTMLElement | null>(null);
  const lastTouchTapRef = useRef<{ id: number; at: number } | null>(null);
  const mobilePreviewTimerRef = useRef<number | null>(null);
  const previewRef = useCallback((element: HTMLElement | null) => {
    previewElementRef.current = element;
  }, []);
  const desktopPreviewRef = useCallback((element: HTMLElement | null) => {
    desktopPreviewElementRef.current = element;
  }, []);
  const shelves = useMemo(() => chunkBooks(books, shelfWidth), [books, shelfWidth]);
  const spineIds = books.map((book) => book.id);
  const selectedId = activeId !== null && spineIds.includes(activeId) ? activeId : books[0]?.id ?? null;
  const activeBook = books.find((book) => book.id === selectedId) ?? null;

  useEffect(() => {
    const element = bookshelfRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setShelfWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (mobilePreviewTimerRef.current !== null) {
      window.clearTimeout(mobilePreviewTimerRef.current);
    }
  }, []);

  const positionPreview = useCallback((x: number, y: number) => {
    const cardWidth = Math.min(560, Math.max(400, window.innerWidth * 0.4), window.innerWidth - 24);
    const measuredHeight = desktopPreviewElementRef.current?.getBoundingClientRect().height ?? 0;
    const cardHeight = Math.min(measuredHeight || 520, window.innerHeight - 24);
    let left = x + 22;
    let top = y + 16;
    if (left + cardWidth > window.innerWidth - 12) left = x - cardWidth - 22;
    if (top + cardHeight > window.innerHeight - 12) top = y - cardHeight - 16;
    setPreviewPosition({
      left: Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12)),
      top: Math.max(12, Math.min(top, window.innerHeight - cardHeight - 12)),
    });
  }, []);

  const updatePreviewAtPointer = useCallback((id: number, event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    setActiveId(id);
    if (window.matchMedia("(max-width: 767px)").matches) return;
    positionPreview(event.clientX, event.clientY);
  }, [positionPreview]);

  const handleSpineFocus = useCallback((id: number, event: React.FocusEvent<HTMLButtonElement>) => {
    setActiveId(id);
    if (window.matchMedia("(max-width: 767px)").matches) {
      setPreviewPosition(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    positionPreview(bounds.right, bounds.top);
  }, [positionPreview]);

  const handleSpinePointerDown = useCallback((id: number, event: React.PointerEvent<HTMLButtonElement>) => {
    setActiveId(id);
    if (event.pointerType === "mouse") return;
    setPreviewPosition(null);

    const scrollToPreview = () => requestAnimationFrame(() => {
      const card = previewElementRef.current;
      if (!card) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });

    if (event.pointerType === "touch") {
      const now = Date.now();
      const lastTap = lastTouchTapRef.current;
      if (lastTap?.id === id && now - lastTap.at <= 350) {
        if (mobilePreviewTimerRef.current !== null) window.clearTimeout(mobilePreviewTimerRef.current);
        mobilePreviewTimerRef.current = null;
        lastTouchTapRef.current = null;
        const book = books.find((candidate) => candidate.id === id);
        if (book) router.push(`/library/${book.slug}`);
        return;
      }

      lastTouchTapRef.current = { id, at: now };
      if (mobilePreviewTimerRef.current !== null) window.clearTimeout(mobilePreviewTimerRef.current);
      mobilePreviewTimerRef.current = window.setTimeout(() => {
        lastTouchTapRef.current = null;
        mobilePreviewTimerRef.current = null;
        scrollToPreview();
      }, 350);
      return;
    }

    scrollToPreview();
  }, [books, router]);

  const openBook = useCallback((id: number) => {
    const book = books.find((candidate) => candidate.id === id);
    if (book) router.push(`/library/${book.slug}`);
  }, [books, router]);

  const handleCoverColors = useCallback((id: number, colors: SpineColors) => {
    setCoverColors((current) => current[id] ? current : { ...current, [id]: colors });
  }, []);

  function moveSelection(delta: number) {
    if (!spineIds.length || selectedId === null) {
      return;
    }

    const currentIndex = Math.max(spineIds.indexOf(selectedId), 0);
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
    <div className="bookshelf" onPointerLeave={() => setPreviewPosition(null)}>
      <div className="bookshelf-mobile-preview">
        <BookPreview book={activeBook} position={null} previewRef={previewRef} variant="mobile" />
      </div>
      <div
        ref={bookshelfRef}
        className="bookshelf-shelves"
        onKeyDown={handleSpineKeyDown}
      >
        {shelves.map((shelf, index) => (
          <Shelf key={index} label={`Shelf ${index + 1}`}>
            {shelf.map((item) => item.stacked ? (
              <div
                key={`stack-${item.books[0].id}`}
                className="book-horizontal-stack"
                role="listitem"
                aria-label={`${item.books.length} books by ${item.books[0].authorLabel}`}
                style={{ width: `${item.width}px`, height: `${item.height}px` }}
              >
                {item.books.map((book, stackIndex) => {
                  const treatment = getSpineTreatment(book.title, book.id, "horizontal");
                  const bottom = item.books.slice(0, stackIndex).reduce((height, lowerBook) => {
                    return height + getSpineTreatment(lowerBook.title, lowerBook.id, "horizontal").height - STACK_GAP;
                  }, 0);
                  return (
                    <div
                      key={book.id}
                      className="book-horizontal-stack-layer"
                      style={{
                        width: `${treatment.width}px`,
                        height: `${treatment.height}px`,
                        bottom: `${bottom}px`,
                      }}
                    >
                      <BookSpine
                        book={book}
                        orientation="horizontal"
                        coverColors={coverColors[book.id]}
                        onCoverColors={handleCoverColors}
                        selected={book.id === selectedId}
                        tabIndex={book.id === selectedId ? 0 : -1}
                        onPointerEnter={updatePreviewAtPointer}
                        onPointerMove={updatePreviewAtPointer}
                        onPointerDown={handleSpinePointerDown}
                        onFocus={handleSpineFocus}
                        onSelect={setActiveId}
                        onOpen={openBook}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div key={item.books[0].id} role="listitem">
                <BookSpine
                  book={item.books[0]}
                  orientation={item.orientation}
                  coverColors={coverColors[item.books[0].id]}
                  onCoverColors={handleCoverColors}
                  selected={item.books[0].id === selectedId}
                  tabIndex={item.books[0].id === selectedId ? 0 : -1}
                  onPointerEnter={updatePreviewAtPointer}
                  onPointerMove={updatePreviewAtPointer}
                  onPointerDown={handleSpinePointerDown}
                  onFocus={handleSpineFocus}
                  onSelect={setActiveId}
                  onOpen={openBook}
                />
              </div>
            ))}
          </Shelf>
        ))}
      </div>
      <div className="bookshelf-desktop-preview">
        <BookPreview book={activeBook} position={previewPosition} previewRef={desktopPreviewRef} variant="desktop" />
      </div>
    </div>
  );
}
