# Library Development Context

> This document defines the current implementation context, architecture, requirements, and immediate development priorities for the personal library portion of the portfolio website.

> **Purpose:** Give coding agents the minimum high-value context needed to implement and maintain the `/library` system without unnecessarily loading the entire portfolio specification.

---

## 0. Database Setup Status

The Library persistence layer is backed by Neon PostgreSQL 18.6.

**Local connection:** `DATABASE_URL` is loaded from the ignored local environment file. The connection is used only by the application process and is never committed.

**Schema:** `public`

The following tables are present and represented by the Drizzle schema:

- `books`
- `authors`
- `book_authors`

The table definitions are in [app/db/schema.ts](../app/db/schema.ts). The generated migration is [drizzle/0000_deep_wild_pack.sql](../drizzle/0000_deep_wild_pack.sql).

The application is wired to Drizzle's Node PostgreSQL driver through `pg`. Runtime connectivity is not confirmed by the current terminal execution context, so the live database must be checked with a command that returns visible output before this status is treated as operational.

The application must not rely on the external Open Library API as its source of truth for personal ownership or catalog persistence.

### Current persistence boundary

- **Open Library:** bibliographic metadata and candidate search results.
- **Local database:** canonical library records, author relationships, ownership context, reading status, and personal metadata.
- **Search response:** read-only external candidates.
- **Imported records:** persisted locally only after explicit user selection.

---

## 0.1 Current Progress — 2026-10-06

### Implemented

- The database client now uses `pg` with Drizzle's Node PostgreSQL driver and lazy initialization through `getDatabase()`.
- The existing `books`, `authors`, and `book_authors` schema is represented by the Drizzle schema and generated migration.
- Catalog reads now expose database-backed book listing, lookup by Open Library key, and author-name search.
- The Open Library search result model is normalized into a stable local record model.
- Selected candidate imports now use a server-side POST endpoint instead of only updating client state.
- Persistence is transactional: an existing book is reused, missing authors are created, and book-author relationships are inserted idempotently.
- The Library page now loads persisted records, displays an empty state, and reports catalog configuration errors without crashing the route.
- Persistence-focused model tests have been added for record transformation and required provider identity.
- VS Code diagnostics report no errors in the modified persistence files during the latest source review.

### Current verification status

- Source implementation: **in progress / implemented**.
- Editor diagnostics: **clean for the reviewed persistence files**.
- Focused persistence tests: **tests added; terminal execution output was not returned successfully**.
- ESLint: **terminal output unavailable; not claimed as passing**.
- Production build: **terminal output unavailable; not claimed as passing**.
- Live Neon connection: **not confirmed by the current terminal execution context**.
- Live database writes: **not confirmed**.

The persisted catalog should not be considered operational until a fresh database connection test returns the expected tables and a real import request completes successfully.

### Remaining work

1. Confirm the Neon `DATABASE_URL` and live PostgreSQL connection from a terminal that returns visible output.
2. Run the focused persistence tests and capture their pass/fail count.
3. Run the full lint and production build commands and capture explicit exit codes.
4. Verify a selected import creates a book, its author, and the join row.
5. Confirm duplicate imports remain idempotent.
6. Replace the initial card-based catalog with the intended bookshelf experience.
7. Implement the book detail route from persisted data.
8. Continue with reading status, ownership, and future borrowing metadata.

---

## 1. Feature Identity

**Feature:** Personal Book Library

**Primary routes:**

```text
/library
/library/[slug]
```

The library is a personal catalog of books owned by the site owner.

The application is the **source of truth for ownership and personal library information**.

Open Library is an external metadata provider used to retrieve and enrich book information.

The library should eventually support:

* Personal book collection
* Book metadata
* Book covers
* Reading status
* Personal ratings
* Personal notes
* Personal reviews
* Recommendations
* Book borrowing / lending
* Borrower accounts
* Loan history

Not all functionality needs to be implemented at once.

---

# 2. Current Development Goal

The immediate goal is to build the **core library catalog**.

### Current priority

1. Confirm the Neon PostgreSQL schema and runtime connection.
2. Establish and verify the library data model.
3. Implement Open Library integration.
4. Implement bulk book addition.
5. Store normalized book metadata locally.
6. Add database-backed catalog reads and author lookups.
7. Verify transactional writes and duplicate handling.
8. Build the bookshelf-style `/library` interface.
9. Build individual book detail pages.
10. Establish the foundation for the borrowing system without prematurely implementing unrelated social features.

The persistence layer is now implemented at the source-code level. The remaining priority is live verification and connection validation before the catalog can be treated as operational.

