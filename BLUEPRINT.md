# Personal Portfolio & Interactive Dashboard

## Master Blueprint

This file remains the canonical project overview and requirements record. The focused guides below add implementation instructions for each workstream; update both this blueprint and the relevant guide when a decision changes.

## Project Guides

- [Portfolio content and case studies](docs/portfolio-content.md)
- [Design system and reusable components](docs/design-system.md)
- [Technical architecture and security](docs/technical-architecture.md)
- [Personal applications: Spotify, League, and library](docs/personal-apps.md)
- [Development workflow and roadmap](docs/development-roadmap.md)

---

# 1. Project Overview

This project is a personal portfolio website and interactive personal dashboard for **Yuri Andrei B. Morrison**.

The website serves two primary purposes:

1. Present Yuri professionally as a **Software / AI Engineer**.
2. Demonstrate engineering ability through functional interactive systems built into the website.

The professional portfolio is the priority. Personal and hobby features should complement the professional identity rather than compete with it.

The website should communicate that Yuri:

> **Builds software, understands how systems fit together, and can help people move projects from ideas to working products.**

The site itself should function as a demonstration of those capabilities.

---

# 2. Core Identity

## Primary Identity

**Software / AI Engineer**

## Supporting Identities

* Project Coordinator
* Technical Project Contributor
* Technical Leader
* Full-Stack Developer
* AI Systems Builder

These supporting identities should strengthen the engineering profile rather than replace it.

The portfolio should not present Yuri primarily as a project manager.

The central narrative is:

> **I build things, understand how they fit together, and can help people move them from ideas to working products.**

---

# 3. Portfolio Philosophy

The website should demonstrate engineering ability through both its content and implementation.

Professional content should answer:

> **Who is Yuri as an engineer?**

Projects should answer:

> **What can Yuri build?**

Personal features should answer:

> **What does Yuri care about and enjoy?**

Functional systems should answer:

> **Can Yuri actually engineer the systems described here?**

The website should therefore avoid being purely a static résumé.

It should feel like a personal engineering environment that happens to contain a portfolio.

---

# 4. Development Workflow

Git should be used with a professional branch-based workflow.

## 4.1 Branch Philosophy

`main` should always represent an integrated, reasonably stable version of the project.

Direct development on `main` should generally be avoided.

Development should happen through feature or maintenance branches.

## 4.2 Branch Naming

Use descriptive prefixes:

```text
feature/
fix/
refactor/
chore/
docs/
```

Examples:

```text
feature/component-system
feature/spotify-dashboard
feature/league-dashboard
feature/library
fix/mobile-navbar
refactor/project-card
chore/update-dependencies
docs/update-blueprint
```

## 4.3 Standard Workflow

```text
main
 ↓
create branch
 ↓
develop
 ↓
test
 ↓
commit
 ↓
push branch
 ↓
open Pull Request
 ↓
review / inspect
 ↓
merge into main
 ↓
pull updated main
 ↓
delete feature branch
```

Typical workflow:

```bash
git switch main
git pull origin main
git switch -c feature/example
```

After development:

```bash
git status
git add .
git commit -m "Implement example feature"
git push -u origin feature/example
```

After the GitHub Pull Request is merged:

```bash
git switch main
git pull origin main
git branch -d feature/example
```

## 4.4 Commit Guidelines

Commits should describe the actual change.

Examples:

```text
Create initial home page
Add reusable project card component
Refine portfolio typography
Implement Spotify API integration
Add League match history
Create library database schema
Fix mobile navigation overflow
```

Avoid vague commits such as:

```text
update
changes
stuff
final
working
```

## 4.5 Pull Requests

Pull Requests should briefly explain:

* What changed
* Why it changed
* What was tested
* Any known limitations

Example:

```text
## Summary

- Added reusable portfolio component system
- Refined Button, Badge, SectionHeading, and ProjectCard
- Added component development sheet

## Testing

- Production build passes
- Checked desktop layout
- Checked mobile layout
- Checked for horizontal overflow
```

---

# 5. Design Direction

The visual identity should be:

* Clean
* Technical
* Editorial
* Modern
* Slightly experimental
* Typography-driven
* Structured
* Intentional

