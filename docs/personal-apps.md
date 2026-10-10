# Personal Applications Guide

This guide covers the music, League, and book-library systems described in [BLUEPRINT.md](../BLUEPRINT.md). These are applications within a professional portfolio, not the homepage's primary content. Build them incrementally and do not imply a live integration until it works.

## Shared Requirements

Every external-data application needs loading, success, empty, error, stale-data, and rate-limit/unauthorized behavior as applicable. Keep secrets on the server, normalize provider responses, cache with an explicit freshness policy, and expose only data Yuri has chosen to share. Mobile layouts and keyboard accessibility are required.

## Music: Spotify

Route: `/music`.

The page publicly displays only Yuri’s Spotify listening data. Site visitors do not connect accounts and no visitor listening data is fetched. The owner authorizes one Spotify account through an owner-only setup flow; Spotify credentials stay on the server.

Use Spotify OAuth and server-side API requests. The initial scope is:

```text
user-top-read
```

Build in increments:

1. Register/configure the Spotify application and callback URL.
2. Apply the Spotify dashboard database migration and configure the owner key and token-encryption key.
3. Authorize Yuri’s Spotify account from `/music?owner=1`.
4. Fetch top tracks and artists; support short-, medium-, and long-term ranges where the API permits.
5. Keep public snapshots in a short-lived cache with a stale-data fallback.
6. Add recently played and optional currently playing data if Yuri chooses to publish them.

Link Spotify content back to Spotify and include required attribution. Follow current Spotify platform policies; do not download or redistribute content or use Spotify content as AI training data. The selected top-track and top-artist data is intentionally public. Do not add listening history or other private data to the public response without explicit owner approval.

### Implementation status — 2026-10-10

The owner-connected public dashboard is implemented:

- Spotify Authorization Code flow with a state check and server-only client credentials.
- The owner-only setup form at `/music?owner=1` protects OAuth connection and disconnection with `SPOTIFY_OWNER_KEY` and requires explicit confirmation that top tracks and artists will be public.
- Access and refresh tokens are encrypted with `SPOTIFY_TOKEN_ENCRYPTION_KEY` and stored in the server database; tokens are never sent to clients.
- Top tracks and artists are shown for short-, medium-, and long-term ranges.
- A public server cache refreshes selected data every ten minutes when requested, falls back to a stale snapshot during outages, and deletes snapshots after seven days without refresh.
- The UI includes setup, empty, provider failure, rate-limit, stale-data, and owner reconnect states.
- Spotify links are provided for displayed tracks and artists.

Set `DATABASE_URL`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, `SPOTIFY_TOKEN_ENCRYPTION_KEY`, and `SPOTIFY_OWNER_KEY` in the server environment. Generate the two keys independently with long random values. The migration has been applied to the Neon database currently configured for local development; apply [the Spotify dashboard migration](../database/0001_spotify_public_dashboard.sql) to any other database. For local development, register `http://127.0.0.1:3000/music/api/callback` as the redirect URI and set the same value in `SPOTIFY_REDIRECT_URI`; open the site at `http://127.0.0.1:3000` so the OAuth state cookie uses the matching host. Spotify requires HTTPS outside loopback development and does not accept `localhost` as a redirect URI. The callback path is `/music/api/callback`. Visit `/music?owner=1`, enter `SPOTIFY_OWNER_KEY`, confirm public sharing, and approve the Spotify consent screen to start publishing. The published data and owner data handling are described in the [privacy notice](/privacy).

Recent plays and currently playing data remain future increments. OAuth and live data still need verification with Spotify credentials. Spotify development-mode setup requires the developer app owner to have Premium and only allowlisted Spotify accounts can authorize; the owner’s account must be allowlisted.

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
