import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import BulkBookImport from "./components/BulkBookImport";
import { books } from "./books";

export const metadata: Metadata = {
  title: "Reading Library | Yuri Morrison",
  description:
    "A personal library catalog with Open Library metadata and local ownership context.",
};

export default function LibraryPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="page-width py-16 md:py-24" aria-labelledby="library-title">
          <p className="eyebrow">Personal application / Reading library</p>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-14">
            <h1
              id="library-title"
              className="max-w-4xl text-5xl font-medium leading-[0.98] tracking-tight md:text-7xl"
            >
              A reading library built for curiosity
              <span className="accent-period">.</span>
            </h1>
            <p className="max-w-xl pb-1 text-sm leading-7 text-[var(--ink-soft)] md:text-base">
              A catalog built around locally owned books and externally sourced
              metadata. Open Library supplies search and edition candidates;
              ownership remains local and is never inferred from the provider.
            </p>
          </div>
        </section>

        <BulkBookImport />

        <section className="section-band py-14 md:py-20" aria-labelledby="catalog-title">
          <Container>
            <div className="mb-10 flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">01 / Catalog</p>
                <h2 id="catalog-title" className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                  Current collection
                </h2>
              </div>
              <p className="text-xs text-[var(--ink-soft)]">
                {books.length} sample titles · read-only preview
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {books.map((book, index) => (
                <article
                  key={book.id}
                  className="group border border-[var(--line)] bg-[var(--paper)] p-6 transition-colors hover:border-[var(--ink)] md:p-7"
                >
                  <div className="flex items-start justify-between gap-5">
                    <p className="project-type">{String(index + 1).padStart(2, "0")} / {book.genre}</p>
                    <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-medium text-[var(--ink-soft)]">
                      {book.readingStatus}
                    </span>
                  </div>
                  <h3 className="mt-7 text-2xl font-semibold tracking-tight">{book.title}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">by {book.author}</p>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-[var(--ink-soft)]">
                    {book.description}
                  </p>
                  <div className="mt-7 flex items-center justify-between border-t border-[var(--line)] pt-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.04em] text-[var(--muted)]">
                      {book.publicationYear}
                    </p>
                    <Link
                      href={`/library/${book.id}`}
                      className="text-sm font-medium underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] hover:decoration-[var(--coral)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
                    >
                      View details <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="page-width py-14 md:py-20">
          <div className="border-y border-[var(--line)] py-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <p className="eyebrow">04 / Scope</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                A foundation, not a finished social product.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                This version searches Open Library and presents reviewed candidates.
                Local persistence, owner-managed records, reviews, recommendations,
                and loans are separate future capabilities.
              </p>
            </div>
            <Link href="/projects" className="text-link mt-6 md:mt-0">
              Return to projects <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