The site should feel like a carefully designed engineering portfolio rather than a generic developer template.

## Avoid

* Neon gradients
* Excessive glow effects
* Generic AI imagery
* Stock illustrations
* Excessive glassmorphism
* Constant animations
* Excessive rounded cards
* Generic corporate layouts
* Overly decorative dashboards
* Excessive visual noise

## Prefer

* Strong typography
* Large editorial headings
* Generous whitespace
* Thin borders
* Restrained colors
* Clear hierarchy
* Technical metadata
* Asymmetric layouts where appropriate
* Subtle interaction
* Data visualization where meaningful
* Intentional motion

---

# 6. Typography

## Primary Font

**Satoshi**

Characteristics:

* Sleek
* Distinctive
* Modern
* Professional
* Strong display typography

## Alternatives

* Instrument Sans
* Geist
* Space Grotesk
* Manrope

Typography should provide much of the visual personality of the site.

Avoid relying on excessive visual effects to create personality.

---

# 7. Color System

The initial palette should remain restrained.

Suggested foundation:

```css
--background: #f7f7f5;
--foreground: #171717;
--muted: #6b6b67;
--border: #deded8;
--surface: #ffffff;
--accent: #1f4fff;
```

The accent color should be used intentionally rather than everywhere.

Potential future dark mode can be introduced after the primary light theme is stable.

---

# 8. Spacing & Layout

The site should use a consistent spacing system.

Priorities:

* Large section spacing
* Comfortable text widths
* Strong alignment
* Consistent horizontal padding
* Responsive container widths
* Clear visual rhythm

The primary content container should use a maximum width around:

```text
max-w-7xl
```

with responsive horizontal padding.

---

# 9. Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Hosting

* Hostinger

## Version Control

* Git
* GitHub

## Development

* VS Code

## Potential Backend / Server Features

Next.js server-side functionality should be used for:

* API integrations
* API-key protection
* OAuth
* External API aggregation
* Database operations
* Caching
* Authentication
* Server actions

---

# 10. Database Strategy

A database should only be introduced when functionality actually requires persistence.

Potential database options:

* PostgreSQL
* Supabase
* Neon
* Hostinger PostgreSQL/database infrastructure

The database should not be added merely because the portfolio is capable of using one.

Initial professional portfolio pages can remain static.

The interactive personal systems will eventually justify database functionality.

---

# 11. Site Architecture

## Public Professional Pages

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

## Personal Application Pages

```text
/music
/league
/library
/library/[slug]
```

## Future Pages

```text
/now
/notes
/lab
```

---

# 12. Homepage

The homepage is the primary entry point.

It should establish Yuri's professional identity immediately.

## Homepage Structure

```text
Hero
↓
Selected Projects
↓
Experience
↓
Skills
↓
Profile / Leadership
↓
Personal Interests Preview
↓
Contact / Closing Section
```

## Hero

The hero should communicate:

* Name
* Engineering identity
* Short professional statement
* Primary call-to-action
* Secondary navigation/action

The engineering identity should be immediately obvious.

Example positioning:

> Software / AI Engineer building practical systems across software, data, and intelligent applications.

The final wording can be refined later.

---

# 13. Selected Projects

The homepage should prioritize substantial engineering work.

Primary project:

### Waste-To-Worth

The flagship AI engineering project.

Secondary project:

### Software Engineering Internship

Professional engineering experience presented as a case study.

Additional projects may include:

* Real-Time Web-Based Basketball Management System
* Organizational Task Management Web System
* Other technically meaningful projects

Project cards should emphasize:

* Project title
* Short description
* Technologies
* Project category
* Case study link
* Featured status where appropriate

---

# 14. Project Case Studies

Every major project should have a dedicated case study.

## Case Study Structure

```text
Overview
Problem
Goal
Role
Architecture
Technology
Engineering Decisions
Challenges
Solutions
Results
Lessons Learned
Future Improvements
```

The case study should focus on engineering decisions rather than simply listing features.

Where possible, include:

* Architecture diagrams
* Screenshots
* Data
* Metrics
* Technical constraints
* Trade-offs
* Implementation details

---

