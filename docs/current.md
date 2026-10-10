# Portfolio Website — Current Development Context

> This file is a concise snapshot of the project's current implementation state.
>
> **Purpose:** Give coding agents the minimum high-value context needed to work safely and consistently.
>
> **Source of truth hierarchy:**
>
> 1. Existing source code — what is actually implemented
> 2. This file — current development state and immediate priorities
> 3. Specialized documentation — detailed domain requirements
> 4. [`BLUEPRINT.md`](../BLUEPRINT.md) — complete product and architectural specification
>
> **Important:** Do not implement future functionality simply because it appears in `BLUEPRINT.md`. Only work on the requested task and its immediate dependencies.

---

## 1. Project Identity

**Project:** Personal Portfolio + Interactive Personal Dashboard

**Primary professional identity:** Software / AI Engineer

**Supporting identities:**

* Full-Stack Developer
* AI Systems Builder
* Technical Project Contributor
* Project Coordinator
* Technical Leader

**Core message:**

> I build software, understand how systems fit together, and can help people move projects from ideas to working products.

The portfolio itself should demonstrate engineering ability rather than simply describe it.

---

## 2. Current Development Phase

**Phase:** Personal Applications

**Current priority:** Verify the owner-connected public Spotify dashboard, then reassess League and library priorities.

### Current objectives

* Refine reusable UI components.
* Establish consistent design tokens.
* Keep the visual system cohesive across future pages.
* Test components through the component development environment.
* Build portfolio pages incrementally, adding case studies when verified project details are available.
* Maintain responsive behavior and accessibility.
* Avoid premature abstraction.

### Current development principle

> Quality and completion are more important than feature count.

Do not begin personal dashboard integrations or experimental functionality while core portfolio functionality remains incomplete unless explicitly requested.

---

## 3. Current Implementation

The homepage, `/about`, `/projects`, the Waste-To-Worth case study, `/experience`, `/skills`, `/achievements`, and `/contact` are implemented and functional. `/music` publicly displays the owner-selected Spotify top tracks and artists after explicit sharing consent. Its local Neon tables are created; Spotify credentials, owner authorization, and live public data still need setup and verification. `/privacy` describes Spotify data handling.

### Homepage currently includes

* Responsive page structure
* Hero section
* Selected projects
* Waste-To-Worth project information
* Direct "Read case study" link from the Waste-To-Worth preview to `/projects/waste-to-worth`
* Internship experience
* Engineering metrics
* Profile and leadership content
* Closing section
* Navigation
* Footer
* Responsive behavior
* Focus states
* Reduced-motion support
* Page metadata/title
* No known horizontal overflow
* Production build/lint validation

The homepage establishes the visual and structural foundation for the rest of the site.

### About route currently includes

* Engineering identity and professional direction
* Engineering, leadership, and communication perspectives
* Bedan Information Technology Society role timeline
* NOSEDIVE overview
* Route-specific metadata
* Responsive layout using the shared site shell

### Projects route currently includes

* Waste-To-Worth, BasketballPage, ABC Learning Center, and Herald Admin System entries
* GitHub links for all four project repositories
* Technologies and descriptions limited to available repository/project evidence
* Pilot classification and completed-project figures with context
* Route-specific metadata and shared site shell
* Responsive layout checked without horizontal overflow

### Waste-To-Worth case study currently includes

* Overview, problem, goal, role, technologies, and system flow
* Retrieval-before-generation engineering decision
* Pilot figures with evaluation context
* Recognition and documented next improvements
* Repository link and return navigation to `/projects`
* Static generation for the known slug; unknown slugs return 404
* Production build, lint, and mobile overflow checks

### Experience route currently includes

* Software engineering internship and generalized ~80% runtime reduction
* Best Intern recognition and invitation to apply for a software engineering opening
* Dated Bedan Information Technology Society leadership timeline
* NOSEDIVE seminar initiative
* Bedan Herald research, circulation, editorial, and web-management experience
* Route-specific metadata and links from the shared navigation and homepage preview
* Responsive layout checked without horizontal overflow

### Skills route currently includes

* Categories for languages, frameworks, databases, cloud, AI/data, and tools
* Engineering practices as a separate group
* No unsupported proficiency ratings
* Route-specific metadata and shared navigation/footer
* Responsive layout checked without horizontal overflow

### Achievements route currently includes

