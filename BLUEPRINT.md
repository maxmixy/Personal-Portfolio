# Yuri Morrison — Portfolio Blueprint

## 1. Project Overview

A personal portfolio and interactive personal dashboard for Yuri Morrison.

The website serves two primary purposes:

1. Present Yuri as a Software / AI Engineer with supporting strengths in project coordination, leadership, and technical communication.
2. Provide a functional, personal space that reflects Yuri's interests in music, games, books, and technology.

The website should feel like a real software product rather than a conventional resume website.

The professional portfolio remains the primary purpose of the site. Hobby-related functionality should complement the portfolio and demonstrate engineering ability without overwhelming the professional content.

---

# 2. Core Positioning

## Primary Identity

Software / AI Engineer

## Supporting Identity

Project Coordinator / Technical Project Contributor / Technical Leader

## Core Message

> I build software, understand how systems fit together, and can help people move projects from ideas to working products.

The website should demonstrate:

- Software engineering
- AI / intelligent systems
- Full-stack development
- API integration
- Data handling
- Cloud technologies
- Product thinking
- Project coordination
- Leadership
- Technical communication
- Curiosity and personal interests

---

# 3. Design Direction

## Overall Aesthetic

Clean, technical, editorial, and slightly experimental.

Avoid the generic "developer portfolio" aesthetic.

Avoid excessive:

- Neon gradients
- Glowing cards
- Excessive glassmorphism
- Generic AI imagery
- Stock illustrations
- Constant animations
- Excessive rounded cards
- Overly corporate layouts

The design should feel intentional and contemporary.

## Visual Characteristics

- Strong typography
- Large editorial headings
- Generous whitespace
- Restrained color palette
- Thin borders
- Subtle interaction effects
- Clear information hierarchy
- Technical metadata
- Asymmetric layouts where appropriate
- Occasional visual/data-driven elements

## Typography

Primary font candidate:

- Satoshi

Alternative candidates:

- Instrument Sans
- Geist
- Space Grotesk
- Manrope

Typography should provide much of the site's visual personality rather than relying heavily on decoration.

---

# 4. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Hosting

- Hostinger

## Development

- Git
- GitHub
- VS Code

## Backend / Server Features

Next.js server-side functionality should be used where appropriate for:

- API integrations
- Secret/API-key protection
- OAuth flows
- Data aggregation
- Database operations
- Server-side caching

API credentials must never be exposed directly in client-side code.

## Database

Initial recommendation:

- PostgreSQL

Potential hosted options:

- Supabase
- Neon
- Hostinger-supported database

The database should only be introduced when functionality requires persistent data.

---

# 5. Site Architecture

## Public Pages

/

Home / Landing Page

/about

About / Profile

/projects

Project Portfolio

/projects/[slug]

Individual Project Case Study

/experience

Professional Experience

/skills

Skills / Technologies

/achievements

Achievements / Certifications

/contact

Contact

## Personal / Functional Pages

/music

Spotify / Music Dashboard

/league

League of Legends Dashboard

/library

Personal Book Library

/library/[slug]

Individual Book Page

## Optional Future Pages

/now

Current activity / "Now" page

/notes

Personal technical notes

/lab

Experimental projects

---

# 6. Homepage

The homepage should immediately establish professional identity.

## Hero

Content:

- Name
- Professional identity
- Short positioning statement
- Primary CTA
- Secondary CTA

Example direction:

> Yuri Morrison  
> Software / AI Engineer

Supporting copy should communicate that Yuri builds software and intelligent systems while bringing experience in coordination and leadership.

Possible CTAs:

- View Projects
- About Me
- Contact
- Resume

## Selected Projects

Feature major projects.

Primary project:

### Waste-To-Worth

AI-powered recycling and upcycling application using image recognition, retrieval, and personalized recommendations.

Secondary projects:

- Software Engineering Internship
- Other technical projects
- Relevant academic / engineering work

## Experience Preview

Show key professional experience.

## Skills Preview

