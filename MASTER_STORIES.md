# MASTER_STORIES

User stories are grouped by feature/module and traceable to requirements. Format: As [role], I want [feature] so that [benefit]. Each story has an ID, priority, acceptance criteria, and trace links.

## Public Content Browsing

- US-001 (P0, REQ-001): As a Visitor, I want to see a list of recent posts so that I can discover new content.
  - Acceptance: Home lists posts sorted by `created_at` desc with title, author, date, excerpt, optional image; loads < 2s for 50 posts.
  - Trace: FE index.vue, BE posts query.
- US-002 (P0, REQ-002): As a Visitor, I want to open a post detail so that I can read full content.
  - Acceptance: Navigating `/post/{id}` renders full content with line breaks and image if provided.
  - Trace: FE post/[id].vue, BE post(id) query.
- US-003 (P1, REQ-003): As a Visitor, I want to search posts by keyword so that I can find relevant topics.
  - Acceptance: Entering a keyword and clicking Search filters list by title or content, case-insensitive.
  - Trace: FE index.vue search UI; BE posts(keyword) ILIKE filter.
- US-004 (P1, REQ-004): As a Visitor, I want to filter posts by category so that I can narrow results.
  - Acceptance: Category dropdown filters list; All shows all posts; categories sorted by name.
  - Trace: FE index.vue dropdown; BE categories + posts(category_id).
- US-005 (P2, REQ-005): As a Visitor, I want basic SEO so that pages render informative snippets in search engines.
  - Acceptance: Pages include title and description meta tags.

## Authentication & Authorization

- US-010 (P0, REQ-010): As a Visitor, I want to register so that I can publish content.
  - Acceptance: Valid username, email, password create account; JWT returned and stored; redirects to admin.
- US-011 (P0, REQ-011): As a Visitor, I want to log in so that I can access admin features.
  - Acceptance: Valid credentials return token and redirect to `/admin`; invalid shows error.
- US-012 (P0, REQ-012): As the System, I want to parse JWT so that requests are authorized.
  - Acceptance: Valid Bearer token decoded to context.user; invalid/missing yields null.
- US-013 (P0, REQ-013): As an Author, I want admin pages protected so that only authenticated users can manage content.
  - Acceptance: Navigating `/admin/*` without token redirects to `/login`.
- US-014 (P0, REQ-014): As an Author, I want only owners or admins to edit/delete my posts so that content integrity is protected. [GAP]
  - Acceptance: Non-owners receive authorization error; admins can act on all posts.

## Content Management (Admin)

- US-020 (P0, REQ-020): As an Author, I want to view my posts in a table so that I can manage them.
  - Acceptance: Admin list shows title, author, created date, and actions.
- US-021 (P0, REQ-021): As an Author, I want to create a post so that I can publish content.
  - Acceptance: Title and content required; optional image URL and category; success returns to list and shows the new post.
- US-022 (P0, REQ-022): As an Author, I want to edit a post so that I can fix or update content.
  - Acceptance: Editing fields updates the record; updated_at reflects change.
- US-023 (P0, REQ-023): As an Author, I want to delete a post so that I can remove outdated content.
  - Acceptance: Confirmation prompt; after delete, list refreshes without the post.
- US-024 (P1, REQ-024): As an Admin, I want to create categories so that content is organized.
  - Acceptance: New category appears in dropdowns; categories sorted by name.

## Platform & Operations

- US-030 (P0, REQ-030): As DevOps, I want a health endpoint so that monitoring can detect outages.
  - Acceptance: GET /health returns JSON { ok: true }; GraphQL health returns "ok".
- US-031 (P0, REQ-031): As DevOps, I want configurable env vars so that deployments are portable.
  - Acceptance: DATABASE_URL, JWT_SECRET, NUXT_PUBLIC_GRAPHQL_ENDPOINT configurable through env or compose.
- US-032 (P1, REQ-032): As DevOps, I want DB migrations script so that schema can be applied easily.
  - Acceptance: `npm run migrate` applies 001_init.sql idempotently.
- US-033 (P1, REQ-033): As DevOps, I want docker-compose so that I can run full stack locally.
  - Acceptance: `docker compose up` brings up db, backend, frontend, adminer with correct ports.
- US-034 (P2, REQ-034): As Security/Dev, I want structured logging so that incidents can be investigated. [GAP]
  - Acceptance: JSON logs, request IDs, error severity; centralized sink.

## Security & Compliance

- US-040 (P0, REQ-040): As Security, I want passwords hashed so that accounts are protected.
  - Acceptance: bcrypt hash persisted; login validates via compare.
- US-041 (P0, REQ-041): As Security, I want input validation so that the system rejects invalid or unsafe inputs. [PARTIAL]
  - Acceptance: Enforce max lengths; sanitize content or safely render.
- US-042 (P2, REQ-043): As an Author, I want graceful token expiry handling so that I can re-authenticate seamlessly. [GAP]
  - Acceptance: 401 triggers redirect to login or silent refresh.
- US-043 (P2, REQ-044): As an Admin, I want roles so that permissions are enforced. [GAP]
  - Acceptance: Admin can manage all; Authors restricted to own posts.

## UX & Content

- US-050 (P1, REQ-050): As a Visitor, I want a responsive navigation menu so that I can browse on mobile.
  - Acceptance: Menu collapses under 640px; accessible toggle.
- US-051 (P1, REQ-051): As a Visitor, I want concise post cards so that I can scan content quickly.
  - Acceptance: 120-char excerpt; dates localized.
- US-052 (P2, REQ-052): As a Visitor, I want paginated lists so that pages load fast. [GAP]
  - Acceptance: Limit/offset controls with total count.
- US-053 (P2, REQ-053): As a Visitor, I want human-readable URLs so that links are meaningful. [GAP]
  - Acceptance: `/post/{slug}` with unique slug field.
- US-054 (P2, REQ-054): As an Author, I want image upload so that I don’t need external URLs. [GAP]
  - Acceptance: Upload returns URL; stored with post.

## Missing or Ambiguous Stories

- Add ownership enforcement stories (US-014) once roles/ownership are implemented (REQ-014/044).
- Add pagination UX stories (US-052) once backend supports pagination params.
- Add validation/sanitization stories (US-041) with specific field constraints.

