# Development Workflow and Roadmap

This guide consolidates the Git workflow, validation expectations, scope controls, and implementation status from [BLUEPRINT.md](../BLUEPRINT.md).

## Git Workflow

Keep `main` integrated and reasonably stable. Work on focused branches with descriptive prefixes:

```text
feature/
fix/
refactor/
chore/
docs/
```

Typical flow:

```bash
git switch main
git pull origin main
git switch -c feature/short-description
```

Before opening a pull request:

```bash
git status
npm run lint
npm run build
```

Then review the diff, stage only intended files, commit with a specific message, and push the branch. Use a pull request to describe what changed, why, what was tested, and known limitations. After merge, update `main` and remove the completed branch. Do not commit secrets or unrelated user changes.

Good commit subjects describe the result, for example `Add reusable project card component` or `Fix mobile navigation overflow`.

## Local Development and Validation

Available project scripts:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

For UI changes, also inspect the actual desktop and mobile layouts, check keyboard focus and reduced-motion behavior where relevant, and verify no horizontal overflow. For external integrations, test loading, empty, error, stale, unauthorized, and rate-limited states without exposing credentials.

Read the repository's `AGENTS.md` and the installed Next.js documentation for the relevant APIs before making framework changes. Use the existing project structure and conventions.

## Implementation Sequence

### Phase 1: Design System

Refine typography, tokens, spacing, container, navigation, footer, buttons, badges, section headings, project cards, and responsive behavior. Validate reusable components in `/components`, then against real page content.

### Phase 2: Professional Portfolio

Implement `/about`, `/projects`, `/projects/[slug]`, `/experience`, `/skills`, `/achievements`, and `/contact`. Complete case studies for Waste-To-Worth and the internship before adding secondary projects. See [portfolio-content.md](portfolio-content.md).

### Phase 3: Spotify

The current Spotify implementation is a public dashboard of the owner's Spotify data. Visitors do not authorize Spotify. See [personal-apps.md](personal-apps.md) for the owner setup, database migration, refresh, and privacy boundary.

Implement OAuth, server-only credentials, top artists/tracks, recently played, optional currently playing, attribution, caching, and failure states.

### Phase 4: League

Implement Riot ID lookup, profile/rank, recent matches, match statistics, champion data, derived recently-played-with analysis, caching, rate limits, and the required disclaimer.

### Phase 5: Library

Start with a basic catalog and book details. Add database, authentication, reviews, recommendations, and loans incrementally. See [personal-apps.md](personal-apps.md).

### Phase 6: Polish

Review accessibility, SEO, performance, mobile behavior, motion, loading/error/empty states, visual consistency, privacy, and security.

## Scope Priority

P0 is the professional portfolio: homepage, projects and case studies, experience, about, skills, achievements, contact, responsive behavior, accessibility, SEO, and performance.

P1 is the personal applications: Spotify, League, and a basic library.

P2 is user accounts and social actions: reviews, recommendations, and loans.

P3 is experimental work: AI book recommendations, analytics, `/now`, notes, lab projects, and interactive experiments.

Prefer a few complete, polished experiences over many unfinished features. Do not build a feature solely because it is technically possible.

## Recorded Status

The master blueprint records the following completed as of 2026-10-03: responsive homepage and professional identity; project and experience previews; profile/leadership and closing sections; homepage visual foundation and metadata; Waste-To-Worth pilot results and internship runtime improvement; initial reusable components and component sheet; production build, scoped lint, and desktop/mobile overflow checks.

Still outstanding in that status record: dedicated portfolio routes and full case studies; skills and achievements pages; a real contact method; homepage personal-interest preview; Spotify, League, and library systems; database and authentication; and final accessibility, SEO, and performance passes.

Treat status as a dated snapshot. Update it when work is verified, and distinguish implemented behavior from planned design.

## Pull Request Checklist

- Change is focused and follows repository instructions.
- User-facing content and metrics are accurate and authorized.
- `npm run lint` and `npm run build` pass, or blockers are stated.
- Relevant desktop/mobile behavior and keyboard interaction are checked.
- API credentials and private user data remain server-side.
- No unrelated or pre-existing edits were reverted.
- Blueprint status and documentation links are updated when project scope changes.
