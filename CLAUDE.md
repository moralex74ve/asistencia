# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Attendance control application built with **Astro 5 (SSR mode)** using **PostgreSQL via Prisma**. Uses **JWT cookies** for authentication with **role-based access control**. Deployed on **Vercel**.

## Common Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (runs prisma generate + astro build)
pnpm preview      # Preview production build
pnpm astro        # Run Astro CLI commands
pnpm genere       # Regenerate Prisma client only
pnpm cambiar-genero  # Run gender migration script (tsx scripts/cambiar-genero.ts)
```

## Architecture

### Database (Prisma + PostgreSQL)

Schema: `prisma/schema.prisma` with models:
- **asistencia** - Attendance records (miembro + evento)
- **equipos** - Teams/groups
- **evento** - Events
- **miembros** - Members (with zona, equipo, discipulado relations)
- **discipulado** - Discipleship levels
- **integrantes_discipulado** - Join table for members ↔ discipleship levels
- **zonas** - Zones/areas
- **usuarios** - System users (auth)

Prisma client: `src/db/index.ts` - Singleton pattern to prevent connection exhaustion in dev.

### Authentication & Authorization

- JWT tokens stored in `session` cookie (httpOnly, sameSite: strict, secure in prod)
- Token payload: `{ id, rol }` with 24h expiration
- Rate limiting on login: 5 attempts per IP, 15-minute lockout (in-memory, resets on restart)
- Middleware (`src/middleware.ts`) protects routes:
  - `/dashboard`, `/listado`, `/eventos`, `/crear`, `/editar` → require authentication
  - `/users` → requires `admin` role
- CSRF protection via `jose` (signed tokens, 1h expiry) on all mutating POST routes

### Server Actions (`src/actions/`)

All use Astro's `defineAction` with Zod validation:

| Action | File | Purpose |
|--------|------|---------|
| `loginUser` | `Users/login.action.ts` | Form-based login with rate limiting |
| `getUsers` | `Users/get-users.action.ts` | Fetch all users (JSON, admin only) |
| `createUser` | `Users/user-crud.action.ts` | Create user (admin only) |
| `updateUser` | `Users/user-crud.action.ts` | Update user (admin only) |
| `deleteUser` | `Users/user-crud.action.ts` | Delete user (admin only) |

Re-exported from `src/actions/index.ts` as `server` object.

### Astro Config

- `astro.config.mjs`: Vercel adapter with `output: "server"`
- Integrations: Tailwind, Svelte
- Pages: `.astro` extension
- API routes: `.ts` in `src/pages/api/`
- Dynamic routes: `[param]` directory syntax

### Environment Variables (`.env`)

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for Prisma migrations)
- `JWT_SECRET` - Secret key for JWT signing
- `PROD` - Set to `true` in production for secure cookie
- `CSRF_SECRET` - Optional, defaults to JWT_SECRET

### Page Structure

| Route | Auth | Purpose |
|-------|------|---------|
| `/login` | Public | Login form |
| `/dashboard` | ✓ | Main menu (listado, eventos, discipulado) |
| `/listado` | ✓ | Members listing with filters |
| `/eventos` | ✓ | Event CRUD + attendance count |
| `/eventos/[id]` | ✓ | Event detail / attendance marking |
| `/eventos/[id]/llegadas` | ✓ | Arrivals check-in |
| `/crear` | ✓ | Create member |
| `/editar/[id]` | ✓ | Edit member |
| `/discipulado` | ✓ | Discipleship management |
| `/discipulado/integrantes/[nivel_cod]` | ✓ | Level members |
| `/users` | Admin | User management (CRUD) |
| `/api/logout` | ✓ | POST - destroy session |
| `/api/miembros/[id]` | ✓ | Member API |
| `/api/miembros/check-cedula` | ✓ | Check cedula uniqueness |

### Key Components

- `src/components/Nabvar.astro` - Navigation bar
- `src/components/Datos.astro` - Data display component
- `src/layouts/Layout.astro` - Base layout with Tailwind
- `src/utils/csrf.ts` - CSRF token generation/validation using `jose`

### Security Notes

- Passwords hashed with `bcryptjs` (cost 10)
- JWT verified with HS256 algorithm
- Security headers set in middleware: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- CSRF tokens in forms via hidden `_csrf` field + cookie
- Rate limiting on login (in-memory, consider Redis for production)

### Development Notes

- TypeScript strict mode enabled
- Prisma generate runs automatically on build
- Svelte 5 used for interactive components
- Flowbite for UI components
- jsPDF + autoTable for PDF reports

### Code Patterns

- **Actions**: Use `defineAction` with `accept: "form"` or `"json"`, return `{ status, body }` or throw
- **Middleware**: Check `context.locals.user` for auth, `context.locals.csrfToken` for CSRF
- **Pages**: Use `Astro.getActionResult(actions.actionName)` for action results
- **Forms**: Include `<input type="hidden" name="_csrf" value={Astro.locals.csrfToken} />`
- **Database**: Import `prisma` from `../db` (singleton client)