# 15. Waste-To-Worth

## Title

**Waste-To-Worth: Environmentally Transformative Use of Image Recognition and Artificial Intelligence**

## Role

Principal Researcher / Developer

## Description

An AI-powered recycling and upcycling application designed to help users identify recyclable materials and discover practical ways to reuse or dispose of them.

## Technology

* React Native
* Expo
* Flask
* Python
* Firebase Authentication
* Firebase Firestore
* Image Recognition
* LLM
* Retrieval-Augmented Generation
* Geolocation
* Gamification

## Architecture

```text
User
 ↓
React Native / Expo
 ↓
Flask Backend
 ↓
Image Recognition
 ↓
Material Identification
 ↓
Firestore / Existing Records
 ↓
Retrieval
 ↓
LLM Generation
 ↓
Personalized Recycling / Upcycling Recommendation
```

The system retrieves relevant existing recycling/upcycling records before generating new recommendations to reduce duplication.

## Features

* Image-based material recognition
* Recycling guidance
* Upcycling recommendations
* Climate-specific disposal instructions
* Geolocation
* Gamification
* User projects
* Community posts
* AI-generated recommendations

## Pilot Results

The pilot evaluation included:

* 36 users
* 136 scans
* 117 successful classifications
* Approximately 86% classification rate in the recorded pilot results
* 53 completed projects
* 83 of 100 materials with climate-specific disposal methods

The portfolio should preserve the actual methodology behind each metric rather than presenting numbers without context.

## Recognition

**3rd Best Capstone Project — Department Level**

---

# 16. Software Engineering Internship

## Role

Software Engineering Intern

## Company

Electronic Science Corporation

## Focus

Professional software engineering involving:

* Frontend development
* Backend development
* API integration
* Debugging
* Cloud services
* Data processing
* UI/UX
* QA preparation

## Technology

* JavaScript
* Angular
* AWS ECS
* AWS Lambda
* Amazon S3
* Amazon Cognito
* Git
* Postman
* Jira
* Confluence
* Agile workflow

## Key Engineering Achievement

An asynchronous bulk-data processing workflow reduced system runtime to approximately **20% of the original runtime**, representing an approximately **80% reduction in processing time**.

The case study should explain:

```text
Problem
↓
Existing workflow
↓
Bottleneck
↓
Engineering approach
↓
AWS architecture
↓
Implementation
↓
Performance improvement
```

Confidential company information should not be disclosed.

## Recognition

**Best Intern — Student Internship Program**

The user was also invited to apply for a software engineering opening following the internship.

---

# 17. Experience

The Experience page should provide a more complete timeline than the homepage.

Potential categories:

## Professional

* Software Engineering Intern
* Electronic Science Corporation

## Leadership

* Bedan Information Technology Society

## Editorial / Technical Communication

* The Bedan Herald

Experience should emphasize transferable engineering capabilities:

* Technical execution
* Systems thinking
* Coordination
* Stakeholder management
* Communication
* Leadership
* Problem-solving

---

# 18. Leadership

Leadership should support the engineering narrative.

## Bedan Information Technology Society

Roles:

```text
Associate External Vice President — 2022–2023
Internal Vice President — 2023–2024
President — 2024–2025
Internal Vice President — 2025–2026
```

The organization involved approximately:

* 150 members
* 20+ officers/staff

Relevant responsibilities include:

* Cross-functional coordination
* Delegation
* Project planning
* Event execution
* Stakeholder management
* External partnerships
* Sponsorship
* Budget management
* Mentorship
* Technical event support

## NOSEDIVE

NOSEDIVE should be presented as a project/case study where useful.

It is a recurring seminar initiative involving industry professionals and technical practices.

The portfolio can highlight:

* Initiative development
* Coordination
* Industry engagement
* Event execution
* Delegation
* Continuity between officer teams

Leadership should demonstrate the ability to move people and projects toward outcomes.

---

# 19. Editorial / Communication Experience

The Bedan Herald provides supporting evidence of:

* Technical communication
* Writing
* Research
* Editing
* Digital publishing
* UI/UX
* Website administration
* Content management

Relevant experience includes:

