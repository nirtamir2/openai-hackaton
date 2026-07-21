# Neutral shadcn Migration

## Task 1: Global semantic theme

**Acceptance criteria:**

- [x] Custom `--app-*` tokens and aliases are removed.
- [x] Body, focus, loading, and metadata styles use neutral shadcn colors.

**Verification:**

- [x] Search global styles and root metadata for old tokens and colors.

**Dependencies:** None

## Task 2: Base UI form and action primitives

**Acceptance criteria:**

- [x] Buttons, inputs, textareas, selects, and checkboxes match basic shadcn styling.
- [x] Focus, invalid, disabled, and destructive states remain distinct.

**Verification:**

- [x] Type-check the web application.

**Dependencies:** Task 1

## Task 3: Surfaces and overlays

**Acceptance criteria:**

- [x] Cards, dialogs, menus, tabs, badges, tables, fields, labels, and related primitives use semantic tokens.
- [x] Base UI interaction behavior and public APIs remain unchanged.

**Verification:**

- [x] Search component files for legacy utilities.

**Dependencies:** Task 1

## Task 4: Application screens

**Acceptance criteria:**

- [x] Layout, auth, settings, legal, home, error, loading, and OG views use neutral semantic styling.
- [x] No blue, teal, cyan, violet, or purple visual accents remain.

**Verification:**

- [x] Search all application TSX/CSS source for prohibited colors.

**Dependencies:** Tasks 2 and 3

## Task 5: Final verification

**Acceptance criteria:**

- [x] Type-check and production build succeed.
- [x] Representative light/dark UI states remain legible and responsive.

**Verification:**

- [x] `pnpm --filter web type-check`
- [x] `pnpm --filter web build`

**Dependencies:** Tasks 1–4