Group technologies into meaningful categories instead of displaying a giant list.

Example:

### Programming

- Python
- Java
- JavaScript
- TypeScript
- SQL

### Frontend

- React
- React Native
- Angular
- HTML/CSS
- Tailwind

### Backend

- Flask
- Node.js
- Firebase
- REST APIs

### Cloud / Infrastructure

- AWS
- Docker
- Cloud deployment

### AI

- AI agents
- RAG
- LLM APIs
- Image recognition

### Project / Collaboration

- Jira
- Confluence
- Agile
- Project coordination

## Personal Interests Preview

A small section linking to:

- Music
- League of Legends
- Books

This should make the site feel personal without distracting from the professional portfolio.

---

# 7. About Page

## Purpose

Provide a deeper explanation of Yuri's background, interests, values, and career direction.

Sections:

### Introduction

Who Yuri is and what he builds.

### Engineering

Interest in:

- Software development
- AI engineering
- Intelligent systems
- Product development
- Technical problem solving

### Leadership

Experience leading teams, coordinating projects, delegating work, and facilitating collaboration.

### Editorial / Communication

Experience with writing, editorial work, web management, and communicating technical or organizational ideas.

### Career Direction

Primary goal:

Build a career as an AI / Software Engineer.

Project management and coordination should be presented as complementary skills rather than the primary career identity.

---

# 8. Projects

Projects are the centerpiece of the portfolio.

Each major project should be presented as a case study rather than a simple card.

## Project Card

Each card may contain:

- Title
- Short description
- Technologies
- Category
- Featured status
- Image
- Link to case study

## Project Case Study Structure

### Overview

What the project is.

### Problem

What problem it addresses.

### Goal

What the project attempted to accomplish.

### Role

What Yuri personally contributed.

### Architecture

Technical architecture and system components.

### Technologies

Relevant technologies.

### Engineering Decisions

Important technical decisions and why they were made.

### Challenges

Problems encountered during development.

### Solutions

How those problems were addressed.

### Results

Quantitative and qualitative results.

### Lessons

What was learned.

### Future Improvements

What could be improved with additional development time.

---

# 9. Featured Project — Waste-To-Worth

## Title

Waste-To-Worth: Environmentally Transformative Use of Image Recognition and Artificial Intelligence

## Role

Principal Researcher / Developer

## Description

An AI-powered recycling and upcycling application designed to help users identify materials and discover personalized ways to reuse or properly dispose of them.

## Core Features

- Image recognition
- Material classification
- Retrieval-based recommendation system
- AI-generated recycling/upcycling records
- Climate-aware disposal recommendations
- Geolocation
- Quest / project progression
- Gamification
- User-generated content

## Architecture

Frontend:

- React Native
- Expo

Backend:

- Flask

Database:

- Firebase Firestore

Authentication:

- Firebase Authentication

AI:

- Image recognition
- Retrieval
- LLM-based generation

## Results

Include validated project results such as:

- 36 users
- 136 scans
- 117 / 136 successful classifications
- 86.0% classification rate
- 53 completed projects
- 83 / 100 climate-specific disposal methods

The case study should explain what these numbers mean rather than simply displaying them.

---

# 10. Professional Experience

## Software Engineering Internship

Electronic Science Corporation

Present the internship as an engineering case study.

Areas:

- Software development
- Debugging
- Cloud deployment
- Data processing
- UI/UX
- Feature development
- Technical reporting

Technologies:

- AWS ECS
- AWS Lambda
- AWS S3
- AWS Cognito
- JavaScript
- Excel

Highlight measurable impact.

Example:

> Reduced the runtime of a time-consuming bulk-data process to approximately 20% of its original runtime.

This represents approximately an 80% reduction in processing time.

Also mention:

- Best Intern recognition
- Invitation to apply for a software engineering opening

Confidential information should not be disclosed.

---

# 11. Leadership

Leadership should support the engineering narrative rather than replace it.

Relevant experience:

