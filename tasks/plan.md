# Implementation Plan: Neutral shadcn Design System

## Overview

Migrate the web application from its custom dark teal/blue token layer to standard shadcn semantic colors while retaining Base UI primitives and an optional neutral dark theme.

## Architecture Decisions

- Make the existing shadcn CSS variables the single source of color truth and remove every `--app-*` token.
- Preserve component APIs and Base UI behavior; change presentation only.
- Use semantic utilities throughout application code so light and dark themes share one implementation.

## Task List

### Phase 1: Foundation

- [x] Replace global custom tokens, canvas styles, focus treatment, shimmer, and document theme color.
- [x] Restyle form and action primitives with standard shadcn semantic tokens.

### Checkpoint: Foundation

- [x] Type-check succeeds.
- [x] No custom app color tokens remain in foundation files.

### Phase 2: Components and Screens

- [x] Restyle overlays, navigation, content surfaces, and feedback primitives.
- [x] Migrate layouts, authentication, settings, legal pages, home page, and OG artwork.

### Checkpoint: Components and Screens

- [x] No `app-*` utilities or prohibited chromatic utilities remain.
- [x] Light and dark states are driven only by semantic tokens.

### Phase 3: Verification

- [x] Run formatting, type-check, and production build.
- [x] Inspect representative light and dark screens where local browser tooling permits.

## Risks and Mitigations

| Risk                                                    | Impact | Mitigation                                                                           |
| ------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| Custom component states lose contrast                   | Medium | Map each state explicitly to shadcn foreground, accent, ring, or destructive tokens. |
| Broad token replacement changes behavior                | Low    | Preserve component structure, props, and Base UI state selectors.                    |
| A chromatic color survives outside the component folder | Medium | Search all TSX and CSS files, including metadata and OG rendering.                   |

## Open Questions

None. The approved design defines light mode as white, dark mode as black/gray, and prohibits blue accents.
