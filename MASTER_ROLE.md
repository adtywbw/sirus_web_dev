# MASTER_ROLE

System roles, permissions, and authorization model. Includes current state and proposed enhancements for least-privilege.

## Roles

- Guest: Unauthenticated visitor; can browse public content.
- Author: Authenticated user; can manage own posts; read categories.
- Admin: Elevated user; can manage all posts and categories; (future) manage users and settings.
- SuperAdmin (optional): All Admin rights plus system/ops controls (feature flags, backups). Not required initially.
- API Client (optional): Token-based client with scoped access to public queries.

Note: Current implementation has no role field; all authenticated users can perform all mutations. See Gaps.

## Permissions Matrix

Legend: C=Create, R=Read, U=Update, D=Delete

- Posts
  - Guest: R (public list/detail)
  - Author: C (own), R (all), U (own), D (own)
  - Admin: C/R/U/D (all)
  - SuperAdmin: C/R/U/D (all)

- Categories
  - Guest: R (via filtering)
  - Author: R
  - Admin: C/R/U/D
  - SuperAdmin: C/R/U/D

- Users (future)
  - Guest: —
  - Author: R (self)
  - Admin: R (all), U (limited)
  - SuperAdmin: C/R/U/D (all)

- System Health
  - All: Read `/health` (no secrets)

## Enforcement Design

- Data Model
  - Add `users.role` enum: ['AUTHOR','ADMIN'] (default 'AUTHOR').
  - For ownership: `blog_posts.author_id` already present.

- Backend Policy (Resolvers)
  - `asUser(ctx)` ensures authentication.
  - Add helpers: `isAdmin(ctx)`, `isOwner(ctx, postId)`.
  - Enforce:
    - createPost: any authenticated user (Author/Admin) allowed.
    - updatePost/deletePost: allow if `isAdmin()` or `isOwner()`; otherwise throw AuthorizationError.
    - createCategory: Admin only.

- Frontend UX
  - Hide admin-only UI if user not Admin (once role exposed in JWT/`me`).
  - Handle 401/403 by redirecting or showing “not permitted”.

## Traceability

- REQ-013/014/044 ↔ US-013/014/043 ↔ FLW-008/011/012 ↔ SEQ-008/011/012 ↔ UAT-009/012/013

## Gaps & Conflicts

- GAP-R-001: Roles absent; mutations over-permissive.
  - Fix: Add role column + constraints; migrate existing users to 'AUTHOR'.
- GAP-R-002: Ownership not enforced in `updatePost/deletePost`.
  - Fix: Add check querying `author_id` before update/delete.
- GAP-R-003: JWT does not embed role.
  - Fix: Include role in JWT claims and in `me` query; update auth middleware if needed.

