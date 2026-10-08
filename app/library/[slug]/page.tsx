import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import BookCover from "../components/BookCover";
import { getCatalogBookBySlug } from "../lib/catalog";
import { getCatalogCardDisplay } from "../lib/catalog.display";
import { getCatalogBookSlug } from "../lib/catalog.slug";

interface LibraryBookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LibraryBookPageProps): Promise<Metadata> {
  const { slug } = await params;
  let book;

  try {
    book = await getCatalogBookBySlug(slug);
  } catch {
    return { title: "Book not found | Yuri Morrison" };
  }

  if (!book) {
    return { title: "Book not found | Yuri Morrison" };
  }

  const display = getCatalogCardDisplay(book);
  return {
    title: `${book.title} | Yuri Morrison`,
    description: `${book.title} by ${display.author}. A locally persisted library catalog entry.`,
  };
}

export const dynamic = "force-dynamic";

export default async function LibraryBookPage({ params }: LibraryBookPageProps) {
  const { slug } = await params;
  let book;

  try {
    book = await getCatalogBookBySlug(slug);
  } catch {
    notFound();
  }

  if (!book) {
    notFound();
  }

  const display = getCatalogCardDisplay(book);
  const openLibraryHref = book.openLibraryKey
    ? `https://openlibrary.org/works/${book.openLibraryKey}`
    : "https://openlibrary.org";
  const isbn = book.isbn13 ?? book.isbn10 ?? "Unavailable";

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="book-title">
          <Link href="/library" className="text-link">
            ← Back to library
          </Link>
          <div className="mt-12 grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <aside aria-label="Book cover">
              <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-6 md:p-8">
                <p className="project-type">Library / {display.genre}</p>
                <div className="mt-8">
                  <BookCover src={book.coverUrl} title={book.title} size="L" priority />
                </div>
              </div>
            </aside>

            <article>
              <p className="eyebrow">Persisted catalog entry</p>
              <h1 id="book-title" className="mt-7 max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
                {book.title}
                <span className="accent-period">.</span>
              </h1>
              <p className="mt-5 text-lg text-[var(--ink-soft)]">by {display.author}</p>
              <p className="mt-9 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
                {display.description}
              </p>

              <dl className="mt-12 border-t border-[var(--line)]">
                {[
                  ["ISBN", isbn],
                  ["Published", display.publicationYear],
                  ["Language", display.genre],
                  ["Pages", book.pageCount?.toString() ?? "Unavailable"],
                  ["Reading status", display.readingStatus],
                  ["Ownership", "Owned locally"],
                  ["Added", book.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 border-b border-[var(--line)] py-5 sm:grid-cols-[180px_1fr]">
                    <dt className="project-type">{label}</dt>
                    <dd className="text-sm text-[var(--ink-soft)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </section>

        <section className="section-band py-14 md:py-20" aria-labelledby="source-title">
          <Container>
            <p className="eyebrow">03 / Source</p>
            <h2 id="source-title" className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Bibliographic reference
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Book metadata and covers via Open Library. Personal ownership stays in this catalog
              and is not inferred from the provider.
            </p>
            <a
              href={openLibraryHref}
              className="mt-6 inline-flex text-sm font-medium underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
            >
              View {book.title} on Open Library <span aria-hidden="true">↗</span>
            </a>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--muted)]">
              Local slug / {getCatalogBookSlug(book)}
            </p>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
