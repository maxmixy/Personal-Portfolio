import type { Metadata } from "next";
import Link from "next/link";
import Container from "../components/layout/Container";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import Bookshelf from "./components/Bookshelf";
import BulkBookImport from "./components/BulkBookImport";
import { listCatalogBooks, type CatalogBook } from "./lib/catalog";
import { getBookshelfBook } from "./lib/catalog.display";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reading Library | Yuri Morrison",
  description:
    "A personal library catalog with Open Library metadata and local ownership context.",
};

export default async function LibraryPage() {
  let books: CatalogBook[];
  let catalogError: string | null = null;

  try {
    books = await listCatalogBooks(80);
  } catch (error) {
    catalogError = error instanceof Error ? error.message : "The catalog is unavailable.";
    books = [];
  }

  const shelfBooks = books.map(getBookshelfBook);

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
                {books.length} persisted title{books.length === 1 ? "" : "s"} · local catalog
              </p>
            </div>

            {catalogError && (
              <p role="alert" className="mb-8 border border-[var(--coral)] bg-[var(--paper-deep)] p-4 text-sm">
                The catalog could not be loaded: {catalogError}
              </p>
            )}

            {books.length === 0 && !catalogError ? (
              <div className="border border-dashed border-[var(--line)] bg-[var(--paper)] p-8 text-sm text-[var(--ink-soft)]">
                No locally persisted books yet. Search Open Library and import a selected candidate.
              </div>
            ) : (
              <Bookshelf books={shelfBooks} />
            )}
          </Container>
        </section>

        <BulkBookImport />

        <section className="page-width py-14 md:py-20">
          <div className="border-y border-[var(--line)] py-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <p className="eyebrow">04 / Scope</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                A personal shelf, not a finished social product.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                This version searches Open Library, stores reviewed editions locally,
                and presents the collection as a bookshelf. Reviews, recommendations,
                and loans remain later capabilities.
              </p>
              <p className="mt-4 text-xs text-[var(--muted)]">
                Book metadata and covers via{" "}
                <a
                  href="https://openlibrary.org"
                  className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]"
                >
                  Open Library
                </a>
                .
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
