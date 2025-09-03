# MASTER_UAT

User Acceptance Testing scenarios mapped to Requirements (REQ), Stories (US), Flows (FLW), and Sequences (SEQ).

Template per case: Objective, Preconditions, Steps, Expected Result, Acceptance Criteria.

## UAT-001: Home lists posts
- Trace: REQ-001, US-001, FLW-001, SEQ-001
- Objective: Verify home renders post list.
- Preconditions: Backend seeded with ≥3 posts.
- Steps: Open `/`.
- Expected: Cards show title, author, date, excerpt, optional image; ordered by created_at desc.
- Acceptance: All fields correct; loads < 2s.

## UAT-002: View post detail
- Trace: REQ-002, US-002, FLW-004, SEQ-004
- Objective: Verify detail page shows full content.
- Preconditions: Post exists with content and image_url.
- Steps: Open `/post/{id}`.
- Expected: Title, author, date, content (line breaks), image rendered.
- Acceptance: Matches DB values; no errors.

## UAT-003: Search by keyword
- Trace: REQ-003, US-003, FLW-002, SEQ-002
- Objective: Verify keyword filters.
- Preconditions: Posts with and without keyword in title/content.
- Steps: Enter keyword; click Search.
- Expected: Only matching posts shown (case-insensitive).
- Acceptance: No false positives/negatives.

## UAT-004: Filter by category
- Trace: REQ-004, US-004, FLW-003, SEQ-003
- Objective: Verify category filtering.
- Preconditions: Categories A/B; posts assigned accordingly.
- Steps: Choose category A; Search.
- Expected: Only posts in A shown.
- Acceptance: Correct counts; All shows all.

## UAT-005: Register success
- Trace: REQ-010, US-010, FLW-005, SEQ-005
- Objective: Verify registration flow.
- Preconditions: Username not taken; valid email; strong password.
- Steps: Fill form; submit.
- Expected: Token stored; redirected to `/admin`.
- Acceptance: User row created; JWT valid.

## UAT-006: Register duplicate username
- Trace: REQ-010, US-010
- Objective: Duplicate username handled.
- Preconditions: Username already exists.
- Steps: Submit registration with duplicate username.
- Expected: Error shown; DB not modified.
- Acceptance: No new user created.

## UAT-007: Login success
- Trace: REQ-011, US-011, FLW-006, SEQ-006
- Objective: Verify login flow.
- Preconditions: Existing user with known password.
- Steps: Fill credentials; submit.
- Expected: Token stored; redirect `/admin`.
- Acceptance: Token decodes with correct id.

## UAT-008: Login invalid credentials
- Trace: REQ-011, US-011, FLW-018, SEQ-018
- Objective: Error shown.
- Preconditions: Wrong password.
- Steps: Submit wrong password.
- Expected: "Invalid credentials" error.
- Acceptance: No token stored.

## UAT-009: Admin guard redirect
- Trace: REQ-013, US-013, FLW-008, SEQ-008
- Objective: Verify guard.
- Preconditions: No token in localStorage.
- Steps: Navigate `/admin`.
- Expected: Redirect to `/login`.
- Acceptance: No admin content shown.

## UAT-010: List posts in admin
- Trace: REQ-020, US-020, FLW-009, SEQ-009
- Objective: Table shows posts.
- Preconditions: Authenticated; posts exist.
- Steps: Open `/admin`.
- Expected: Table rows with title, author, created date, actions.
- Acceptance: Matches backend data.

## UAT-011: Create post
- Trace: REQ-021, US-021, FLW-010, SEQ-010
- Objective: Create post works.
- Preconditions: Authenticated; optional category exists.
- Steps: Fill create form; submit.
- Expected: Redirect to `/admin`; new post visible.
- Acceptance: DB row created with correct fields.

## UAT-012: Edit post
- Trace: REQ-022, US-022, FLW-011, SEQ-011
- Objective: Editing persists changes.
- Preconditions: Existing post.
- Steps: Open edit; change title; save.
- Expected: Redirect; updated title visible; updated_at changed.
- Acceptance: DB row reflects changes.

## UAT-013: Delete post
- Trace: REQ-023, US-023, FLW-012, SEQ-012
- Objective: Deletion removes post.
- Preconditions: Existing post.
- Steps: Click delete; confirm.
- Expected: Row removed; not listed.
- Acceptance: DB count decreased by 1.

## UAT-014: Create category
- Trace: REQ-024, US-024, FLW-013, SEQ-013
- Objective: Category created.
- Preconditions: Authenticated.
- Steps: Create category.
- Expected: Appears in dropdown list.
- Acceptance: DB row present; name unique by policy.