The visual centerpiece of `/library` should be a **bookshelf composed of book spines** rather than a conventional grid of book cards.

---

# 3. Open Library Integration

## 3.1 Provider

Primary external metadata provider:

**Open Library**

Documentation:

https://openlibrary.org/developers/api

Relevant APIs:

* Search API
* Work API
* Edition API
* ISBN API
* Covers API

The Search API is the preferred starting point because it can return multiple books in one request and provides both work-level and edition-level information.

---

## 3.2 Ownership vs External Metadata

Open Library does **not** determine which books the site owner personally owns.

The application must maintain ownership locally.

Conceptually:

```text
                    ┌─────────────────────┐
                    │     My Library      │
                    │                     │
                    │  Ownership          │
                    │  Reading status     │
                    │  Rating             │
                    │  Notes              │
                    │  Reviews            │
                    │  Loans              │
                    └──────────┬──────────┘
                               │
                               │ enrich
                               ▼
                    ┌─────────────────────┐
                    │    Open Library     │
                    │                     │
                    │  Title              │
                    │  Author             │
                    │  Edition            │
                    │  Publisher          │
                    │  ISBN               │
                    │  Publication date   │
                    │  Cover              │
                    └─────────────────────┘
```

The site should **store the selected Open Library identifiers and metadata locally** rather than relying on Open Library for every page render.

---

# 4. Book Identity

Books should preferably be represented at the **edition level** when possible.

A Work represents the general intellectual work.

An Edition represents a particular publication and can contain:

* ISBN
* Publisher
* Publication date
* Edition information
* Cover
* Other edition-specific metadata

Open Library explicitly distinguishes Works from Editions.

This distinction matters because the owner physically owns a particular edition.

### Preferred identifiers

Use, where available:

1. ISBN-13
2. ISBN-10
3. Open Library Edition ID
4. Open Library Work ID

ISBN should not be assumed to always exist.

---

# 5. Suggested Library Book Model

The exact persistence technology should follow the existing project architecture.

Conceptually:

```ts
type LibraryBook = {
  id: string;
  slug: string;

  // Open Library identity
  openLibraryWorkId?: string;
  openLibraryEditionId?: string;

  // Bibliographic data
  title: string;
  subtitle?: string;
  authors: string[];

  isbn10?: string;
  isbn13?: string;

  publisher?: string;
  publishDate?: string;
  editionName?: string;
  language?: string;

  // Cover
  coverId?: number;
  coverUrl?: string;

  // Personal library data
  owned: boolean;

  readingStatus:
    | "want-to-read"
    | "reading"
    | "completed"
    | "abandoned"
    | "re-reading";

  rating?: number;
  notes?: string;
  review?: string;

  // Library organization
  addedAt: string;
  updatedAt: string;

  // Lending
  loanStatus:
    | "available"
    | "reserved"
    | "on-loan"
    | "lost";
};
```

This is a conceptual model. Do not implement every field immediately if the current feature does not require it.

---

# 6. Bulk Add System

## 6.1 Goal

Provide an administrative/library-management function allowing multiple books to be added to the personal collection efficiently.

The intended workflow:

```text
User enters multiple books
        ↓
Search Open Library
        ↓
Return candidate matches
        ↓
User reviews matches
        ↓
User selects correct editions
        ↓
Normalize metadata
        ↓
Preview books
        ↓
Confirm import
        ↓
Store books locally
```

The system should **not blindly import the first search result**.

Edition selection is important because multiple editions of the same work may exist.

---

## 6.2 Input Methods

The first implementation should support bulk entry using a simple list.

Example:

```text
The Secret History — Donna Tartt
Norwegian Wood — Haruki Murakami
Dune — Frank Herbert
```

Each entry should be parsed into:

```ts
{
  title: string;
  author?: string;
}
```

ISBN-based input should also be supported where practical:

```text
9780141185064
9780679732761
9780441172719
```

Future input methods may include CSV import or a more sophisticated management interface, but these are not required for the initial implementation.

---

# 7. Open Library Search Strategy

When searching by title and author, prefer explicit search parameters where appropriate.

Examples:

```text
/search.json?title=...
/search.json?author=...
```

or a combined query using `q`.

The Search API supports pagination and limiting results.

Example conceptual request:

```ts
const params = new URLSearchParams({
  title,
  author,
  limit: "10",
});
```

The application should request only the fields required for the library.

Avoid requesting `fields=*` unnecessarily because Open Library notes that this can result in expensive responses.

---

# 8. Match Selection

Search results should be presented to the user before committing a book.

Example:

