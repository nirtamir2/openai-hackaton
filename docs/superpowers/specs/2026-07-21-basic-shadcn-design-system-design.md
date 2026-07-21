# Basic shadcn Design System

## Goal

Replace the custom dark, teal, and blue application styling with a basic shadcn-style neutral design system while preserving the existing Base UI component behavior and application functionality.

## Visual Direction

- Light mode uses a white canvas, near-black text, light gray borders, and neutral gray secondary surfaces.
- Dark mode remains available and uses black or near-black surfaces with neutral gray borders and text.
- Primary actions are black in light mode and white in dark mode.
- Red is reserved for destructive actions and validation errors.
- Blue, teal, cyan, violet, gradients, tinted shadows, and decorative accent colors are not used.
- Components use standard shadcn density, restrained shadows, `0.5rem` base radius, and neutral focus rings.

## Architecture

The existing shadcn semantic variables in `apps/web/src/index.css` become the only application color system. The custom `--app-*` variables and matching Tailwind theme aliases are removed. Components and pages consume semantic utilities such as `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, and `text-destructive`.

The `.dark` selector continues to provide the optional neutral dark theme. This change does not add new theme state or alter how the class is applied.

## Components

The existing primitives continue to wrap `@base-ui/react`. Their public APIs and meaningful variants remain intact so existing consumers do not require behavioral changes.

Core components—including buttons, inputs, textareas, selects, checkboxes, cards, dialogs, dropdowns, tabs, badges, tables, skeletons, separators, fields, and toasts—will be restyled with semantic shadcn tokens. Application layout, authentication, settings, legal pages, navigation, and loading/error states will be updated to use the same tokens.

No component will accept a custom `className` prop. Conditional classes will continue to use `clsx`, and `cva` remains appropriate for design-system variants.

## Interaction and Accessibility

- Focus-visible states use the neutral `ring` token with a visible offset.
- Disabled, invalid, selected, expanded, and destructive states remain visually distinct.
- Base UI continues to provide keyboard behavior, focus management, and accessible component semantics.
- Existing reduced-motion behavior remains in place.

## Scope Boundaries

This migration changes presentation only. It does not change routing, authentication, data fetching, copy, responsive structure, or component behavior. It does not introduce a theme toggle if none currently exists.

## Verification

- Search the web application for remaining `app-*` utilities and blue, teal, cyan, violet, or purple color utilities.
- Run the web TypeScript check and production build.
- Inspect representative screens and overlays in light and dark themes at mobile and desktop widths.
- Confirm focus, hover, disabled, invalid, and destructive states remain legible and neutral.