## UAT-015: Health endpoint
- Trace: REQ-030, US-030, FLW-014, SEQ-014
- Objective: Check /health.
- Steps: GET /health.
- Expected: 200 { ok: true }.
- Acceptance: Response within 200ms locally.

## UAT-016: Migrations run
- Trace: REQ-032, US-032, FLW-015, SEQ-015
- Objective: Apply schema.
- Steps: Set DATABASE_URL; run `npm run migrate`.
- Expected: Tables created; trigger present.
- Acceptance: No errors; rerun idempotent.

## UAT-017: Docker compose stack
- Trace: REQ-033, US-033, FLW-016, SEQ-016
- Objective: Stack boots.
- Steps: `docker compose up --build`.
- Expected: DB healthy; backend 4000; frontend 3000; adminer 8080.
- Acceptance: All services reachable.

## UAT-018: Token expired UX
- Trace: REQ-043, US-042, FLW-017, SEQ-017
- Objective: Expired token handling.
- Preconditions: Expired token injected.
- Steps: Trigger a protected mutation.
- Expected: 401; redirect to login.
- Acceptance: No crash; user informed.

## UAT-019: Unauthorized mutation blocked
- Trace: REQ-013, US-013, FLW-019, SEQ-019
- Objective: No-token mutation fails.
- Steps: Call createPost without token.
- Expected: Unauthorized error.
- Acceptance: No DB changes.

## UAT-020: Post not found display
- Trace: REQ-002, US-002, FLW-020, SEQ-020
- Objective: Missing post UX.
- Steps: Open `/post/999999`.
- Expected: Not Found message.
- Acceptance: No console errors.

## UAT-021: Network failure on query
- Trace: REQ-001, US-001, FLW-021, SEQ-021
- Objective: Graceful error.
- Steps: Stop backend; open home.
- Expected: Loading stops; error message.
- Acceptance: No infinite spinners.

## UAT-022: Missing JWT on public query
- Trace: REQ-012, US-012, FLW-022, SEQ-022
- Objective: Public queries work without token.
- Steps: Clear token; refresh home.
- Expected: Posts load.
- Acceptance: No auth error.

## UAT-023: DB connectivity error surfaced
- Trace: REQ-031, US-031, FLW-023, SEQ-023
- Objective: Error propagation.
- Steps: Break DATABASE_URL; call any query.
- Expected: Error returned; logged.
- Acceptance: No sensitive details leaked.

## UAT-024: Rate limiting (proposed)
- Trace: REQ-034, US-034, FLW-024, SEQ-024
- Objective: Excess requests blocked.
- Steps: Simulate >N req/min.
- Expected: 429 responses after threshold.
- Acceptance: Legit requests pass.

## UAT-025: Pagination (proposed)
- Trace: REQ-052, US-052, FLW-025, SEQ-025
- Objective: Page navigation.
- Steps: Click Next/Prev.
- Expected: New page loads with correct items.
- Acceptance: Total counts match.

## UAT-026: SEO meta present
- Trace: REQ-005, US-005, FLW-026, SEQ-026
- Objective: Meta tags set.
- Steps: View source on home.
- Expected: Title and description present.
- Acceptance: Values match config.

## UAT-027: Image rendering
- Trace: REQ-002/021, US-002/021, FLW-027, SEQ-027
- Objective: Post image displays.
- Steps: Open a post with image_url.
- Expected: Image visible; alt set.
- Acceptance: No layout shift.

## UAT-028: Content sanitization (proposed)
- Trace: REQ-041, US-041, FLW-028, SEQ-028
- Objective: Prevent XSS.
- Steps: Submit content with HTML/script tags.
- Expected: Escaped or sanitized output.
- Acceptance: No script execution.

## UAT-029: Audit logging (proposed)
- Trace: REQ-034, US-034, FLW-029, SEQ-029
- Objective: Mutation logs recorded.
- Steps: Perform create/update/delete.
- Expected: Structured log entries with actor and action.
- Acceptance: Logs shipped to sink.

## UAT-030: Adminer DB inspection
- Trace: REQ-033, US-033, FLW-030, SEQ-030
- Objective: Validate schema via Adminer.
- Steps: Open Adminer; login; browse tables.
- Expected: Tables and columns match migration.
- Acceptance: Can query and inspect rows.

## High-Risk Areas
- Authorization ownership/roles (REQ-014/044): Validate once implemented.
- Input validation/sanitization (REQ-041): Validate length and sanitize policies.
- Pagination and performance (REQ-052): Validate UX and backend limits.

