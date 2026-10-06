import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { books, getBookById } from "../books";

interface LibraryBookPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.id }));
}

export async function generateMetadata({ params }: LibraryBookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookById(slug);

  if (!book) {
    return { title: "Book not found | Yuri Morrison" };
  }

  return {
    title: `${book.title} | Yuri Morrison`,
    description: `${book.title} by ${book.author}. A read-only library catalog entry.`,
  };
}

export default async function LibraryBookPage({ params }: LibraryBookPageProps) {
  const { slug } = await params;
  const book = getBookById(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="book-title">
          <Link href="/library" className="text-link">
            ← Back to library
          </Link>
          <div className="mt-12 grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <aside aria-label="Book metadata">
              <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-6 md:p-8">
                <p className="project-type">Library / {book.genre}</p>
                <div className="mt-12 flex aspect-[3/4] items-center justify-center border border-[var(--line)] bg-[var(--paper)] p-5 text-center">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
                      Reading catalog
                    </span>
                    <p className="mt-5 text-2xl font-semibold leading-tight">{book.title}</p>
                    <p className="mt-3 text-sm text-[var(--ink-soft)]">{book.author}</p>
                  </div>
                </div>
              </div>
            </aside>

            <article>
              <p className="eyebrow">Read-only catalog entry</p>
              <h1 id="book-title" className="mt-7 max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl">
                {book.title}
                <span className="accent-period">.</span>
              </h1>
              <p className="mt-5 text-lg text-[var(--ink-soft)]">by {book.author}</p>
              <p className="mt-9 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">
                {book.description}
              </p>

              <dl className="mt-12 border-t border-[var(--line)]">
                {[
                  ["ISBN", book.isbn],
                  ["Publisher", book.publisher],
                  ["Published", String(book.publicationYear)],
                  ["Reading status", book.readingStatus],
                  ["Ownership", book.ownershipStatus],
                  ["Location", book.location],
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

        <section className="section-band py-14 md:py-20" aria-labelledby="tags-title">
          <Container>
            <p className="eyebrow">03 / Topics</p>
            <h2 id="tags-title" className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Categories in this collection
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {book.tags.map((tag) => (
                <span key={tag} className="border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs text-[var(--ink-soft)]">
                  {tag}
                </span>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