```text
┌─────────────────────────────────────────────┐
│ The Secret History                          │
│ Donna Tartt                                 │
│                                             │
│ 1992 · Alfred A. Knopf                      │
│ ISBN-13: ...                                │
│                                             │
│ [Cover]                     [Select]        │
└─────────────────────────────────────────────┘
```

Potential result indicators:

* Title
* Author
* Publication year
* Publisher
* ISBN
* Edition
* Cover

The user should be able to choose the correct edition.

---

# 9. Bulk Import Preview

Before committing imported books, show a confirmation state.

Example:

```text
IMPORT PREVIEW

5 books found
4 ready to import
1 needs review

✓ The Secret History
✓ Norwegian Wood
✓ Dune
✓ The Hobbit

⚠ Unknown / ambiguous match
    [Review]

[Cancel] [Import 4 Books]
```

The system should not silently add ambiguous or obviously incorrect matches.

---

# 10. Metadata Storage

Once a book is confirmed, store the relevant metadata locally.

Do not depend on Open Library being queried every time `/library` loads.

Recommended stored external identifiers:

```text
openLibraryWorkId
openLibraryEditionId
isbn10
isbn13
coverId
```

This allows the application to retain a stable relationship with the external source.

---

# 11. Covers

Open Library provides a dedicated Covers API.

For public-facing pages, Open Library recommends referencing the cover URL directly rather than downloading and redistributing the cover images.

Example:

```text
https://covers.openlibrary.org/b/isbn/{ISBN}-M.jpg
```

Available sizes:

```text
S = Small
M = Medium
L = Large
```

The Covers API also supports Open Library IDs and Cover IDs.

Prefer:

```text
OLID / Cover ID
```

when a stable identifier is available.

---

# 12. API Usage Rules

Open Library should be treated as an external metadata service, not as the application's database.

Important constraints:

* Cache responses where possible.
* Identify the application with a `User-Agent`.
* Include contact information where appropriate.
* Avoid making hundreds of individual requests.
* Use the Search API for multi-book lookup where practical.
* Do not bulk-download Open Library's catalog through the API.
* Do not build high-traffic infrastructure around the API.

Open Library currently documents a default rate limit of approximately 1 request/second, with identified applications receiving a higher limit.

### Important interpretation of "Bulk Add"

"Bulk Add" means:

> **The owner provides a bounded list of books and the application assists in importing those books.**

It does **not** mean:

> Download thousands/millions of Open Library records.

For large-scale catalog ingestion, Open Library directs developers toward its monthly data dumps rather than API harvesting.

---

# 13. Library Homepage

## Primary visual concept

The main `/library` page should resemble a **physical bookshelf**.

Instead of:

```text
[Book Card] [Book Card] [Book Card]
[Book Card] [Book Card] [Book Card]
```

use:

```text
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  MY LIBRARY                                                │
│                                                           │
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃             │
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃             │
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃             │
│  ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃ ┃             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

Each book is represented by a **vertical book spine**.

---

# 14. Book Spine Design

Each spine should communicate enough information to make the bookshelf visually useful.

Possible information:

* Book title
* Author
* Optional small metadata
* Spine color derived from available cover metadata or a deterministic visual treatment

The exact visual treatment should follow the existing portfolio design system.

Do not introduce generic "library UI" styling that conflicts with the site's existing editorial/technical aesthetic.

---

# 15. Hover Interaction

When the user hovers over a book spine:

```text
                 ┌─────────────────────────┐
                 │                         │
                 │        COVER            │
                 │                         │
                 │                         │
                 ├─────────────────────────┤
                 │ The Secret History      │
                 │ Donna Tartt             │
                 │ 1992                    │
                 │                         │
                 │ Completed               │
                 │ ★★★★★                   │
                 │                         │
                 │ View book →             │
                 └─────────────────────────┘
                          ↑
                       hover card
```

The hover card should provide a quick overview without requiring navigation.

Potential information:

* Cover
* Title
* Author
* Publication year
* Reading status
* Rating
* Short personal metadata
* "View book" action

---

# 16. Hover / Accessibility Requirements

Hover must **not** be the only way to access book information.

The interaction must work for:

* Mouse users
* Keyboard users
* Touch/mobile users

Possible behavior:

```text
Desktop:
Hover / focus → preview card

Keyboard:
Focus → preview card