* All public accepted Credly badges fetched from the public wallet feed and revalidated hourly
* Standalone Credly cards with badge image, issuer, dates, and individual verification links
* Standalone TOPCIT Level 4 card linking to the uploaded PDF in `public/`
* Graceful fallback link to the Credly wallet if its feed is unavailable
* Best Intern as a professional award, with the related invitation to apply
* 3rd Best Capstone Project Overall as a separate department-level competition result
* Links to the Experience page and Waste-To-Worth case study
* Route-specific metadata and shared navigation/footer
* Responsive layout checked without horizontal overflow

### Contact route currently includes

* LinkedIn profile, email, and GitHub profile links
* SMS link for the supplied phone number; no call link
* A light note asking visitors to message rather than cold-call
* Links to Projects and About
* Shared navigation and homepage contact entry point route to `/contact`
* Route-specific metadata and responsive layout checked without horizontal overflow

---

## 4. Current Component System

Reusable components currently exist for:

```text
app/components/
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

The shared components now use the active palette tokens. The button has a visible focus treatment, project cards support optional case-study and external repository links, and shared navigation/footer components are used on the homepage, About page, and component sheet. The container uses the homepage's page-width token.

### Component development route

A development component sheet exists at:

```text
/components
```

Use it to inspect and validate reusable components before composing them into larger pages.

### Component philosophy

* Prefer simple, reusable components.
* Avoid creating components solely to reduce line count.
* Avoid excessive abstraction.
* Components should have clear responsibilities.
* Reusable styling should come from the established design system.
* Page-specific composition should remain in page-level files where appropriate.

---

## 5. Current App Structure

Current application structure:

```text
app/
├── page.tsx
├── layout.tsx
├── globals.css
├── about/
│   └── page.tsx
├── achievements/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── experience/
│   └── page.tsx
├── skills/
│   └── page.tsx
├── projects/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── components/
	├── page.tsx
	├── ComponentSheet.tsx
	├── layout/
	│   ├── Container.tsx
	│   ├── Navbar.tsx
	│   └── Footer.tsx
	├── ui/
	└── projects/
