import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "../../components/layout/Container";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import BookCover from "../components/BookCover";
import BorrowRequestPanel from "../components/BorrowRequestPanel";
import PersonalMetadataEditor from "../components/PersonalMetadataEditor";
import { getCatalogBookBySlug } from "../lib/catalog";
import { getCurrentLibraryUser, type LibraryUser } from "../lib/auth";
import { getLatestUserLoanForBook, getOwnerLoanForBook } from "../lib/loans";
import { getCatalogCardDisplay } from "../lib/catalog.display";
import { getCatalogBookSlug } from "../lib/catalog.slug";
import { getLibraryPreviewUser, getLibraryViewRole, isRolePreview } from "../lib/role-preview";

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
  let user: LibraryUser | null = null;
  let borrowerLoan: Awaited<ReturnType<typeof getLatestUserLoanForBook>> | undefined;
  let ownerLoan: Awaited<ReturnType<typeof getOwnerLoanForBook>> | undefined;
  let previewing = false;
  try {
    const actualUser = await getCurrentLibraryUser();
    const viewRole = await getLibraryViewRole(actualUser);
    user = getLibraryPreviewUser(actualUser, viewRole);
    previewing = isRolePreview(actualUser, viewRole);
    if (user?.role === "owner") {
      ownerLoan = await getOwnerLoanForBook(book.id);
    } else if (user) {
      borrowerLoan = await getLatestUserLoanForBook(book.id, user.id);
    }
  } catch {
    // The bibliographic detail remains available if account or loan tables are not configured yet.
  }
  const metadataSources = (book.providerRecords ?? []).map((source) => ({
    label: source.provider === "openlibrary" ? "Open Library" : "Google Books",
    href: source.provider === "openlibrary"
      ? source.id.startsWith("edition:")
        ? `https://openlibrary.org/books/${source.id.slice("edition:".length)}`
        : `https://openlibrary.org/works/${source.id.replace(/^work:/, "")}`
      : `https://books.google.com/books?id=${encodeURIComponent(source.id)}`,
  }));
  if (book.openLibraryKey && !metadataSources.some((source) => source.label === "Open Library")) {
    metadataSources.push({ label: "Open Library", href: `https://openlibrary.org/works/${book.openLibraryKey}` });
  }
  if (metadataSources.length === 0 && (book.openLibraryEditionId || book.openLibraryKey)) {
    metadataSources.push({
      label: "Open Library",
      href: book.openLibraryEditionId ? `https://openlibrary.org/books/${book.openLibraryEditionId}` : `https://openlibrary.org/works/${book.openLibraryKey}`,
    });
  }
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
                  ["Edition date", book.publishDate ?? "Unavailable"],
                  ["Publisher", book.publisher ?? "Unavailable"],
                  ["Edition ID", book.openLibraryEditionId ?? "Unavailable"],
                  ["Language", display.genre],
                  ["Pages", book.pageCount?.toString() ?? "Unavailable"],
                  ["Reading status", display.readingStatus],
                  ["Personal rating", book.rating === null ? "Not rated" : `${book.rating} / 5`],
                  ["Availability", book.availability === "on-loan" ? "On loan" : book.availability === "reserved" ? "Reserved" : book.availability === "lost" ? "Unavailable" : "Available"],
                  ["Ownership", "Owned locally"],
                  ["Added", book.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 border-b border-[var(--line)] py-5 sm:grid-cols-[180px_1fr]">
                    <dt className="project-type">{label}</dt>
                    <dd className="text-sm text-[var(--ink-soft)]">{value}</dd>
                  </div>
                ))}
              </dl>

              <section className="mt-12 border-t border-[var(--line)] pt-8" aria-labelledby="personal-notes-title">
                <p className="eyebrow">Personal metadata</p>
                <h2 id="personal-notes-title" className="mt-3 text-2xl font-medium tracking-tight">Notes and review</h2>
                {user?.role === "owner" && (book.notes || book.review) ? (
                  <div className="mt-5 grid gap-6">
                    {book.notes && <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--ink-soft)]">{book.notes}</p>}
                    {book.review && (
                      <blockquote className="border-l-2 border-[var(--coral)] pl-5 text-sm leading-7 text-[var(--ink-soft)]">
                        {book.review}
                      </blockquote>
                    )}
                  </div>
                ) : user?.role !== "owner" ? (
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">Personal annotations are visible to the library owner only.</p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">No personal notes or review have been added.</p>
                )}
                {user?.role === "owner" && (
                  <PersonalMetadataEditor
                    bookId={book.id}
                    rating={book.rating}
                    notes={book.notes}
                    review={book.review}
                    readingStatus={book.readingStatus}
                  />
                )}
              </section>

              <BorrowRequestPanel
                bookId={book.id}
                availability={book.availability}
                user={user}
                borrowerLoan={borrowerLoan}
                ownerLoan={ownerLoan}
                previewing={previewing}
              />
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
              Book metadata and covers may come from Open Library or Google Books. Personal ownership stays in this catalog
              and is not inferred from the provider.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {metadataSources.map((source) => (
                <a key={`${source.label}:${source.href}`} href={source.href} target="_blank" rel="noreferrer" className="text-sm font-medium underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--coral)] hover:decoration-[var(--coral)]">
                  View {book.title} on {source.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
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