* Senior Staff
* Web Manager
* Circulations Manager
* Research and Circulations Staff

The Web Manager role is especially relevant because it combines technical implementation with content and user experience.

---

# 20. Skills

Skills should be grouped rather than presented as an enormous keyword wall.

## Languages

* Python
* Java
* JavaScript
* PHP
* HTML
* CSS
* SQL

## Frameworks

* React
* React Native
* Angular
* Node.js
* Flask
* Tailwind CSS
* Next.js

## Databases

* Firebase Firestore
* MySQL
* MariaDB
* SQL / NoSQL concepts

## Cloud / Infrastructure

* AWS ECS
* AWS Lambda
* Amazon S3
* Amazon Cognito
* Docker
* Hostinger

## AI / Data

* AI Agents
* LLM APIs
* RAG
* Image Recognition
* API Integration
* Data Processing

## Tools

* Git
* GitHub
* Postman
* Jira
* Confluence
* VS Code
* MySQL Workbench

## Engineering Practices

* Agile
* Full-Stack Development
* API Integration
* Responsive Web Development
* UI/UX Implementation
* Software Testing
* Debugging
* Database Design
* System Integration
* Requirements Analysis

---

# 21. Achievements & Certifications

Potential highlights:

* Best Intern — Student Internship Program
* 3rd Best Capstone Project — Department Level
* Dean's Lister / Annual Honor Roll
* TOPCIT Level 4 — 830/1000
* PMI Project Management Ready
* Microsoft 365 Fundamentals
* Azure Fundamentals
* Certiport IT Specialist certifications
* CompTIA IT Fundamentals

The page should distinguish:

```text
Awards
Certifications
Academic Recognition
Competition Results
```

rather than mixing everything together.

---

# 22. Contact

The Contact page should provide an actual contact method.

Potential functionality:

* Email
* LinkedIn
* GitHub
* Contact form

If a contact form is implemented:

```text
Visitor
 ↓
Next.js server
 ↓
Validation
 ↓
Email provider
 ↓
Yuri
```

Secrets and email-provider credentials must remain server-side.

The current homepage contact CTA should eventually point to a real contact method rather than simply returning visitors to selected work.

---

# 23. Personal Dashboard

The personal portion of the website should function as a collection of small engineering applications.

The professional portfolio remains the primary hierarchy.

Personal pages should demonstrate:

* API integration
* Authentication
* Data visualization
* Caching
* Server-side architecture
* Database design
* Privacy
* Error handling
* Responsive UI

---

# 24. Current Project Structure

The current project should evolve toward:

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   │
│   ├── about/
│   │   └── page.tsx
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── experience/
│   │   └── page.tsx
│   │
│   ├── skills/
│   │   └── page.tsx
│   │
│   ├── achievements/
│   │   └── page.tsx
│   │
│   ├── contact/
│   │   └── page.tsx
│   │
│   ├── music/
│   │   └── page.tsx
│   │
│   ├── league/
│   │   └── page.tsx
│   │
│   ├── library/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   └── components/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Container.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── SectionHeading.tsx
│   │
│   ├── projects/
│   │   └── ProjectCard.tsx
│   │
│   ├── music/
│   │
│   ├── league/
│   │
│   ├── library/
│   │
│   └── ComponentSheet.tsx
│
├── content/
│   └── projects/
│
└── lib/
    ├── spotify/
    ├── riot/
    ├── database/
    ├── auth/
    └── utils/
```

The actual implementation should grow incrementally rather than creating every folder immediately.

---

# 25. Component System

Reusable components should be developed before large-scale page composition.

Initial system:

```text
components/
├── layout/
│   ├── Container
│   ├── Navbar
│   └── Footer
│
├── ui/
│   ├── Button
│   ├── Badge
│   └── SectionHeading
│
└── projects/
    └── ProjectCard