```

The application is built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Git/GitHub
* VS Code

Hosting target:

* Hostinger

---

## 6. Design Direction

The visual identity should remain:

* Clean
* Technical
* Editorial
* Slightly experimental
* Typography-driven
* Spacious
* Structured

### Prefer

* Strong typography
* Large editorial headings
* Generous whitespace
* Thin borders
* Restrained color usage
* Clear hierarchy
* Technical metadata
* Asymmetric layouts where appropriate
* Subtle interactions
* Data visualization where it adds meaning

### Avoid

* Neon developer aesthetics
* Excessive gradients
* Glowing cards
* Heavy glassmorphism
* Generic AI imagery
* Stock illustrations
* Excessive rounded cards
* Constant animations
* Overly corporate layouts
* Decorative effects without functional purpose

### Current palette

```css
--paper: #f2f1eb;
--paper-deep: #e7e7dc;
--ink: #19332d;
--ink-soft: #50635c;
--muted: #788078;
--line: #d3d5c9;
--coral: #d85e43;
--lime: #c7d36b;
```

Typography preference:

1. Satoshi
2. Instrument Sans
3. Geist
4. Space Grotesk
5. Manrope

Geist and Geist Mono are loaded by `app/layout.tsx`; the global body now uses the loaded Geist sans font. The typography system can still be refined, but the current snapshot should describe the implemented font rather than a fallback.

---

## 7. Planned Core Routes

Implemented professional routes: `/`, `/about`, `/projects`, `/projects/waste-to-worth`, `/experience`, `/skills`, `/achievements`, and `/contact`.

The dynamic `/projects/[slug]` route currently generates only the Waste-To-Worth case study. Add further slugs when their project details are verified.

Remaining professional portfolio routes:

```text
None in the current core-route list.
```

Personal/interest routes:

```text
/music
/league
/library
/library/[slug]
```

`/music` is implemented as an owner-connected public dashboard. `/league` and `/library` remain future personal application routes.

Future/experimental routes:

```text
/now
/notes
/lab
```

Do not implement future routes unless they are explicitly part of the current task.

---

## 8. Immediate Development Priority

### Priority 1 — Component System

Maintain and refine as new pages expose real needs:

* Design tokens
* Typography
* Buttons
* Badges
* Section headings
* Cards
* Containers
* Navigation
* Footer
* Responsive behavior
* Interactive states
* Accessibility states

Use `/components` to test reusable UI.

The shared palette alignment and reusable Container/Navbar/Footer integration on the homepage and component sheet were completed on 2026-10-03. Navigation targets implemented sections and routes. Repository lint and production build pass; the shared shell was checked at 320px with no horizontal overflow.

### Priority 2 — Core Portfolio Pages

The current core-route list is implemented. Continue with content refinement, then reassess priorities before starting personal applications.

The order may change when dependencies make another sequence more practical.

### Priority 3 — Personal Applications

The Spotify dashboard is the active personal application. Complete its runtime setup and verify public snapshots, then reassess League and library priorities:

* League dashboard
* Book library

### Priority 4 — Interactive Features

Later:

* Authentication
* Reviews
* Recommendations
* Book loans
* User accounts

### Priority 5 — Experimental Features

Eventually:

* AI book recommendations
* Reading analytics
* Music analytics
* Gaming analytics
* `/now`
* `/notes`
* `/lab`

---

## 9. Professional Content Currently Available

### Flagship Project

**Waste-To-Worth**

AI-powered recycling/upcycling application.

Technology includes:

* React Native
* Expo
* Flask
* Firebase Authentication
* Firestore
* Image recognition
* LLM integration
* Retrieval/RAG concepts
* Geolocation
* Gamification

Primary role:

**Principal Researcher / Developer**

Core architecture:

```text
User
→ React Native / Expo
→ Flask Backend
→ Image Recognition
→ Material Identification
→ Firestore / Existing Records
→ Retrieval
→ LLM Generation
→ Personalized Recommendation
```

Recognized as:

**3rd Best Capstone Project — Department Level**

---

### Internship

**Software Engineering Intern — Electronic Science Corporation**

Relevant technologies:

* JavaScript
* Angular
* AWS ECS
* AWS Lambda
* AWS S3
* AWS Cognito
* Git
* Postman
* Jira
* Confluence
* Agile

Major engineering result:

An asynchronous bulk-data workflow reduced processing time to approximately **20% of the original runtime**, representing roughly an **80% reduction**.

Additional recognition:

**Best Intern — Department**

The user was also invited to apply for a software engineering opening.

Do not expose confidential company/product information.

---

## 10. Leadership Content

Leadership should support the engineering narrative rather than dominate it.

### Bedan Information Technology Society

Roles included:

* Associate External Vice President
* Internal Vice President
* President
* Internal Vice President

Relevant evidence includes:

* Coordinating officers
* Managing projects/events
* Stakeholder coordination
* Industry partnerships
* Delegation
* Organizational operations
* Technical/community events

Important project example:

**NOSEDIVE**

An industry-oriented seminar series connecting IT students with professionals and industry practices.

Use leadership primarily to demonstrate:

* Coordination
* Ownership
* Delegation
* Communication
* Stakeholder management
* Technical leadership

---

## 11. Editorial / Communication Experience

The user also has experience with the Bedan Herald, including:

* Research and Circulations
* Circulations Manager
* Web Manager
* Senior Editorial Writer

Relevant skills:

* WordPress
* UI/UX
* Web publishing
* Technical communication
* Research
* Editorial writing

Use this content when demonstrating communication, documentation, web experience, or multidisciplinary work.

---

## 12. Current Git Workflow

The project uses Git/GitHub with feature branches.

Preferred workflow:

```bash
git switch main
git pull origin main
git switch -c feature/<feature-name>
```

Develop and test the feature.

Then:

```bash
git add .
git commit -m "feat: <description>"
git push -u origin feature/<feature-name>
```

Open a pull request and merge through GitHub.

After merging:

```bash
git switch main
git pull origin main
git branch -d feature/<feature-name>
```

### Branching principle

Do not make substantial feature changes directly on `main`.

Use descriptive feature branches such as:

```text
feature/component-system
feature/about-page
feature/projects-page
feature/waste-to-worth-case-study
feature/spotify-dashboard
```

---

## 13. Current Development Rules

When modifying the project:

1. Inspect the existing implementation before changing it.
2. Preserve working functionality.
3. Make the smallest reasonable change.
4. Reuse existing components where appropriate.
5. Do not introduce a new abstraction without a clear reason.
6. Follow the existing visual language.
7. Keep responsive behavior in mind.
8. Preserve accessibility.
9. Do not implement unrelated future features.
10. Do not rewrite working architecture merely for stylistic preference.
11. Do not expose secrets or API keys.
12. Validate the implementation after meaningful changes.
13. Prefer incremental commits.
14. Update documentation when an architectural decision materially changes.
15. Keep this file focused on current state rather than turning it into another master blueprint.

---

## 14. Documentation Context

The project has specialized documentation files intended to reduce context requirements for coding agents.

### [`BLUEPRINT.md`](../BLUEPRINT.md)

Complete product and architectural specification.

Use when:

* A feature is ambiguous.
* A major architectural decision is required.
* A task spans multiple project domains.
* The specialized documentation does not contain enough information.

Do not read or apply the entire blueprint unnecessarily for small tasks.

### [`design-system.md`](design-system.md)

Contains:

* Visual system
* Typography
* Colors
* Spacing
* Component conventions
* Interaction patterns

Use for UI and visual work.

### [`development-roadmap.md`](development-roadmap.md)

Contains:

* Development phases
* Priorities
* Planned features
* Implementation sequencing
* Scope control

Use for planning and deciding what should be built next.

### [`personal-apps.md`](personal-apps.md)

Contains specifications for:

* Spotify
* League
* Library
* Reviews
* Recommendations
* Loans
* Personal dashboard functionality

Use for personal/hobby application work.

### [`portfolio-content.md`](portfolio-content.md)

Contains:

* Projects
* Experience
* Leadership
* Achievements
* Certifications
* Professional copy/content

Use when creating or editing portfolio content.

### [`technical-architecture.md`](technical-architecture.md)

Contains:

* Technology stack
* Application architecture
* Routing
* APIs
* Database
* Authentication
* Security
* Server-side functionality
* Environment variables
* Caching

Use for implementation and architecture decisions.

---

## 15. Agent Context Rules

When working on a task, follow this context strategy:

### Small UI task

Read:

```text
current.md
design-system.md
relevant source files
```

### Portfolio content task

Read:

```text
current.md
portfolio-content.md
relevant source files
```

### Architecture/backend task

Read:

```text
current.md
technical-architecture.md
relevant source files
```

### Personal application task

Read:

```text
current.md
personal-apps.md
technical-architecture.md
design-system.md
```

### Major cross-cutting feature

Read:

```text
current.md
relevant specialized documentation
BLUEPRINT.md if necessary
```

### General rule

> Read the minimum relevant context needed to complete the task correctly.

Do not treat every documented future feature as an instruction to implement it.

---

## 16. Known Content / Data Considerations

The portfolio contains multiple metrics and achievements derived from different evaluations and documents.

Before publishing numerical claims, verify the source and evaluation context.

In particular, Waste-To-Worth has multiple recorded performance figures. Do not combine or present them as though they came from the same evaluation unless their methodology has been verified.

When uncertain:

* Inspect the source material.
* Preserve the evaluation context.
* Avoid inventing or reconciling numbers without evidence.

---

## 17. Out of Scope Unless Explicitly Requested

Do not proactively implement:

* Spotify OAuth
* Riot API integration
* Book authentication
* User accounts
* Reviews
* Book recommendations
* Book loans
* AI recommendation systems
* `/now`
* `/notes`
* `/lab`
* Advanced analytics
* Production database infrastructure
* Unnecessary cloud infrastructure
* Unrequested third-party integrations

These are planned features, not current requirements.

---

## 18. Definition of Done

A feature should generally be considered complete when:

* The requested functionality works.
* Existing functionality still works.
* The implementation follows the existing architecture.
* The visual design matches the design system.
* The feature is responsive.
* Keyboard/focus behavior is reasonable.
* Reduced-motion behavior is respected where applicable.
* No unnecessary dependencies were introduced.
* No secrets are exposed.
* Lint/build checks pass where applicable.
* The change is reasonably scoped.
* Documentation is updated if the change materially affects architecture or project state.

---

## 19. Updating This File

This file should remain **short and current**.

Update it when:

* A major feature is completed.
* The current development phase changes.
* Immediate priorities change.
* A route becomes implemented.
* A major architectural decision changes the current state.
* A significant constraint is introduced or removed.

Do **not** update it for every small code change.

The purpose of `current.md` is to answer:

> **"Where is the project right now, and what should I be working on?"**

It is not intended to replace `BLUEPRINT.md` or the specialized documentation.

---

## 20. Current Mission

> Build a polished, technically credible portfolio that demonstrates software engineering ability through both the work presented and the engineering quality of the website itself.

The immediate goal is **not** to build every planned feature.

The immediate goal is to establish a strong foundation and progressively turn the portfolio specification into a complete, maintainable product.
