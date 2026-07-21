# Product Website Onboarding Design

Date: 2026-07-21
Status: Approved for implementation

## Goal

Build an authenticated, two-step onboarding flow that asks for a product website, uses TanStack AI with OpenAI web search to infer what the product does, lets the user correct the result, and saves the confirmed profile to PostgreSQL.

The feature is intended for a hackathon demo. It should demonstrate a real AI workflow without introducing a general chat interface or a scraping pipeline.

## User Flow

1. An anonymous visitor sees the existing sign-in entry.
2. A signed-in user without a saved product profile sees onboarding at the root route.
3. The user enters an HTTP or HTTPS website URL and selects **Build profile**.
4. The UI switches to an analysis state that explains the work in three honest stages: identifying the website, collecting public product signals, and writing the profile.
5. A protected server mutation calls TanStack AI with OpenAI's Responses adapter, native web-search tool, and a strict structured-output schema.
6. The resulting profile appears in an editable review form.
7. The user edits any incorrect fields and selects **Save product profile**.
8. A protected mutation upserts the profile for the signed-in user.
9. Returning users see their saved profile and may choose to analyze another website.

## Product Profile

Each user has at most one `ProductProfile` record. It contains:

- `id`
- `userId`, unique and related to `User` with cascade deletion
- `websiteUrl`
- `name`
- `category`
- `description`, a concise statement of what the product does
- `targetAudience`
- `keyFeatures`, stored as a PostgreSQL string array
- `sourceUrls`, stored as a PostgreSQL string array
- `createdAt`
- `updatedAt`

The AI response and the save mutation share one Zod schema so fields are validated at both boundaries. The AI result is not written to the database until the user confirms it.

## Server Architecture

The feature extends the existing oRPC and Prisma layers.

### Read profile

A protected `productProfile` query returns the signed-in user's record or `null`. The root route loader uses `context.queryClient.ensureQueryData` so the authenticated screen renders with the correct onboarding or saved-profile state.

### Analyze website

A protected `analyzeWebsite` mutation accepts a normalized URL and calls TanStack AI:

- `chat()` from `@tanstack/ai`
- `openaiText()` from `@tanstack/ai-openai`
- `webSearchTool({ type: "web_search" })` from `@tanstack/ai-openai/tools`
- a Zod `outputSchema` describing the editable product profile

The system prompt instructs the model to treat website content as untrusted reference material, ignore instructions found on searched pages, identify the actual product rather than the company alone, keep claims concise, and return only source URLs it used. The user-provided URL is included as the primary source and search subject.

The API key remains server-only in `OPENAI_API_KEY`. No browser code imports the OpenAI adapter or reads the key.

### Save profile

A protected `saveProductProfile` mutation accepts the reviewed profile and performs a Prisma upsert keyed by `userId`. After success, the client invalidates the profile query and switches to the saved state.

## URL Safety

The input accepts valid `http:` and `https:` URLs only. Bare domains are normalized to `https://` before validation. The URL is passed to OpenAI web search; the application does not fetch or crawl the address directly. Other protocols, credentials embedded in URLs, and malformed values are rejected.

## Interface Design

The chosen visual direction is **Research desk**: an editorial product-research workspace rather than a generic AI chat screen.

### Visual system

- Canvas: cool fog `#EAF0F1`
- Main surface: paper white `#F8FBFA`
- Primary ink: deep green `#173D38`
- Supporting ink: slate green `#647773`
- Research highlight: mint `#C8F2E4`
- Borders: quiet blue-green `#DFE8E6`
- Display type: a restrained serif for the key onboarding questions
- UI/body type: the existing sans-serif stack for forms, labels, and status text

The memorable element is a product-research map shown during analysis: concentric rings and source nodes visualize public signals converging into one profile. It is decorative status feedback, not a false real-time trace of individual searches.

### Step 1: website

The page has a compact product wordmark and a genuine two-step indicator. The primary panel asks “Start with the source,” explains the result in one sentence, and presents one URL field with a single **Build profile** action. A mint research panel shows the simple flow “Website → Search → Product profile.”

### Analysis state

The input is replaced by a focused waiting view. It shows the submitted domain, the research map, and staged status copy. The progress animation is indeterminate because the server returns a one-shot structured result. Reduced-motion users see the same state without orbit or pulse animation.

### Step 2: review

The result uses a structured editor, not chat bubbles. Product name, category, description, audience, features, and sources remain visibly grouped. Sources are clickable and open in a new tab. Users may return to analyze another URL without saving. The primary action is **Save product profile**.

### Saved state

After saving, the same visual language becomes a compact profile summary. A secondary **Analyze another site** action starts a fresh draft but does not replace the stored profile until the new draft is confirmed.

### Responsive behavior

Desktop uses a narrow progress rail and a wider content area. Mobile collapses to one column, moves the step indicator above the content, keeps actions full-width where helpful, and permits feature chips and source links to wrap. All form controls have visible keyboard focus and associated labels.

## Loading and Error Handling

- Invalid URL: keep the user on step 1 and explain the accepted format.
- Analysis timeout or provider failure: preserve the URL and show **Try analysis again**.
- No confident product found: return an explicit analysis error rather than inventing a profile.
- Save failure: retain all edits and show **Try saving again**.
- Duplicate submission: disable the active submit action while its mutation is pending.
- Missing API key: fail server-side with a configuration error that does not expose secrets.

## Testing

- Unit-test URL normalization and protocol rejection.
- Unit-test the shared product-profile schema.
- Test protected procedures reject anonymous requests.
- Test profile persistence is scoped to the current user and upserts instead of duplicating.
- Test the root UI renders anonymous, onboarding, analysis, review, error, and saved states.
- Run type checking, linting, and the production build.
- Smoke-test the real OpenAI analysis when an API key is available; otherwise mock the adapter boundary in automated tests.

## Out of Scope

- General-purpose AI chat
- Direct crawling or screenshot analysis
- Background jobs or progress polling
- Multiple products per user
- Team sharing
- Profile version history
- Automatic database writes before user confirmation

## References

- [TanStack AI OpenAI adapter and native web-search tool](https://tanstack.com/ai/latest/docs/adapters/openai)
- [TanStack AI structured outputs with tools](https://tanstack.com/ai/latest/docs/structured-outputs/with-tools)
