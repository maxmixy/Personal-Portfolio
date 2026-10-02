# Technical Architecture Guide

This document turns the stack, route, server, data, and deployment requirements in [BLUEPRINT.md](../BLUEPRINT.md) into implementation guidance.

## Stack and Repository Reality

The project uses Next.js App Router, React, TypeScript, and Tailwind CSS. The current repository uses `app/` directly; it does not currently use the `src/` prefix. The tree in the master blueprint is a possible future organization, not a migration requirement. Grow the existing structure incrementally and follow the installed Next.js version's local documentation before introducing framework APIs.

Current top-level areas include:

```text
app/
  page.tsx
  layout.tsx
  globals.css
  components/
public/
```

The `/components` route is a development sheet. Add route folders only when their functionality is ready.

## Route Plan

Professional routes:

```text
/
/about
/projects
/projects/[slug]
/experience
/skills
/achievements
/contact
```

Personal application routes:

```text
/music
/league
/library
/library/[slug]
```

Future routes such as `/now`, `/notes`, and `/lab` are optional. Do not add placeholder pages that imply functionality exists when it does not.

## Server Boundary

Keep private credentials and external API access on the server:

```text
Browser
  -> Next.js route/server component
  -> external API or database
  -> normalized, intentionally public data
  -> browser
```

Server-side code owns OAuth exchanges, secret-bearing requests, validation, data normalization, authorization, caching, and rate-limit handling. Client components should receive only the data needed to render and interact.

Create API routes, server actions, or database adapters when a feature needs them; do not scaffold empty routes in advance.

## Data and Content Organization

Portfolio content can remain static until an editing workflow or user interaction justifies persistence. As case studies grow, separate project data from rendering, for example under a `content/projects/` directory appropriate to the actual repository layout.

The book catalog eventually needs persistence. Keep books, reviews, recommendations, users, and loans as distinct entities when they have separate ownership, relationships, or lifecycle. See [personal-apps.md](personal-apps.md) for the book data model and access rules.

Do not introduce PostgreSQL, Supabase, Neon, or another database until the library or another feature needs durable data. Choose a provider based on hosting, operational needs, and migration/backup support.

## Environment and Secrets

Use local environment configuration such as `.env.local` for development and ensure it is excluded from version control. Potential server-only values include:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
RIOT_API_KEY
DATABASE_URL
AUTH_SECRET
```

Never commit credentials and never expose server-only values via `NEXT_PUBLIC_*`. Validate required configuration on the server and provide a useful unavailable/error state when an integration is not configured.

## Caching

Choose cache lifetimes based on freshness, privacy, and external rate limits:

- Spotify recent listening: short-lived; top tracks/artists: longer-lived; currently playing: very short-lived or uncached.
- Riot profile/rank: medium-lived; match history: short/medium-lived; static game assets: long-lived.
- Library: optimize database queries first and cache only when there is a clear benefit.

Keep cache keys scoped to the correct account/region and avoid sharing private user data across visitors. Make stale data and refresh behavior understandable to users.

## Privacy and Authorization

Treat listening history, Riot identifiers, player names, reviews, borrower data, email, authentication information, and loan history as potentially sensitive. Display only information Yuri intends to make public.

Loan records must not be public. Visitors must not be able to mark books as loaned or alter owner-controlled data without authorization. Keep email and authentication data private. Apply authorization on the server, not only by hiding controls in the UI.

## Hosting and Operations

Hostinger is the current hosting target. Confirm the chosen Hostinger plan supports the required Node.js/Next.js runtime and deployment mode before relying on server features. Keep a database or external service independently deployable where practical. Never add secrets to source control or static client output.

## Architecture Checklist

- New behavior fits the existing App Router structure and installed Next.js version.
- Server-only credentials and data access stay on the server.
- API data is normalized before UI components depend on it.
- Caching and authorization account for user identity and region.
- External failures, missing configuration, and rate limits have defined behavior.
- Persistent storage is added only to support a real product requirement.