```

Future components may include:

```text
ProjectMeta
TechnologyList
MetricCard
Timeline
CaseStudySection
ImageGallery
StatBlock
ExternalLink
DataTable
EmptyState
LoadingState
ErrorState
```

Components should have clear responsibilities and explicit props.

Avoid building components that exist only to reduce the number of lines in a page.

---

# 26. Component Development Strategy

Component development should follow:

```text
Define responsibility
↓
Define props/API
↓
Define design tokens
↓
Implement structure
↓
Style
↓
Test in Component Sheet
↓
Use in actual page
↓
Refine based on real content
```

The component sheet acts as a development sandbox.

Current route:

```text
/components
```

It should remain development-oriented and does not necessarily need to be publicly linked from the primary navigation.

---

# 27. Component Sheet

The component sheet should demonstrate:

* Navigation
* Buttons
* Badges
* Section headings
* Project cards
* Future reusable UI components

Example content:

```text
Component Sheet
│
├── Buttons
├── Badges
├── Section Heading
├── Project Cards
└── Future Components
```

The component sheet should be used to validate consistency before components are deployed throughout the site.

---

# 28. Music Dashboard

Route:

```text
/music
```

The music page should use Spotify's API.

## Authentication

Spotify OAuth.

Potential scopes:

```text
user-top-read
user-read-recently-played
user-read-currently-playing
```

## Dashboard Features

* Top tracks
* Top artists
* Recently played
* Currently playing
* Time-range comparisons
* Listening statistics

Possible future additions:

* Listening trends
* Artist frequency
* Genre analysis
* Temporal visualizations

## Architecture

```text
Browser
 ↓
Next.js Server
 ↓
Spotify OAuth/API
 ↓
Normalized Data
 ↓
Browser
```

Spotify credentials must remain server-side.

Never expose:

```text
SPOTIFY_CLIENT_SECRET
```

to the browser.

## Privacy

Listening history is personal data.

The page should only expose information intentionally shared by Yuri.

Spotify attribution and appropriate external links should be included where required.

---

# 29. League Dashboard

Route:

```text
/league
```

The League dashboard should integrate with Riot's APIs.

## Profile

Potential information:

* Riot ID
* Region
* Summoner level
* Profile icon
* Rank

## Statistics

Potential information:

* Recent games
* Win rate
* KDA
* Champions played
* CS
* Vision
* Damage
* Game duration
* Queue type

## Recent Matches

Display recent matches with:

* Champion
* Result
* KDA
* Duration
* Queue
* Date

## Recently Played With

This can be derived from match participant data.

## Riot APIs / Data

Potentially use:

* Account
* Summoner
* Match
* League
* Champion Mastery
* Data Dragon

## Architecture

```text
Browser
 ↓
Next.js Server
 ↓
Riot API
 ↓
Aggregation / Normalization
 ↓
Cache
 ↓
Browser
```

The Riot API key must remain server-side.

Caching should be used to reduce unnecessary API calls and respect rate limits.

The dashboard should include the required Riot disclaimer.

---

# 30. Book Library

Routes:

```text
/library
/library/[slug]
```

The library should function as a personal book catalog.

## Book Fields

Potential fields:

```text
id
title
author
isbn
coverUrl
publisher
publicationYear
genre
tags
description
acquiredAt
ownershipStatus
location
readingStatus
createdAt
updatedAt
```

## Reading Status

```text
Want to Read
Reading
Completed
Abandoned
Re-reading
```

## Additional Information

Books may eventually contain:

* Recommendations
* Reviews
* Loan status
* Notes
* Reading history
* Related books

---

# 31. Book Database Model

The `Book` entity should not contain a single global:

```text
rating
review
```

because reviews belong to users and books as a relationship.

Instead:

```text
Book
 └── Reviews
```

## Book

```text
id
title
author
isbn
coverUrl
description
publicationYear
genre
tags
readingStatus
ownershipStatus
location
acquiredAt
createdAt
updatedAt
```

---

# 32. Review System

Reviews should be a separate entity.

## Review

```text
id
bookId
userId
rating
content
spoiler
createdAt
updatedAt
```

Relationship:

```text
User
 ↓
Review
 ↓