Mobile:
Tap → preview / book details
```

Do not depend exclusively on CSS `:hover`.

The interaction should also respect the site's existing reduced-motion conventions.

---

# 17. Responsive Bookshelf

The bookshelf should adapt to viewport size.

Desktop:

```text
Many spines across each shelf
```

Tablet:

```text
Fewer spines
More rows
```

Mobile:

```text
Smaller bookshelf sections
Potential horizontal scrolling or carefully structured rows
```

Do not allow the bookshelf to create unintended horizontal page overflow.

The existing portfolio's responsive behavior and design system remain authoritative.

---

# 18. Book Detail Route

Each book should eventually have:

```text
/library/[slug]
```

The detail page should provide more complete information.

Potential structure:

```text
[Cover]

THE SECRET HISTORY
Donna Tartt

1992
Alfred A. Knopf
ISBN

Reading Status
Completed

Rating
★★★★★

Notes
...

Review
...

────────────────────────────

Library Information

Added:
...

Availability:
Available

[Borrow this book]
```

The exact content should grow incrementally.

---

# 19. Reading Status

Supported reading statuses:

```text
Want to Read
Reading
Completed
Abandoned
Re-reading
```

These are personal library metadata and should be stored independently from Open Library.

Open Library's data should never overwrite personal reading state.

---

# 20. Borrowing System

The library is intended to eventually allow books to be borrowed by authenticated users.

The borrowing system is **not simply a public "mark as borrowed" button**.

A borrower must request the book and the owner must approve the request.

### Core workflow

```text
Available
   ↓
Loan Request
   ↓
Owner Approval
   ↓
Reserved
   ↓
On Loan
   ↓
Returned
```

The owner may reject a request.

---

# 21. Loan Record

The normalized loan model should use the authenticated user's identity.

Conceptually:

```ts
type Loan = {
  id: string;

  bookId: string;
  borrowerId: string;

  requestedAt: string;
  approvedAt?: string;
  borrowedAt?: string;

  expectedReturnAt?: string;
  returnedAt?: string;

  notes?: string;
};
```

Borrower contact information should remain on the authenticated User record rather than being unnecessarily duplicated in every loan.

Loan records are private.

---

# 22. Loan States

Core states:

```text
Requested
Approved
Reserved
On Loan
Returned
```

The book's high-level availability can be represented as:

```text
Available
Reserved
On Loan
Lost
```

The loan record and book availability should not be treated as the exact same concept.

---

# 23. Borrowing Permissions

Important rule:

> Arbitrary users cannot mark a book as loaned.

The owner must control approval.

Expected workflow:

```text
Borrower
   │
   │ Request
   ▼
Loan Request
   │
   │ Owner reviews
   ▼
Approved / Rejected
   │
   ▼
Reserved
   │
   │ Book physically given
   ▼
On Loan
   │
   │ Returned
   ▼
Returned
```

This prevents the public interface from falsely claiming that a physical book has been borrowed.

---

# 24. Borrowing UI

A book that is available may eventually show:

```text
Available

[Request to Borrow]
```

A book that is already reserved:

```text
Reserved
```

A book currently loaned:

```text
On Loan
Expected return:
October 20, 2026
```

Only authorized users should see private loan details.

---

# 25. Borrowing System Scope

The borrowing system should be implemented **after the core library catalog is functional**.

Do not prematurely implement:

* User accounts
* Reviews
* Recommendations
* Loans
* Advanced social features

unless they are explicitly part of the current task.

The current library development priority is the catalog, Open Library integration, bulk addition, bookshelf UI, and book detail pages.

---

# 26. Recommended Development Sequence

## Phase 1 — Data Foundation

* Define `LibraryBook`.
* Determine persistence strategy.
* Define Open Library identifiers.
* Define slug generation.
* Define reading status.
* Define availability state.

## Phase 2 — Open Library Integration

* Build Open Library search service.
* Support title + author queries.
* Support ISBN lookup.
* Normalize search results.
* Handle missing metadata.
* Handle missing covers.
* Cache metadata appropriately.

## Phase 3 — Bulk Add

* Build bulk input interface.
* Parse title/author entries.
* Query Open Library.
* Display candidate matches.
* Allow edition selection.
* Preview selected books.
* Confirm import.
* Persist selected books.

## Phase 4 — Bookshelf

* Build bookshelf container.
* Build book spine component.
* Render books dynamically.
* Implement shelf rows.
* Implement responsive layout.
* Implement hover/focus preview card.
* Implement mobile interaction.

## Phase 5 — Book Details

* Implement `/library/[slug]`.
* Display complete stored metadata.
* Display cover.
* Display reading status.
* Display rating/notes when available.
* Add Open Library reference where appropriate.

## Phase 6 — Borrowing Foundation

* Define authenticated users.
* Define Loan model.
* Implement request workflow.
* Implement owner approval.
* Implement reservation.
* Implement active loan.
* Implement return recording.

## Phase 7 — Personal Features

Later:

* Reviews
* Recommendations
* Reading analytics
* Loan history
* Additional library organization

---

# 27. Component Direction

Potential reusable components:

```text
app/
└── library/
    ├── page.tsx
    ├── [slug]/
    │   └── page.tsx
    │
    └── components/
        ├── Bookshelf.tsx
        ├── Shelf.tsx
        ├── BookSpine.tsx
        ├── BookPreview.tsx
        ├── BookCover.tsx
        ├── LibraryFilters.tsx
        ├── BulkBookImport.tsx
        ├── BookSearchResult.tsx
        └── BookImportPreview.tsx
