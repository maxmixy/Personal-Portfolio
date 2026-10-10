# Library Development Context

> Current architecture, behavior, constraints, and remaining work for the portfolio's /library feature.

Last reviewed: 2026-10-10

## Overview

The library is a personal catalog. The local application database is the source of truth for owned editions, reading state, personal metadata, availability, and loans. Open Library and Google Books provide bibliographic search candidates and metadata; they do not define ownership.

Primary routes:

- /library — searchable, filterable bookshelf and owner catalog tools.
- /library/[slug] — locally stored book details and availability.
- /library/account — account creation, sign-in, verification, and account actions.

## Current status

The owner confirmed the live database migrations, provider search/import, account setup, and borrowing lifecycle on 2026-10-10. This terminal cannot independently connect to Neon. The most recent production build attempt could not download Geist fonts from Google Fonts; rerun the build in an environment with access or after self-hosting those fonts.

Implemented:

- Neon PostgreSQL persistence through Drizzle and the Node pg driver.
- Edition-aware catalog records, author relationships, local reading status, ratings, notes, and reviews.
- Open Library and Google Books search, normalized candidates, edition selection, bulk import, and additional-result pagination.
- Idempotent transactional imports and provider identifiers stored independently.
- Bookshelf layout with responsive, width-measured rows, sorting, search, reading-status filters, spine previews, and book detail pages.
- Neon Managed Better Auth email/password accounts with verification-code entry.
- Borrower requests and owner-controlled approve/reject, reservation, handover, and return actions.
- Owner-only role preview for public, borrower, and owner views. Preview mode changes presentation only; authorization uses the actual session role.

## Persistence and identity

Schema: public. Drizzle schema: [app/db/schema.ts](../app/db/schema.ts).

Tables:

- books, authors, book_authors — catalog, authors, and relationships.
- book_provider_identifiers — external provider IDs, including Google Volume IDs.
- library_users — app profile and role linked to the Neon auth user ID.
- book_loans — private borrowing records linked to local library profiles.

Migrations are in [drizzle](../drizzle/):

- 0000_deep_wild_pack.sql
- 0001_library_reading_status.sql
- 0002_library_editions_personal_metadata.sql
- 0003_library_accounts_loans.sql
- 0004_neon_managed_auth.sql
- 0005_book_provider_identifiers.sql

Neon Managed Better Auth owns credentials and sessions in its managed neon_auth schema. The app must not store passwords or create a parallel session system. New accounts receive the borrower role. The owner role is assigned in the database to the intended account; never grant it from public registration. Keep DATABASE_URL, NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET, and GOOGLE_BOOKS_API_KEY in ignored local or deployment environment configuration. Never expose secrets through client-prefixed variables.

## Data boundaries and integrity

- Search results are external, read-only candidates until the owner explicitly selects and imports them.
- Persist selected metadata locally; catalog page rendering must not depend on provider availability.
- Keep Open Library work/edition IDs and Google Books volume IDs in their respective fields/tables. Never put a Google ID in openLibraryKey.
- Prefer edition identity. Match duplicates by ISBN-13, ISBN-10, provider edition/volume ID, then Open Library work ID only where edition identity is unavailable. Keep separate editions when they represent distinct physical copies.
- Cross-provider records may be reused when exact ISBN evidence is compatible. Do not merge on title/author similarity alone.
- Fill missing catalog metadata during import without replacing existing non-empty values. Preserve personal reading status, rating, notes, review, and loan state during metadata updates.
- Handle missing ISBNs, covers, publication details, and multiple authors without inventing values.

Reading statuses are want-to-read, reading, completed, abandoned, and re-reading. Book availability is separate from loan state: availability is available, reserved, on-loan, or lost.

## Provider search and bulk import

Providers: [Open Library API](https://openlibrary.org/developers/api) and Google Books Volumes API.

The owner can search by title, ISBN, or author and review candidates before importing. Bulk entry supports multiple lines and paginated additional candidates per entry. Author-only searches must use provider author filters; do not turn them into unrestricted text searches that return books about the author. Google Books requests use the server-side GOOGLE_BOOKS_API_KEY.

Provider requests are server-side, bounded, cached where appropriate, and independently error-tolerant. Keep bulk lookup bounded and avoid catalog-scale harvesting. Preserve provider identifiers and link to known provider records from book details. Give appropriate Open Library attribution when displaying its metadata or covers.

## Bookshelf interaction and accessibility

- Render the collection as book spines, with rows sized to the available container width and no unintended horizontal page overflow.
- Search and reading-status filters compose with sorting by title, author, or rating.
- Desktop hover and keyboard focus show a preview beside the cursor or focused spine. The card is viewport-bounded and sized dynamically.
- On touch screens, tapping a spine selects it and scrolls its preview above the shelves. Tapping that same spine again quickly opens its detail page.
- Desktop double-click opens book details. Enter on a focused spine also opens details; arrow keys move between spines.
- Reduced-motion preferences must be respected. Hover must not be the only way to inspect or open a book.

## Accounts, permissions, and loans

Neon Managed Better Auth provides email/password identity and code-based email verification. The app links verified identities to library_users profiles. Do not build clickable email verification around an SMTP server unless the auth setup changes.

- Public visitors can browse public catalog data and high-level availability.
- Borrowers can request available books and see their own private loan details.
- The owner can manage catalog imports and personal metadata, review requests, and perform loan state transitions.
- Loan details are private to the borrower and owner. Do not expose borrower contact data or loan history publicly.
- A borrower cannot mark a book as borrowed. The owner approves or rejects requests, reserves approved books, records physical handover, and records returns.
- Keep role preview cosmetic; server-side checks must always use the authenticated user's actual role.

Loan progression: request → owner approval/rejection → reservation → handover/on loan → return. Keep each loan's state distinct from the book's high-level availability.

## Visual direction

Treat the library as a personal collection, not a bookstore. Follow the portfolio's clean, editorial, typography-led style. Avoid generic ecommerce cards, excess rounded panels, heavy gradients, glass effects, and animation without purpose.

## Verification and remaining work

The owner confirmed live database and workflow checks. Focused provider/library tests, TypeScript, and ESLint were reported passing during the implementation work. The production build remains to be rerun where Geist font downloads succeed (or after the fonts are self-hosted).

Before changing persistence or auth, inspect the Drizzle schema and migrations. For provider changes, preserve the normalized candidate model and duplicate rules above. Do not apply migrations to a live database without an explicit task to do so.

Future work, if requested, may include deeper personal reading analytics, recommendations, and expanded loan history. These are not prerequisites for the existing catalog and borrowing flow.
