# MASTER_REQUIREMENTS

This document consolidates business and product requirements derived from the repository code, configuration, and README. Every requirement has a unique ID, priority, stakeholders, and measurable acceptance. Gaps and conflicts are called out with remediation proposals.

Legend
- Priority: P0 (must), P1 (should), P2 (could)
- Stakeholders: End-User, Author, Admin, SuperAdmin, DevOps, Security, SEO

## Feature Group: Public Content Browsing

- REQ-001 (P0, End-User): View home page listing blog posts.
  - Measure: List loads within 2s for 50 posts; shows title, author, created date, excerpt, image if available.
  - Trace: Frontend `apps/frontend/pages/index.vue`, Backend Query `posts` in `apps/backend/src/graphql/schema.js` and resolver in `resolvers.js`.
- REQ-002 (P0, End-User): View single post detail page.
  - Measure: Shows title, author, created date, content, image.
  - Trace: Frontend `apps/frontend/pages/post/[id].vue`, Backend Query `post(id)` + resolver.
- REQ-003 (P1, End-User): Search posts by keyword.
  - Measure: Keyword filters by title or content; case-insensitive; responds < 2s for 10k posts (DB indexed in future).
  - Trace: `posts(keyword)` resolver uses ILIKE on title/content.
- REQ-004 (P1, End-User): Filter posts by category.
  - Measure: Selecting category narrows list; “All categories” clears filter.
  - Trace: Frontend filter UI; `posts(category_id)` resolver filters; `categories` query.
- REQ-005 (P2, End-User/SEO): Basic SEO metadata.
  - Measure: Title and description tags present.
  - Trace: `apps/frontend/nuxt.config.ts` head meta.

## Feature Group: Authentication & Authorization

- REQ-010 (P0, Author): Register account with username, email, password.
  - Measure: Creates user; returns JWT; password hashed with bcrypt.
  - Trace: Mutation `register` + resolver; DB `users` table migration.
- REQ-011 (P0, Author): Login with username and password.
  - Measure: Valid credentials return JWT; invalid returns error without user leakage.
  - Trace: Mutation `login` + resolver; bcrypt compare; JWT sign.
- REQ-012 (P0, System): Authenticate API calls via JWT Bearer.
  - Measure: Valid token parsed; context exposes `user`.
  - Trace: `apps/backend/src/graphql/context.js`, Apollo context wiring in `src/index.js`.
- REQ-013 (P0, Admin): Restrict content creation and management to authenticated users.
  - Measure: `createPost`, `updatePost`, `deletePost`, `createCategory` require auth.
  - Trace: Checks via `asUser` in resolvers, `apps/frontend/middleware/auth.ts` for admin routes.
- REQ-014 (P0, Security): Only owners or admins can update/delete their posts. [GAP]
  - Current: Any authenticated user can update/delete any post (missing ownership/role checks).
  - Proposal: Add ownership check (post.author_id === ctx.user.id) or role-based policy.

## Feature Group: Content Management (Admin)

- REQ-020 (P0, Author/Admin): Admin dashboard to list posts.
  - Measure: Table view with title, author, created date, actions.
  - Trace: `apps/frontend/pages/admin/index.vue` (requires auth).
- REQ-021 (P0, Author/Admin): Create a new post (title, content, optional image, optional category).
  - Measure: Persists to DB; visible in list; created_at set.
  - Trace: `createPost` mutation; `admin/create.vue` form.
- REQ-022 (P0, Author/Admin): Edit an existing post.
  - Measure: Fields updated; updated_at changes.
  - Trace: `updatePost` mutation; `admin/edit/[id].vue` form; DB trigger updates updated_at.
- REQ-023 (P0, Author/Admin): Delete a post with confirmation.
  - Measure: Row removed; returns true.
  - Trace: `deletePost` mutation; `admin/index.vue` delete action.
- REQ-024 (P1, Admin): Manage categories (create, list).
  - Measure: Create category; list categories sorted by name.
  - Trace: `createCategory` mutation; `categories` query; admin forms use dropdowns.

## Feature Group: Platform & Operations

- REQ-030 (P0, DevOps): Health endpoint for liveness.
  - Measure: `/health` returns `{ ok: true }`; GraphQL `health` returns `ok`.
  - Trace: Express route in `apps/backend/src/index.js`; Query `health`.
