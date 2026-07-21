# Implementation Plan: Product Website Onboarding

## Overview

Implement the approved authenticated onboarding flow as five small slices: shared contracts and persistence, TanStack AI analysis, authenticated route data, the Research desk UI, then integration verification. The server will use the OpenAI Responses adapter with native web search and strict structured output; the browser will only receive validated profile data.

## Architecture Decisions

- Keep AI work inside the protected oRPC server layer so the API key never reaches the browser.
- Use a shared Zod profile schema for AI output and the save mutation.
- Use `gpt-5.4-mini` with low reasoning: the installed latest TanStack AI OpenAI adapter does not yet type GPT-5.6, while its `gpt-5.4-mini` metadata explicitly supports Responses, web search, and structured output.
- Store one `ProductProfile` per user and upsert on confirmation.
- Render onboarding at `/` for authenticated users without a profile; retain the existing anonymous entry.
- Use React Query mutation state for analysis/save and `ensureQueryData` in the route loader for the existing profile.

## Dependency Graph

```text
TanStack AI packages + environment
        │
Profile schema + URL normalization
        │
Prisma ProductProfile model
        │
Protected profile/query/mutations
        │
Root loader and Research desk UI
        │
Tests, type-check, lint, build
```

## Task List

### Phase 1: Foundation

#### Task 1: Add AI dependencies, environment validation, and profile contracts

**Description:** Add current TanStack AI/OpenAI packages, validate `OPENAI_API_KEY`, and create the shared Zod profile contract plus URL normalization helper.

**Acceptance criteria:**

- [ ] Server environment requires `OPENAI_API_KEY` without exposing it to web code.
- [ ] Product profile input/output is represented by one reusable strict schema.
- [ ] Bare domains normalize to HTTPS and unsafe/malformed protocols are rejected.

**Verification:**

- [ ] Package manifests resolve with `pnpm install`.
- [ ] Focused unit tests cover URL normalization and schema limits.

**Dependencies:** None

**Files likely touched:**

- `pnpm-workspace.yaml`
- `packages/api/package.json`
- `packages/env/src/server.ts`
- `apps/web/.env.example`
- `packages/api/src/productProfileSchema.ts`

**Estimated scope:** Medium

#### Task 2: Persist one product profile per user

**Description:** Add the Prisma model and protected read/save procedures so a confirmed profile is isolated to and upserted for the current user.

**Acceptance criteria:**

- [ ] `ProductProfile.userId` is unique and cascades when its user is deleted.
- [ ] The query returns the current user's profile or `null`.
- [ ] Saving twice updates one row rather than creating duplicates.

**Verification:**

- [ ] Prisma client generation succeeds.
- [ ] API types compile against the generated model.

**Dependencies:** Task 1

**Files likely touched:**

- `packages/db/prisma/schema/schema.prisma`
- `packages/api/src/routers/productProfile.ts`
- `packages/api/src/routers/index.ts`

**Estimated scope:** Medium

### Checkpoint: Foundation

- [ ] Prisma generation succeeds.
- [ ] API and environment packages type-check.

### Phase 2: Core flow

#### Task 3: Analyze websites with TanStack AI and OpenAI web search

**Description:** Add the protected one-shot analysis mutation using the Responses adapter, the native web-search provider tool, a lean injection-resistant prompt, and strict structured output.

**Acceptance criteria:**

- [ ] Analysis is unavailable to anonymous callers.
- [ ] The submitted URL is the primary research subject.
- [ ] A successful call returns a validated editable profile with sources.

**Verification:**

- [ ] API package type-checks using the installed TanStack AI version.
- [ ] Provider failures are mapped to a safe application error.

**Dependencies:** Tasks 1–2

**Files likely touched:**

- `packages/api/src/analyzeWebsite.ts`
- `packages/api/src/routers/productProfile.ts`
- `packages/api/src/routers/index.ts`

**Estimated scope:** Medium

#### Task 4: Build the authenticated Research desk experience

**Description:** Replace the authenticated template content with the two-step website form, analysis state, editable result, saved profile view, and retry paths while preserving the anonymous sign-in entry.

**Acceptance criteria:**

- [ ] Signed-in users see onboarding or their stored profile based on loader data.
- [ ] Analysis, review, save, retry, and analyze-another-site paths work without losing user input.
- [ ] Desktop and mobile layouts, keyboard focus, labels, disabled states, and reduced motion are handled.

**Verification:**

- [ ] Root route component tests cover anonymous, initial, review, error, and saved states.
- [ ] Manual responsive smoke check at mobile and desktop widths.

**Dependencies:** Tasks 2–3

**Files likely touched:**

- `apps/web/src/routes/index.tsx`
- `apps/web/src/components/onboarding/ProductOnboarding.tsx`
- `apps/web/src/components/onboarding/ProductProfileEditor.tsx`
- `apps/web/src/components/onboarding/ProductResearchMap.tsx`
- `apps/web/src/index.css`

**Estimated scope:** Medium

### Checkpoint: Core flow

- [ ] Authenticated flow works end to end with a mocked analysis result.
- [ ] Existing anonymous sign-in path still works.
- [ ] Type checking and focused tests pass.

### Phase 3: Verification and polish

#### Task 5: Verify integration and harden edge cases

**Description:** Run repository checks, resolve lint/type/build issues, and smoke-test a real analysis only when a configured API key is available.

**Acceptance criteria:**

- [ ] Invalid URLs, AI failures, and save failures have specific recovery actions.
- [ ] No secret or raw provider error reaches the browser.
- [ ] Existing unrelated functionality remains intact.

**Verification:**

- [ ] `pnpm run type-check`
- [ ] `pnpm run test`
- [ ] `pnpm run lint`
- [ ] `pnpm run build`

**Dependencies:** Tasks 1–4

**Files likely touched:** Only files already in scope, plus focused test files.

**Estimated scope:** Small

### Checkpoint: Complete

- [ ] All design acceptance criteria are met.
- [ ] Working tree contains no unintended changes.
- [ ] Implementation is ready for review.

## Risks and Mitigations

| Risk                                   | Impact | Mitigation                                                                                                          |
| -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| TanStack AI 0.x API drift              | High   | Code against official current docs and installed package types; type-check immediately after the endpoint is added. |
| Web search returns weak evidence       | Medium | Require concise source URLs and fail when the product cannot be identified confidently.                             |
| Search/tool call latency               | Medium | Use GPT-5.4 mini with low reasoning and an honest indeterminate analysis state.                                     |
| Prisma database is unavailable locally | Medium | Generate/type-check locally; report DB smoke-test limits without fabricating success.                               |
| Prompt injection from searched pages   | Medium | Treat page content as untrusted data and explicitly reject page-supplied instructions in the system prompt.         |

## Open Questions

None. The approved design resolves route behavior, persistence, profile fields, provider, and visual direction.