- BITS President
- Internal Vice President
- Associate External Vice President
- Event coordination
- Officer management
- Industry seminar coordination
- Stakeholder communication
- Delegation
- Project planning

## Example Case Study

### NOSEDIVE

A recurring industry seminar series connecting students with professionals and practical industry knowledge.

Show:

- Objective
- Team structure
- Responsibilities
- Planning
- Coordination
- Stakeholders
- Execution
- Improvements across iterations

---

# 12. Music Page

Route:

/music

Purpose:

Create a personal Spotify-powered dashboard.

The page should demonstrate:

- OAuth
- API integration
- Server-side data fetching
- Data visualization
- Caching
- API security

## Spotify Features

### Top Tracks

Display top tracks.

Possible time ranges:

- Short term
- Medium term
- Long term

Spotify's Web API provides a user's top tracks and artists through the `GET /me/top/{type}` endpoint, with short-, medium-, and long-term ranges. :contentReference[oaicite:2]{index=2}

### Top Artists

Display top artists alongside top tracks.

### Recently Played

Display recent listening history.

Spotify provides a recently played endpoint using the `user-read-recently-played` scope. The endpoint can return up to 50 recently played tracks. :contentReference[oaicite:3]{index=3}

Potential display:

- Track
- Artist
- Album artwork
- Time played
- Spotify link

### Currently Playing

Optional feature.

Display:

- Current track
- Artist
- Album
- Playback status

Spotify provides a currently-playing endpoint using `user-read-currently-playing`. :contentReference[oaicite:4]{index=4}

## Authentication

Use Spotify OAuth.

Required scopes may include:

- user-top-read
- user-read-recently-played
- user-read-currently-playing

Spotify uses OAuth 2.0 for access to user-specific data. :contentReference[oaicite:5]{index=5}

## Important Constraints

Spotify API credentials must remain server-side.

Spotify content should be properly attributed and linked back to Spotify.

Do not download or redistribute Spotify content.

Do not use Spotify content as training data for AI systems.

Spotify's platform policies impose restrictions on content use, attribution, and synchronization. :contentReference[oaicite:6]{index=6}

---

# 13. League of Legends Page

Route:

/league

Purpose:

Create a personal League of Legends statistics dashboard.

The page should demonstrate:

- REST API integration
- Data aggregation
- Match-history processing
- Data visualization
- Caching
- API security
- Handling external API rate limits

## Player Profile

Display:

- Riot ID
- Region
- Summoner level
- Profile icon
- Ranked status
- Current rank

Use Riot ID rather than relying on legacy summoner-name workflows.

Riot recommends using Riot IDs and PUUIDs for player identification and has deprecated the old player-facing summoner-name lookup approach. :contentReference[oaicite:7]{index=7}

## Player Statistics

Potential statistics:

- Recent games
- Wins
- Losses
- Win rate
- KDA
- Most-played champions
- Champion win rate
- Average KDA
- CS
- Vision score
- Damage
- Game duration
- Queue type

## Recent Matches

Display:

- Champion
- Result
- KDA
- Duration
- Queue
- Date
- Items
- Summoner spells

## Recently Played With

Analyze recent match participants to determine:

- Players encountered repeatedly
- Number of games together
- Win/loss record together
- Most recent game together

This should be presented as derived match-history data rather than implying that Riot provides a direct "friends/recent players" endpoint.

## API Architecture

Likely Riot API components:

- Account API
- Summoner API
- Match API
- League API
- Champion Mastery API
- Data Dragon

Riot's current developer portal lists Account, Summoner, Match-v5, League, Champion Mastery, and other League APIs. :contentReference[oaicite:8]{index=8}

Data Dragon can provide static League assets such as:

- Champions
- Items
- Runes
- Summoner spells
- Profile icons

:contentReference[oaicite:9]{index=9}

## API Key Security

Riot API keys must not be exposed in client-side code.

API requests should go through server-side functionality.

Implement caching to reduce unnecessary API requests.

Respect Riot API rate limits.

