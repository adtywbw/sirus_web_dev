# Personal Blog Monorepo (Nuxt + Express GraphQL + Postgres)

This repository scaffolds a full‑stack personal blog per the SRS:

- Frontend: Nuxt 3 + Apollo Client
- Backend: Node.js + Express + Apollo Server (GraphQL)
- Database: PostgreSQL (with SQL migrations)

## Structure

- `apps/backend`: Express GraphQL API
- `apps/frontend`: Nuxt 3 frontend
- `docker-compose.yml`: Local Postgres + Adminer

## Quickstart

Prerequisites:
- Node.js 18+
- Docker (optional, for Postgres)

1) Start Postgres locally with Docker

```
docker compose up -d
```

Create schema:

```
psql "postgres://postgres:postgres@localhost:5432/blog" -f apps/backend/db/migrations/001_init.sql
```

2) Configure environment variables

Copy env templates and adjust if needed:

```
copy apps\backend\.env.example apps\backend\.env
copy apps\frontend\.env.example apps\frontend\.env
```

3) Install dependencies (from repo root)

```
npm install
npm --workspace apps/backend install
npm --workspace apps/frontend install
```

4) Run dev servers

In two terminals or using the root script after installing `concurrently`:

```
npm run dev:backend
npm run dev:frontend
```

Backend: http://localhost:4000/graphql  
Frontend: http://localhost:3000

## GraphQL Overview

Schema highlights:
- Queries: `posts`, `post(id)`, `categories`, `me`, `health`
- Mutations: `register`, `login`, `createPost`, `updatePost`, `deletePost`, `createCategory`

Authentication:
- JWT Bearer token support is wired in context; protect mutations as needed.

## Next Steps (per SRS phases)

- Phase 1: Adjust DB schema, add seeds, finalize env and logging.
- Phase 2: Build admin UI for CRUD (list/create/edit). Wire GraphQL operations in Nuxt.
- Phase 3 (optional): Full auth flow (login/register UI), search/filter UI.
- Phase 4: Styling with Vuetify/Ant Design, SEO meta, tests, and deployment scripts.

## Deployment Notes

- Backend: Deploy Node app (e.g., AWS, Render, Heroku) with `DATABASE_URL` and `JWT_SECRET` configured.
- Frontend: Deploy static output (`nuxt build`) or server mode as needed; configure `NUXT_PUBLIC_GRAPHQL_ENDPOINT`.
- Database: Managed Postgres (AWS RDS, Supabase, etc.).

## Security Checklist

- Hash passwords (bcrypt) — implemented in resolvers.
- Validate inputs (lengths, HTML sanitization for content if needed).
- Enforce authorization rules for admin operations.

