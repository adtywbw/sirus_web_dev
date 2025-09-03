# MASTER_DASHBOARD

Detailed documentation for the Admin Dashboard module, including roles, permissions, workflows, and integration details. Traceability maintained to requirements and stories.

## Scope & Objectives
- Trace: REQ-020/021/022/023/024, US-020/021/022/023/024
- Provide authenticated authors/admins with UI to list, create, edit, and delete posts; manage categories.

## Roles & Permissions (Current vs Target)

- Current (from code): Any authenticated user can perform post/category mutations.
- Target: Distinguish Author vs Admin.
  - Author: CRUD own posts, read categories; propose Create Category: Admin-only.
  - Admin: CRUD all posts, manage categories, (future) manage users.

## UI Modules

- Dashboard Home (`/admin`)
  - List posts (title, author, created date)
  - Actions: Edit, Delete per row
  - Buttons: + New Post, Logout

- Create Post (`/admin/create`)
  - Fields: Title (required), Content (required), Image URL (optional), Category (optional)
  - Actions: Create (submit), Cancel (back to /admin)

- Edit Post (`/admin/edit/:id`)
  - Preloads post; same fields as create
  - Actions: Save (submit), Cancel

- Category Management (embedded)
  - Dropdowns fetch categories; category creation done via mutation in forms
  - Proposed: Dedicated Category page (list/create/delete) for Admins

## Workflows

- Listing
  - Query `posts` with author info, sorted by created_at desc (FLW-009, SEQ-009)
- Create
  - Mutation `createPost` with auth (FLW-010, SEQ-010)
- Edit
  - Query `post(id)` then `updatePost` (FLW-011, SEQ-011)
- Delete
  - `deletePost` with confirmation (FLW-012, SEQ-012)
- Category Create
  - `createCategory` (FLW-013, SEQ-013)

## Integrations

- Frontend
  - Apollo Client plugin reads `localStorage.token`
  - `auth` middleware enforces access to `/admin/*`
- Backend
  - JWT verification in GraphQL context
  - PostgreSQL via `pg` pool

## Security & Audit

- Current protections
  - JWT-based auth required for mutations
  - Frontend route guard on `/admin/*`
- Gaps
  - Ownership checks on `updatePost/deletePost` (REQ-014)
  - Role-based authorization (REQ-044): add `users.role` and enforce in resolvers
  - Input validation for title/content length; sanitize content before rendering (REQ-041)
  - Audit logs for mutations (REQ-034)

## Monitoring & Reporting

- Minimal: Manual observation; Adminer for DB inspection
- Proposed: Add metrics (requests, errors), action audit trails, and lightweight activity feed

## Configuration

- Env
  - `NUXT_PUBLIC_GRAPHQL_ENDPOINT` (frontend)
  - `JWT_SECRET`, `DATABASE_URL` (backend)
- Docker Compose links services for local dev

## Traceability Matrix (Dashboard subset)

- List posts: REQ-020 ↔ US-020 ↔ FLW-009 ↔ SEQ-009 ↔ UAT-010
- Create post: REQ-021 ↔ US-021 ↔ FLW-010 ↔ SEQ-010 ↔ UAT-011
- Edit post: REQ-022 ↔ US-022 ↔ FLW-011 ↔ SEQ-011 ↔ UAT-012
- Delete post: REQ-023 ↔ US-023 ↔ FLW-012 ↔ SEQ-012 ↔ UAT-013
- Create category: REQ-024 ↔ US-024 ↔ FLW-013 ↔ SEQ-013 ↔ UAT-014

## Risks & Recommendations

- Risk: Over-permissive mutations allow any user to edit/delete any post.
  - Recommendation: Implement role/ownership checks; add tests.
- Risk: Missing input validation may allow oversize payloads or XSS via content.
  - Recommendation: Apply validation and sanitize; consider Markdown + renderer.
- Risk: No pagination on admin list may degrade performance.
  - Recommendation: Add pagination controls and backend support.