Book
```

Yuri's own review should simply be one review associated with Yuri's user account.

This allows future authenticated visitors to submit their own reviews without changing the underlying book model.

## Rating

Rating range:

```text
1–5
```

## Spoilers

Reviews should support a spoiler flag.

Spoiler content can be hidden until the user explicitly reveals it.

---

# 33. Recommendation System

Recommendations should be represented separately from books.

Potential fields:

```text
id
bookId
recommendedById
reason
createdAt
status
```

## Recommendation Status

```text
Suggested
Considering
Added
Reading
Completed
Declined
```

Potential future functionality:

* Personalized recommendations
* Recommendation history
* AI-assisted recommendations
* Recommendation similarity

AI recommendations should remain a later-stage feature rather than an MVP requirement.

---

# 34. Book Loan System

Books can eventually be loaned to other authenticated users.

The loan system should not duplicate borrower information inside every loan record.

Instead, a loan should reference the borrower.

## Loan

Potential fields:

```text
id
bookId
borrowerId
requestedAt
approvedAt
borrowedAt
expectedReturnAt
returnedAt
notes
```

The borrower should be associated with the `User` entity.

Avoid storing duplicated:

```text
borrowerName
borrowerEmail
borrowerPhone
```

inside every loan unless there is a deliberate historical-data requirement.

## Loan State Flow

```text
Book
 ↓
Loan Request
 ↓
Approved
 ↓
Reserved
 ↓
On Loan
 ↓
Returned
```

Manual approval should be used initially.

---

# 35. Authentication

Authentication is only necessary for interactive personal systems.

Potential providers:

* Google
* GitHub
* Email/password or magic link

The professional portfolio must remain publicly accessible without authentication.

## Roles

Initial:

```text
Owner
Visitor
```

Future:

```text
Moderator
```

Authentication information must remain private.

---

# 36. API / Server Architecture

General pattern:

```text
Browser
 ↓
Next.js Server
 ↓
External API / Database
 ↓
Normalized Data
 ↓
