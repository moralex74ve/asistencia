# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attendance control application built with Astro 5 (SSR mode) using PostgreSQL via Prisma. Uses JWT cookies for authentication with role-based access control. Deployed on Vercel.

## Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (runs prisma generate + astro build)
pnpm preview      # Preview production build
pnpm astro        # Run Astro CLI commands
pnpm genere       # Regenerate Prisma client only
```

## Architecture

### Database (Prisma + PostgreSQL)

Schema is in `prisma/schema.prisma` with models: `asistencia`, `evento`, `miembros`, `zonas`, `usuarios`

Prisma client is exported from `src/db/index.ts` as a singleton to prevent connection exhaustion in dev.

### Authentication & Authorization

- JWT tokens stored in `session` cookie (httpOnly, sameSite: strict)
- Token contains `{ id, rol }` with 24h expiration
- Middleware (`src/middleware.ts`) protects routes:
  - `/dashboard`, `/listado`, `/eventos`, `/crear`, `/editar` require authentication
  - `/users` requires `admin` role
- Login action has rate limiting: 5 attempts per IP, 15-minute lockout

### Server Actions

All in `src/actions/` using Astro's `defineAction`:

- `src/actions/Users/login.action.ts` - Form-based login with rate limiting
- `src/actions/Users/get-users.action.ts` - Fetch all users (JSON)
- `src/actions/Users/user-crud.action.ts` - createUser, updateUser, deleteUser

Actions are re-exported from `src/actions/index.ts` as `server` object.

### Astro Config

- `astro.config.mjs` uses Vercel adapter with `output: "server"`
- Integrations: Tailwind, Svelte
- Pages with `.astro` extension; API routes use `.ts`
- Dynamic routes use `[param]` syntax in directories

### Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for Prisma migrations)
- `JWT_SECRET` - Secret key for JWT signing
- `PROD` - Set to `true` in production for secure cookie

### Page Structure

- `/login` - Login page (public)
- `/dashboard` - Main dashboard (authenticated)
- `/eventos` and `/eventos/[id]` - Event management (authenticated)
- `/crear` and `/editar/[id]` - Create/edit records (authenticated)
- `/listado` - Members listing (authenticated)
- `/users` - User management (admin only)
- `/api/logout` and `/api/miembros/[id]` - API endpoints