```

The exact structure should follow the existing application's component philosophy.

Avoid unnecessary abstraction.

---

# 28. Visual Direction

The library should feel like a **personal collection**, not a generic bookstore.

The existing portfolio visual direction remains authoritative:

* Clean
* Technical
* Editorial
* Slightly experimental
* Typography-driven
* Spacious
* Structured

Avoid:

* Generic ecommerce cards
* Excessive rounded cards
* Neon "developer" aesthetics
* Heavy gradients
* Glassmorphism
* Decorative effects without purpose
* Excessive animation

The bookshelf itself should become a visual identity element of the `/library` route.

---

# 29. Data Integrity Rules

When importing books:

1. Never invent metadata.
2. Never silently choose an ambiguous edition.
3. Preserve Open Library identifiers.
4. Preserve personal metadata separately from external metadata.
5. Do not overwrite personal reading status from API responses.
6. Do not overwrite personal notes or reviews during metadata refresh.
7. Handle missing ISBNs.
8. Handle missing covers.
9. Handle multiple authors.
10. Handle duplicate imports.

---

# 30. Duplicate Detection

A book should not be duplicated merely because the same work was searched twice.

Preferred matching hierarchy:

```text
ISBN-13
↓
ISBN-10
↓
Open Library Edition ID
↓
Open Library Work ID
↓
Title + Author
```

Edition identity should take precedence over title-only matching.

If a user owns multiple editions of the same work, they should remain representable as separate physical library entries.

---

# 31. External Metadata Refresh

Metadata refresh should be deliberate.

Potential refreshable fields:

* Title
* Author
* Publisher
* Publication date
* ISBN
* Cover
* Open Library identifiers

Personal fields should never be overwritten:

* Reading status
* Rating
* Notes
* Review
* Loan information

---

# 32. Open Library Attribution

Because the library uses Open Library metadata and covers, provide an appropriate attribution/reference to Open Library.

The Open Library Covers API documentation specifically recommends a courtesy link back to Open Library when displaying covers publicly.

A possible implementation is:

```text
Book metadata and covers via Open Library
```

with a link to the relevant Open Library book page where practical.

---

# 33. Current Definition of Done

The initial library implementation is complete when:

* Books can be stored locally.
* Books can be searched through Open Library.
* Title + author searches work.
* ISBN lookup works where applicable.
* Search results can be reviewed.
* Correct editions can be selected.
* Multiple books can be imported in one operation.
* Duplicate imports are handled.
* Book metadata is persisted.
* Covers display correctly.
* `/library` renders the collection as a bookshelf.
* Book spines are responsive.
* Hover/focus previews work.
* Mobile interaction remains usable.
* `/library/[slug]` displays individual book information.
* No existing portfolio routes are broken.
* Existing design-system conventions are preserved.
* Accessibility behavior is reasonable.
* Reduced-motion behavior is respected.
* No unnecessary dependencies are introduced.
* API usage remains within Open Library's intended usage model.
* Build and lint checks pass.

The persistence source changes are implemented, but the live database and final build/lint checks remain open until the required terminal verification is completed and recorded.

---

# 34. Out of Scope for Initial Library Implementation

Do not proactively implement:

* Spotify integration
* League integration
* AI book recommendations
* Reading analytics
* Music analytics
* Gaming analytics
* `/now`
* `/notes`
* `/lab`
* Social reviews
* Advanced recommendation systems
* Book loans unless explicitly requested as the current task
* User accounts unless required as a dependency of the borrowing implementation

These belong to later development stages.

---

# 35. Current Mission

> Build a visually distinctive personal bookshelf that turns the portfolio's library into a real, data-backed collection while keeping external book metadata, personal information, and future borrowing functionality cleanly separated.

The first milestone is:

```text
Open Library
     ↓
Search
     ↓
Select correct editions
     ↓
Bulk import
     ↓
Local library data
     ↓
Bookshelf UI
     ↓
Book detail pages
```

The borrowing system should build on this foundation rather than being tightly coupled to Open Library.
