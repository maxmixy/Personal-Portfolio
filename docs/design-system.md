# Design System Guide

This guide covers the visual and component rules in [BLUEPRINT.md](../BLUEPRINT.md). Refine the system against real homepage content; do not make the homepage conform to components invented in isolation.

## Visual Direction

Aim for a clean, technical, editorial, modern, and slightly experimental portfolio. Use typography, whitespace, thin borders, hierarchy, useful metadata, restrained color, asymmetric composition, and meaningful data visuals.

Avoid neon gradients, generic AI imagery, stock illustrations, excessive glass effects, constant motion, large rounded-card grids, generic corporate layouts, and decoration that obscures content. The professional site should feel like an engineering product rather than a résumé template.

## Current Implementation and Tokens

The current homepage palette is defined in `app/globals.css`:

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

Treat these as the implemented palette, not immutable brand requirements. Keep accent colors purposeful and preserve legible contrast. Earlier palette examples in the master blueprint are conceptual alternatives, not the current CSS values.

Geist and Geist Mono are self-hosted from licensed local WOFF2 assets in `app/fonts`, loaded through `next/font/local`, and applied through the root layout's CSS variables. Satoshi, Instrument Sans, Space Grotesk, and Manrope remain possible alternatives; use a font only when it can be loaded reliably and legally.

The desktop content container currently tops out at 1240px. Maintain comfortable line lengths, consistent gutters, and generous section spacing.

## Components

The repository currently places components under `app/components/` (not the aspirational `src/components/` paths shown in the master blueprint). Existing pieces include layout `Container`, `Navbar`, and `Footer`, UI `Button`, `Badge`, and `SectionHeading`, project `ProjectCard`, and a `/components` development sheet. The shared header, footer, and container are used by both the homepage and component sheet.

Use the component sheet to inspect and tune reusable pieces. A useful lifecycle is:

```text
Define responsibility and props
-> establish/reuse design tokens
-> implement semantic structure
-> style and check states
-> inspect in /components
-> use on a real page
-> refine against actual content
```

Potential future patterns include project metadata, technology lists, timelines, case-study sections, image galleries, stat blocks, data tables, and loading/empty/error states. Add a component when a pattern genuinely repeats or has a clear independent responsibility; do not abstract solely to shorten a page.

## Interaction and Accessibility

- Use semantic HTML and a logical heading hierarchy.
- Ensure every interactive control is keyboard reachable and has a visible focus state.
- Links must describe their destination; buttons perform actions.
- Provide descriptive alt text for meaningful images and empty alt text for decorative images.
- Do not communicate status through color alone.
- Respect `prefers-reduced-motion`; animation must never be required to understand content.
- Keep transitions subtle and purposeful.

## Responsive Review

Check mobile, tablet, desktop, and large desktop. Specifically inspect:

- Horizontal overflow and page gutters.
- Navigation collisions, wrapping, and touch target size.
- Heading wrapping and content clipping.
- Project rows, cards, images, and fixed-format visuals.
- Tables or data visualizations on narrow viewports.
- Overlaps between labels, controls, and neighboring content.

Prefer stable grid tracks, aspect ratios, and responsive constraints so content changes do not shift controls unpredictably.

## SEO and Performance

Each public route should have a unique title and description; project pages should describe their own case study. Use semantic headings and descriptive URLs. Add Open Graph and structured metadata where useful.

Prefer Server Components for static content and server-side data. Add client components only where interaction needs browser state or events. Optimize images with Next.js image handling where appropriate, lazy-load noncritical media, and avoid unnecessary client JavaScript and third-party dependencies.

## Done Criteria

A reusable visual change is ready when it works in the component sheet and its real page, has keyboard/focus and reduced-motion behavior where relevant, remains readable at narrow widths, and introduces no new horizontal overflow.