Riot's documented personal API-key rate limit is currently 20 requests per second and 100 requests per two minutes, per region. :contentReference[oaicite:10]{index=10}

## Riot Compliance

The page should include the required Riot Games disclaimer:

> [Product Name] is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.

Riot's developer policy also requires registered products to follow current Riot policies. :contentReference[oaicite:11]{index=11}

---

# 14. Book Library

Route:

/library

Purpose:

Create a personal digital catalog of Yuri's physical and/or owned books.

Unlike the Spotify and League pages, the library should use a database controlled by the portfolio.

## Book Information

Each book can contain:

- Title
- Author
- ISBN
- Cover
- Publisher
- Publication year
- Genre
- Tags
- Description
- Date acquired
- Ownership status
- Location
- Reading status
- Rating
- Personal review
- Notes
- Recommended-by
- Loan status

## Reading Status

Possible statuses:

- Want to Read
- Reading
- Completed
- Abandoned
- Re-reading

## Book Page

/library/[slug]

Display:

- Cover
- Title
- Author
- Metadata
- Personal rating
- Review
- Notes
- Reading status
- Availability
- Loan information
- Related recommendations

---

# 15. Book Review System

Users should be able to leave reviews for books.

Potential fields:

- Rating
- Written review
- Spoiler flag
- Date
- Reviewer

Initially this can be limited to authenticated users.

## Rating

Use a 1–5 rating system.

Avoid presenting average ratings as authoritative assessments.

Reviews should remain individual opinions.

---

# 16. Book Recommendation System

Users should be able to recommend books to Yuri.

Recommendation fields:

- Book
- Recommended by
- Reason
- Date
- Status

Recommendation statuses:

- Suggested
- Considering
- Added
- Reading
- Completed
- Declined

Optional future feature:

Personal recommendation algorithm based on:

- Genres
- Tags
- Authors
- Previous ratings
- Reading history

Do not implement recommendation AI until the basic library functionality is stable.

---

# 17. Book Loaning System

The library should support lending physical books.

## Loan Record

Fields:

- Book
- Borrower
- Borrower contact
- Date borrowed
- Expected return date
- Actual return date
- Status
- Notes

Statuses:

- Available
- Reserved
- On Loan
- Returned
- Lost

## Loan Workflow

1. User requests a book.
2. Owner receives request.
3. Owner approves or rejects request.
4. Book becomes reserved.
5. Book is marked as loaned.
6. Return date is recorded.
7. Book is returned.
8. Loan record is closed.

Initially, loaning can be manually approved.

Do not allow arbitrary users to automatically mark books as loaned.

---

# 18. Authentication

Authentication becomes necessary once the site contains:

- Reviews
- Recommendations
- Loan requests
- Personal user interactions

Possible providers:

- Google
- GitHub
- Email/password

The public portfolio itself should remain accessible without authentication.

---

# 19. User Roles

## Owner

Yuri.

Permissions:

- Add/edit/delete books
- Manage loans
- Approve requests
- Moderate reviews
- Manage recommendations
- Manage portfolio content
- Manage integrations

## Visitor

Permissions:

- View portfolio
- View public library
- View public reviews
- Submit recommendations
- Request loans
- Leave reviews if authentication is enabled

## Future

Optional administrator/moderator role.

---

# 20. Database Concept

Initial database entities:

## User

- id
- name
- email
- avatar
- role
- createdAt

## Book

- id
- title
- author
- isbn
- coverUrl
- description
- publicationYear
- genre
- tags
- status
- rating
- review
- createdAt
- updatedAt

## Review

- id
- bookId
- userId
- rating
- content
- spoiler
- createdAt
- updatedAt

## Recommendation

- id
- bookId
- userId
- reason
- status
- createdAt

## Loan

- id
- bookId
- borrowerId
- status
- borrowedAt
- expectedReturnAt
- returnedAt
- notes

## External Integration Cache

Potentially store cached API data where useful.

Do not store external data unnecessarily.

---

# 21. API / Server Architecture