Browser
```

Server-side functionality should handle:

* Secrets
* API keys
* OAuth
* Database operations
* Validation
* Caching
* Rate limiting
* Data normalization

Client components should not directly expose private credentials.

---

# 37. API Routes

Potential structure:

```text
src/app/api/
├── spotify/
├── league/
└── library/
```

Potential future routes:

```text
auth/
contact/
reviews/
recommendations/
loans/
```

Routes should be created only when functionality requires them.

---

# 38. Caching

Caching should be applied based on the nature of the data.

## Spotify

Recent listening:

Short cache.

Top tracks/artists:

Longer cache.

Currently playing:

Very short or no cache.

## League

Profile/rank:

Medium cache.

Match history:

Short/medium cache.

Static game assets:

Long cache.

## Library

Database-backed and optimized through appropriate queries.

Caching should reduce unnecessary external API requests without causing visibly stale information.

---

# 39. Environment Variables

Potential environment variables:

```text
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
RIOT_API_KEY
DATABASE_URL
AUTH_SECRET
```

Secrets must never be committed to Git.

Never expose server-only credentials through:

```text
NEXT_PUBLIC_*
```

Use `.env.local` during development.

Ensure environment files are excluded from version control.

---

# 40. Privacy

The website may eventually process:

* Spotify listening history
* Riot IDs
* Player names
* Book reviews
* Borrower information
* Emails
* Authentication information
* Loan history

Privacy should be treated as an engineering requirement.

## Loan Privacy

Loan records must not be publicly visible.

## Authentication Privacy

Authentication information must not be exposed.

## External API Privacy

Only intentionally shared data should be displayed.

---

# 41. Loading, Error & Empty States

Every interactive system should account for:

```text
Loading
Success
Empty
Error
Stale
Rate Limited
Unauthorized
```

Examples:

### Spotify

```text
Loading listening data...
No recent listening data available.
Spotify connection expired.
```

### League

```text
Loading match history...
No recent matches found.
Riot API temporarily unavailable.
Rate limit reached.
```

### Library

```text
No books added yet.
```

Interactive applications should not fail silently.

---

# 42. Accessibility

The site should support:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Appropriate color contrast
* Descriptive alt text
* Accessible buttons and links
* Reduced-motion support
* Logical heading hierarchy
* Responsive text sizing

Animations should never be necessary to understand content.

---

# 43. Responsive Design

The site must be designed for:

* Mobile
* Tablet
* Desktop
* Large desktop

Responsive behavior should be considered while components are created rather than added at the end.

Important checks:

* Horizontal overflow
* Navigation wrapping
* Card layout
* Typography scaling
* Image aspect ratios
* Touch target size
* Table/data visualization behavior

---

# 44. SEO

The professional portfolio should include:

* Page titles
* Meta descriptions
* Open Graph metadata
* Semantic headings
* Descriptive URLs
* Appropriate structured metadata where useful

Project pages should have unique metadata.

The homepage should clearly communicate:

```text
Yuri Morrison
Software / AI Engineer
```

---

# 45. Performance

Priorities:

* Optimized images
* Next.js image handling
* Minimal unnecessary JavaScript
* Server-side data fetching where appropriate
* Caching
* Lazy loading
* Avoiding excessive animation
* Avoiding unnecessary third-party dependencies

The website should remain fast even as interactive features are added.

---

# 46. Project Content Architecture

Project content should eventually be separated from page layout.

Potential structure:

```text
src/content/projects/
├── waste-to-worth.ts
├── software-engineering.ts
├── basketball-management.ts
└── task-management.ts
```

This allows project pages to use shared rendering components.

Potential project data:

```text
title
slug
description
role
date
technologies
featured
image
overview
problem
goal
architecture
decisions
challenges
solutions
results
lessons
futureImprovements
```

---

# 47. Homepage Content Hierarchy

The order of importance should remain:

```text
1. Professional identity
2. Engineering projects
3. Professional experience
4. Technical skills
5. Leadership
6. Personal interests
7. Experimental features
```

The hobby systems should never make the website unclear as a professional portfolio.

---

# 48. Functional Hobby Pages

The hobby pages exist partly because Yuri enjoys the subjects and partly because they demonstrate engineering ability.

## Music

Demonstrates:

* OAuth
* API integration
* Server-side authentication
* Data visualization
* External API normalization

## League

Demonstrates:

* API aggregation
* Caching
* Data processing
* Statistics
* Rate-limit handling

## Library

Demonstrates:

* Database design
* Authentication
* CRUD operations
* Relationships
* Reviews
* Recommendations
* Workflow/state management

Together, these systems demonstrate a wider engineering skill set than a static portfolio alone.

---

# 49. Scope Control

Feature count should not become the goal.

The project should prioritize completion and quality over the number of systems implemented.

## P0 — Core Portfolio

```text
Homepage
Projects
Project case studies
Experience
About
Skills
Achievements
Contact
Responsive design
Accessibility
SEO
Performance
```

## P1 — Personal Applications

```text
Spotify
League
Basic Library
```

## P2 — Interactive Features

```text
Reviews
Recommendations
Loan requests
User accounts
```

## P3 — Experimental

```text
AI book recommendations
Reading analytics
Music analytics
Gaming analytics
Now page
Notes
Lab
Interactive experiments
```

A feature should not be implemented simply because it is technically possible.

---

# 50. Implementation Phases

## Phase 1 — Design System

Current focus.

Tasks:

* Typography
* Colors
* Spacing
* Container
* Navbar
* Footer
* Buttons
* Badges
* Section headings
* Cards
* Component sheet
* Responsive behavior

The component system should be refined against the existing homepage rather than designing components in isolation.

---

## Phase 2 — Portfolio

Build:

```text
/about
/projects
/projects/[slug]
/experience
/skills
/achievements
/contact
```

Complete case studies for:

1. Waste-To-Worth
2. Software Engineering Internship
3. Additional projects as appropriate

---

## Phase 3 — Spotify

Implement:

* OAuth
* Server-side credentials
* Top artists
* Top tracks
* Recently played
* Currently playing
* Loading/error states
* Caching
* Attribution

---

## Phase 4 — League

Implement:

* Riot API integration
* Profile
* Rank
* Recent matches
* Match statistics
* Champion information
* Recently played with
* Caching
* Rate-limit handling
* Riot disclaimer

---

## Phase 5 — Library

Implement:

* PostgreSQL/database
* Authentication
* Book CRUD
* Book detail pages
* Reading status
* Reviews
* Recommendations
* Loan management

Start simple.

Do not build the entire social system at once.

---

## Phase 6 — Polish

Final pass for:

* Accessibility
* SEO
* Performance
* Mobile behavior
* Animations
* Error states
* Loading states
* Empty states
* Visual consistency
* Security
* Content quality

---

# 51. Current Implementation Status

## 2026-10-03

### Completed

* Responsive homepage
* Professional identity section
* Project previews
* Experience preview
* Profile/leadership content
* Closing section
* Homepage visual foundation
* Color palette
* Responsive layout
* Navigation
* Footer
* Focus styles
* Reduced-motion support
* Homepage metadata
* Page title
* Waste-To-Worth pilot results represented on homepage
* Internship processing-time improvement represented on homepage
* Production build
* Scoped lint pass
* Desktop layout checked
* Mobile layout checked
* Horizontal overflow checked
* Initial reusable component system
* Component development sheet

### In Progress

* Refinement of reusable design-system components
* Component styling consistency
* Project architecture

### Still To Do

* Dedicated portfolio routes
* Full project case studies
* Skills page
* Achievements page
* Experience page
* About page
* Contact page
* Real contact method
* Personal-interest previews on homepage
* Spotify integration
* League integration
* Library system
* Database
* Authentication
* Advanced interactive features
* Final accessibility pass
* Final SEO pass
* Final performance optimization

---

# 52. Current Component Development

Current reusable components:

```text
src/components/
├── layout/
│   ├── Container.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Badge.tsx
│   └── SectionHeading.tsx
│
├── projects/
│   └── ProjectCard.tsx
│
└── ComponentSheet.tsx
```

Current development route:

```text
/components
```

The component sheet should remain a controlled environment for testing the design system.

---

# 53. Immediate Development Priority

The next implementation phase should focus on the component system.

Recommended Git workflow:

```bash
git switch main
git pull origin main
git switch -c feature/component-system
```

Then:

1. Inspect the current homepage.
2. Identify repeated visual patterns.
3. Refine existing reusable components.
4. Add missing foundational components only when needed.
5. Test them in `/components`.
6. Replace duplicated homepage markup with reusable components.
7. Test desktop/mobile behavior.
8. Run the production build.
9. Commit the completed feature.
10. Push the branch.
11. Open a Pull Request.
12. Merge into `main`.
13. Delete the feature branch.

The component system should serve the existing design rather than forcing the homepage to conform to an abstract component library.

---

# 54. Engineering Principles

## Build Before Decorating

Functionality and structure should come before visual polish.

## Reuse Without Over-Abstraction

Create reusable components when patterns genuinely repeat.

Do not create abstractions merely for the sake of abstraction.

## Server Secrets Stay Server-Side

API keys, OAuth secrets, and database credentials must never reach the client.

## Data Models Should Represent Relationships

Reviews, recommendations, users, and loans should be represented as their own entities when they have independent relationships and lifecycle.

## Progressive Complexity

Start with the simplest implementation that works.

Add:

* authentication
* databases
* caching
* AI
* social features

only when they provide a real purpose.

## Quality Over Feature Count

A smaller number of polished systems is better than a large number of incomplete features.

---

# 55. Portfolio Narrative

The portfolio should tell a coherent story:

```text
I studied IT.
        ↓
I learned to build software.
        ↓
I built substantial systems.
        ↓
I worked professionally as a software engineer.
        ↓
I led technical and organizational projects.
        ↓
I became interested in AI and intelligent systems.
        ↓
I am continuing to build systems that combine software,
data, APIs, and AI.
```

The website itself becomes another example of that progression.

---

# 56. Final Guiding Principle

The portfolio should not simply say:

> "I know these technologies."

It should demonstrate:

> **I can use technology to understand problems, design systems, build solutions, communicate decisions, and bring projects to completion.**

The professional side establishes Yuri's engineering identity.

The project case studies demonstrate technical depth.

The experience section demonstrates professional execution.

The leadership section demonstrates coordination and responsibility.

The personal applications demonstrate practical engineering beyond coursework.

The website itself demonstrates the ability to design and build a growing software system.

The final product should feel less like a résumé placed on the web and more like a **small, evolving software product built around its creator.**
