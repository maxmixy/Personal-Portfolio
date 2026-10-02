# Personal Applications Guide

This guide covers the music, League, and book-library systems described in [BLUEPRINT.md](../BLUEPRINT.md). These are applications within a professional portfolio, not the homepage's primary content. Build them incrementally and do not imply a live integration until it works.

## Shared Requirements

Every external-data application needs loading, success, empty, error, stale-data, and rate-limit/unauthorized behavior as applicable. Keep secrets on the server, normalize provider responses, cache with an explicit freshness policy, and expose only data Yuri has chosen to share. Mobile layouts and keyboard accessibility are required.

## Music: Spotify

Route: `/music`.

Use Spotify OAuth and server-side API requests. Candidate scopes:

```text
user-top-read
user-read-recently-played
user-read-currently-playing
```

Build in increments:

1. Register/configure the Spotify application and callback URL.
2. Implement OAuth and secure server-side token handling.
3. Fetch top tracks and artists; support short-, medium-, and long-term ranges where the API permits.
4. Add recently played and optional currently playing data.
5. Add loading, authorization-expired, empty, and API-failure states.
6. Add caching and data freshness labels appropriate to each dataset.

Link Spotify content back to Spotify and include required attribution. Follow current Spotify platform policies; do not download or redistribute content or use Spotify content as AI training data. Treat listening history as personal data and publish only what Yuri intentionally shares.

## League: Riot Games

Route: `/league`.

Use Riot ID as the user-facing identity and resolve it to a PUUID through supported Account APIs. Do not build new player lookup around deprecated summoner-name workflows.

Possible data sources include Account, Summoner, Match-v5, League, Champion Mastery, and Data Dragon. Keep `RIOT_API_KEY` server-side. Cache profile/rank and match data at appropriate lifetimes and respect current regional rate limits.

Potential profile and match views:

- Riot ID, region, summoner level, profile icon, and ranked status.
- Recent matches with champion, result, KDA, duration, queue, date, and relevant item/spell data.
- Derived win rate, KDA, champion usage, CS, vision, damage, and duration statistics.
- Frequently encountered players derived from match participant data; describe this as an analysis, not a direct Riot friends/recent-players endpoint.

Use Data Dragon for static assets when suitable. Include the Riot Games disclaimer required by the current developer policy and verify its wording before launch. Provide clear states for unknown player, empty match history, API outage, authorization/configuration failure, and rate limiting.

## Library: Books

Routes: `/library` and `/library/[slug]`.

Begin with a public read-only catalog and owner-managed data. Add visitor authentication and social actions only after basic catalog behavior and authorization are stable.

A book may include:

```text
id, title, author, isbn, coverUrl, publisher, publicationYear,
genre, tags, description, acquiredAt, ownershipStatus, location,
readingStatus, createdAt, updatedAt
```

Reading states: Want to Read, Reading, Completed, Abandoned, and Re-reading.

Keep review data separate from a book because each review belongs to a user/book relationship:

```text
Review: id, bookId, userId, rating (1-5), content, spoiler,
createdAt, updatedAt
```

Recommendations should be their own records, with book, recommender, reason, date, and status. Suggested statuses: Suggested, Considering, Added, Reading, Completed, Declined. Defer AI recommendations until the base catalog and reading data are reliable.

Loans should reference the book and borrower rather than duplicating borrower contact details in every record. A loan can include requested, approved, borrowed, expected-return, and returned timestamps plus notes. The owner manually approves requests. Enforce permissions server-side and keep borrower identity, contact, and loan history private.

## Suggested Build Order

1. Read-only library catalog and book detail pages.
2. Owner-only create/update/delete workflow.
3. Database and authentication when the catalog needs durable shared management.
4. Reviews and recommendations with moderation/authorization.
5. Manual loan request and approval workflow.

Do not implement database, authentication, reviews, recommendations, or loans merely to demonstrate the technology. Each must solve a concrete user need.