The browser should not directly communicate with APIs that require private credentials.

Preferred architecture:

Browser
    ↓
Next.js Server
    ↓
External API
    ↓
Normalized data
    ↓
Browser

For Spotify:

Browser
    ↓
Next.js OAuth / API routes
    ↓
Spotify Web API

For League:

Browser
    ↓
Next.js server-side API layer
    ↓
Riot API
    ↓
Data aggregation
    ↓
Browser

For Books:

Browser
    ↓
Next.js server actions / API routes
    ↓
Database

---

# 22. Caching

External APIs should not be called on every page load.

Potential cache durations:

Spotify:
- Recently played: short cache
- Top tracks: longer cache

League:
- Profile: medium cache
- Ranked data: medium cache
- Match history: short/medium cache
- Static champion data: long cache

Book library:
- Database queries should be optimized normally
- Public catalog can use application-level caching if necessary

Caching strategy should be adjusted based on actual API rate limits and site traffic.

---

# 23. Environment Variables

Sensitive credentials must be stored in environment variables.

Example:

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

RIOT_API_KEY=

DATABASE_URL=

AUTH_SECRET=

Additional OAuth variables may be added later.

Never commit secrets to Git.

Never expose server-only environment variables through `NEXT_PUBLIC_*`.

---

# 24. Component Architecture

src/components/

├── layout/
│   ├── Container.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── SectionHeading.tsx
│   └── ...
│
├── projects/
│   ├── ProjectCard.tsx
│   └── ProjectCaseStudy.tsx
│
├── music/
│   ├── SpotifyTrack.tsx
│   ├── SpotifyArtist.tsx
│   ├── RecentlyPlayed.tsx
│   └── TopTracks.tsx
│
├── league/
│   ├── PlayerProfile.tsx
│   ├── MatchCard.tsx
│   ├── ChampionStats.tsx
│   └── RecentPlayers.tsx
│
└── library/
    ├── BookCard.tsx
    ├── BookGrid.tsx
    ├── BookDetails.tsx
    ├── ReviewCard.tsx
    ├── RecommendationForm.tsx
    └── LoanStatus.tsx

---

# 25. Data / Server Architecture

Potential structure:

src/
├── app/
│   ├── api/
│   │   ├── spotify/
│   │   ├── league/
│   │   └── library/
│   │
│   ├── music/
│   ├── league/
│   ├── library/
│   └── ...
│
├── components/
│
├── lib/
│   ├── spotify/
│   ├── riot/
│   ├── database/
│   ├── auth/
│   └── utils/
│
└── content/

---

# 26. Component Development Strategy

Build the site incrementally.

## Phase 1 — Design System

Build and refine:

- Typography
- Colors
- Spacing
- Container
- Navbar
- Footer
- Buttons
- Badges
- Section headings
- Cards

Use:

/components

as the component laboratory.

## Phase 2 — Portfolio

Build:

- Homepage
- About
- Projects
- Case studies
- Experience
- Skills
- Achievements
- Contact

## Phase 3 — Spotify

Implement:

1. Spotify developer application
2. OAuth
3. Server-side token handling
4. Top tracks
5. Top artists
6. Recently played
7. Optional currently playing
8. Loading/error states
9. Caching

## Phase 4 — League

Implement:

1. Riot developer application
2. Riot ID → PUUID lookup
3. Summoner data
4. Ranked data
5. Match history
6. Match participant aggregation
7. Champion statistics
8. Recently played-with analysis
9. Data Dragon assets
10. Caching
11. Rate-limit handling
12. Riot disclaimer

## Phase 5 — Library

Implement:

1. Database
2. Book schema
3. Book catalog
4. Book detail page
5. Reading status
6. Reviews
7. Recommendations
8. Authentication
9. Loan management
10. Loan requests

## Phase 6 — Polish

Implement:

- Responsive design
- Accessibility
- SEO
- Open Graph metadata
- Loading states
- Error states
- Empty states
- API failure handling
- Animations
- Performance optimization
- Analytics if desired