- REQ-031 (P0, DevOps): Environment-based configuration.
  - Measure: `DATABASE_URL`, `JWT_SECRET`, `NUXT_PUBLIC_GRAPHQL_ENDPOINT` configurable.
  - Trace: README, docker-compose, nuxt runtimeConfig, `pg` pool.
- REQ-032 (P1, DevOps): Database migrations runnable via script.
  - Measure: `npm run migrate` applies SQL; idempotent.
  - Trace: `apps/backend/src/db/migrate.js`, `db/migrations/001_init.sql`.
- REQ-033 (P1, DevOps): Dockerized local development with Postgres and Adminer.
  - Measure: `docker compose up` starts services; backend at 4000, frontend at 3000.
  - Trace: `docker-compose.yml`, `apps/*/Dockerfile`.
- REQ-034 (P2, DevOps): Structured logging across backend. [GAP]
  - Current: console.log only.
  - Proposal: Add pino/winston with request correlation IDs.

## Feature Group: Security & Compliance

- REQ-040 (P0, Security): Hash passwords with bcrypt.
  - Measure: No plaintext stored; bcrypt cost >=10.
  - Trace: `register` resolver uses bcrypt.hash(…, 10).
- REQ-041 (P0, Security): Validate inputs and enforce size limits. [PARTIAL]
  - Current: GraphQL schema validates required vs optional; no length limits enforced.
  - Proposal: Add input validation library and sanitize HTML content on render/store.
- REQ-042 (P1, Security): Protect admin routes on frontend.
  - Measure: Unauthenticated users redirected to `/login` when visiting `/admin/*`.
  - Trace: `apps/frontend/middleware/auth.ts`.
- REQ-043 (P2, Security): Token expiry handling and refresh UX. [GAP]
  - Current: JWT expires in 7d; no refresh flow/UI.
  - Proposal: Add refresh or re-login prompt and 401 interception.
- REQ-044 (P2, Security): Authorization roles (Admin vs Author). [GAP]
  - Current: No roles in DB; all authenticated users can mutate.
  - Proposal: Add roles column to users; enforce in resolvers.

## Feature Group: UX & Content

- REQ-050 (P1, End-User): Basic responsive layout and navigation.
  - Measure: Nav renders on mobile; menu collapses.
  - Trace: `apps/frontend/layouts/default.vue` responsive menu.
- REQ-051 (P1, End-User): Show excerpts on cards and full content on detail.
  - Measure: Excerpt 120 chars; detail renders line breaks.
  - Trace: `PostCard.vue`, `post/[id].vue`.
- REQ-052 (P2, End-User): Pagination for posts. [GAP]
  - Current: Not implemented.
  - Proposal: Add `limit/offset` in query and controls in UI.
- REQ-053 (P2, SEO): SEO-friendly slugs. [GAP]
  - Current: Navigate by numeric ID.
  - Proposal: Add slug column; route `/post/[slug]`.
- REQ-054 (P2, Author): Image upload instead of URL. [GAP]
  - Proposal: Add file upload to storage (S3) and GraphQL mutation.

## Data Requirements

- REQ-060 (P0): Data model for users, categories, blog_posts per migration.
  - Trace: `apps/backend/db/migrations/001_init.sql`.
- REQ-061 (P1): Maintain updated_at automatically on updates.
  - Trace: DB trigger `blog_posts_updated_at`.

## Conflicts, Gaps, and Resolutions

- CON-001: Authorization gap for ownership/roles (REQ-014/044). Risk: users can edit/delete others’ posts.
  - Resolution: Add `role` to users (Author/Admin); check `author_id == ctx.user.id` or `role == Admin`.
- GAP-001: Pagination (REQ-052) missing; search results may be large.
  - Resolution: Add `limit/offset` and total count.
- GAP-002: Input validation and content sanitization (REQ-041) missing.
  - Resolution: Add validation; sanitize HTML on render.
- GAP-003: Logging/monitoring (REQ-034) minimal.
  - Resolution: Add structured logging and error tracking (Sentry).
- GAP-004: Token expiry/refresh UX (REQ-043).
  - Resolution: Intercept 401, redirect, or implement silent refresh.

