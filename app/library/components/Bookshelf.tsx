"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BookshelfBook } from "../lib/catalog.display";
import { getSpineTreatment } from "../lib/catalog.spine";
import BookPreview from "./BookPreview";
import BookSpine from "./BookSpine";
import Shelf from "./Shelf";

interface BookshelfProps {
  books: BookshelfBook[];
}

function chunkBooks(books: BookshelfBook[], width: number) {
  if (width <= 0) return books.length ? [books] : [];

  const availableWidth = Math.max(1, width - 24);
  const rows: BookshelfBook[][] = [];
  let row: BookshelfBook[] = [];
  let rowWidth = 0;

  for (const book of books) {
    const spineWidth = getSpineTreatment(book.title, book.id).width;
    const nextWidth = rowWidth + (row.length ? 4 : 0) + spineWidth;
    if (row.length && nextWidth > availableWidth) {
      rows.push(row);
      row = [];
      rowWidth = 0;
    }
    rowWidth += (row.length ? 4 : 0) + spineWidth;
    row.push(book);
  }
  if (row.length) rows.push(row);
  return rows;
}

export default function Bookshelf({ books }: BookshelfProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<number | null>(books[0]?.id ?? null);
  const [shelfWidth, setShelfWidth] = useState(0);
  const [previewPosition, setPreviewPosition] = useState<{ left: number; top: number } | null>(null);
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
            {shelf.map((book) => (
              <div key={book.id} role="listitem">
                <BookSpine
                  book={book}
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