---

# 27. Functional Requirements

Every external-data page must account for:

## Loading

The user should see a meaningful loading state.

## Error

API failure should not break the entire page.

## Empty State

If no data exists, explain why.

## Stale Data

Show when data was last updated where relevant.

## Rate Limits

Avoid unnecessary API calls.

## Security

Never expose private API credentials.

## Mobile

All functionality must remain usable on mobile devices.

---

# 28. Privacy

The site should avoid exposing unnecessary personal information.

Particular consideration should be given to:

- Spotify listening history
- League player names / Riot IDs
- Book borrowers
- User emails
- Loan history
- Authentication information

Loan records should not be publicly visible.

User emails should never be displayed publicly.

Personal API credentials must remain server-side.

---

# 29. SEO

Every major public page should have:

- Unique title
- Description
- Open Graph metadata
- Canonical URL where appropriate

Project pages should be optimized around the project title and technologies.

Personal dashboard pages may intentionally have limited indexing if they contain personal activity data.

---

# 30. Accessibility

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Appropriate color contrast
- Alt text
- Accessible buttons
- Accessible forms
- Screen-reader-friendly labels
- Reduced-motion support

Do not rely on color alone to communicate status.

---

# 31. Performance

Priorities:

- Optimize images
- Use Next.js Image
- Lazy-load noncritical content
- Cache external API data
- Avoid unnecessary client-side JavaScript
- Prefer Server Components where possible
- Use Client Components only when interaction requires them

External APIs should not delay the initial rendering of the professional portfolio unnecessarily.

---

# 32. Content Hierarchy

Professional content should remain the primary experience.

Priority:

1. Engineering identity
2. Projects
3. Professional experience
4. Technical skills
5. Leadership
6. Personal interests
7. Interactive hobby features

The hobby pages should feel like additional applications contained within the portfolio.

They should not make the homepage feel like a gaming/music website.

---

# 33. Portfolio Philosophy

The site should demonstrate the following through its implementation:

> This is not just a website describing what I can build.

> The website itself should demonstrate what I can build.

The portfolio should therefore function as a technical artifact.

The Spotify integration demonstrates:

- OAuth
- External APIs
- Data visualization
- Server-side architecture

The League integration demonstrates:

- API integration
- Data aggregation
- Data transformation
- Rate-limit management
- Statistics

The library demonstrates:

- Database design
- Authentication
- CRUD operations
- Relationships
- User-generated content
- Workflow/state management
- Authorization

The professional portfolio demonstrates:

- Content architecture
- Responsive UI
- Case-study presentation
- Technical communication

Together, the site becomes both a portfolio and a demonstration of engineering ability.

---

# 34. Initial MVP

The first production version should NOT attempt to implement everything.

MVP:

### Professional

- Home
- About
- Projects
- Project case studies
- Experience
- Skills
- Contact

### Personal

- Music page
- League page
- Basic book library

No complex social functionality initially.

---

# 35. Post-MVP

After the core site is stable:

### Spotify

- Recently played
- Currently playing
- More statistics
- Listening trends

### League

- Match history
- Champion statistics
- Recently played with
- Performance trends

### Library

- Reviews
- Recommendations
- Authentication
- Loaning
- Reservation system

---

# 36. Long-Term Possibilities

Potential future functionality:

- Personal "Now" page
- Technical blog
- Project changelogs
- Reading statistics
- Music statistics
- Gaming statistics
- Personal dashboards
- Interactive data visualizations
- AI-assisted book recommendations
- AI-assisted technical project search

Any AI functionality should only be added after the underlying data architecture is reliable.

---

# 37. Guiding Principle

Build the portfolio as a real product.

The professional side answers:

> Who is Yuri as an engineer?

The project section answers:

> What can Yuri build?

The hobby pages answer:

> What does Yuri care about?

The functional systems answer:

> Can Yuri actually engineer the systems behind this website?

The final product should make all four answers apparent without explicitly stating them.