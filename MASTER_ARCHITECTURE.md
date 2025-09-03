# MASTER_ARCHITECTURE

High-level architecture of the Personal Blog system derived from code and configuration.

## Overview

- Frontend: Nuxt 3 SPA/SSR app with Apollo Client
- Backend: Express + Apollo Server (GraphQL) on Node.js
- Database: PostgreSQL with SQL migrations and triggers
- Infrastructure: Docker Compose for local stack; Adminer for DB management

## Components

- Frontend App (Nuxt)
  - Pages: Home (post list), Post detail, Login, Register, Admin (list/create/edit)
  - Layouts: `default` with responsive nav
  - Middleware: `auth` protects `/admin/*`
  - Plugins: Apollo Client with auth link reads token from localStorage
  - Runtime Config: `NUXT_PUBLIC_GRAPHQL_ENDPOINT`

- Backend API (GraphQL)
  - Apollo Server with Express integration at `/graphql`
  - Context: Parses JWT from `Authorization: Bearer <token>`
  - Schema: Users, BlogPost, Category; queries and mutations
  - Resolvers: Implement CRUD with authorization check (authenticated required)
  - Health: Express `/health`, GraphQL `health`

- Database (PostgreSQL)
  - Tables: `users`, `categories`, `blog_posts`
  - Relations: `blog_posts.author_id -> users.id`, optional `category_id -> categories.id`
  - Trigger: `blog_posts_updated_at` updates `updated_at` on modification

- Dev Tooling
  - Docker Compose services: `db`, `backend`, `frontend`, `adminer`
  - Migration script: applies `001_init.sql`

## Data Flow

1) Browser calls Frontend (Nuxt) -> Apollo Client requests Backend GraphQL.
2) Backend resolvers query Postgres via `pg` pool and return structured objects.
3) For mutations needing auth, server verifies JWT; Frontend injects token via auth link.

## Dependencies

- Frontend: `nuxt@^3.12`, `@apollo/client@^3.10`, `graphql@^16.8`
- Backend: `apollo-server-express@^3`, `express`, `pg`, `jsonwebtoken`, `bcryptjs`, `graphql@^16.8`

## Integration Points

- GraphQL Endpoint: `/graphql`
- Health Endpoint: `/health`
- Database URL: `DATABASE_URL`
- Adminer: DB UI at port 8080 (local only)

## Constraints

- Node.js >= 18.17
- JWT secret must be set (`JWT_SECRET`)
- Single database instance (Postgres)
- No file storage component (images by URL only)

## Scalability Considerations

- Stateless backend; can scale horizontally behind a load balancer.
- Add connection pooling configuration to `pg` and Postgres.
- Introduce pagination (REQ-052) and indexes on `title`, `content`, `category_id`.
- Consider CDN for images when uploads are implemented (REQ-054).

## Security Considerations

- Passwords hashed with bcrypt (REQ-040)
- JWT signed; tokens expire after 7 days
- Missing role-based authorization and ownership checks (REQ-014/044)
- Input validation and content sanitization needed (REQ-041)
- CORS enabled; restrict origins in production

## Operational Concerns

- Health checks for liveness
- Logging currently console-based; add structured logging (REQ-034)
- Migrations must run before API starts in production CI/CD

