# Asistencia Project Guidelines

## Essential Commands

```bash
# Development
pnpm dev              # Start Astro dev server (alias: pnpm start)

# Build
pnpm build            # Install deps, generate Prisma client, build for production
pnpm preview          # Preview production build locally

# Prisma
pnpm genere           # Generate Prisma client (after schema changes)
npx prisma studio     # Browse Supabase database

# Type checking
npx astro check       # Validate TypeScript in Astro components
```

## Key Architecture

- **Astro 5** with **Svelte** components and **TypeScript**
- **Prisma ORM** connected to **Supabase** (PostgreSQL)
- **JWT authentication** with httpOnly cookies
- **Tailwind CSS** for styling
- File-based routing via `src/pages/`

## Critical Conventions

### Authentication Middleware (`src/middleware.ts`)
- Protected routes: `/dashboard`, `/listado`, `/eventos`, `/crear`, `/editar` (require login)
- Admin routes: `/users` (require `rol: "admin"`)
- JWT stored in `session` cookie, validated on each request
- User data available in `Astro.locals.user` in pages/actions

### Login Action (`src/actions/Users/login.action.ts`)
- Rate limiting: 5 failed attempts → 15-minute lockout per IP
- Password verification via `bcryptjs`
- JWT expires in 24 hours
- Cookie settings: `httpOnly`, `secure` (production), `sameSite: "strict"`

### Database (Prisma)
- Singleton client in `src/db/index.ts`
- Models: `usuarios`, `miembros`, `eventos`, `asistencia`, `zonas`
- Always use `where` clause for updates/deletes
- Row-level security enabled (check Prisma schema for details)

### Astro Actions
- Define in `src/actions/` with Zod validation via `astro:schema`
- Use `accept: "form"` for form submissions
- Return `{ status: number, body: any }`
- Example pattern:
  ```typescript
  export const actionName = defineAction({
    accept: "form",
    input: z.object({ /* fields */ }),
    handler: async (input, { cookies }) => {
      // Logic
      return { status: 200, body: { /* data */ } };
    }
  });
```

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SUPABASE_URL=...
SUPABASE_KEY=...
```

### File & Code Style
- **Files**: kebab-case (`login.action.ts`), PascalCase for components
- **Functions**: camelCase (`loginUser`, `getUsers`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ATTEMPTS`)
- **Imports**: External first (`astro:actions`), then relative (`../../db`)
- **TypeScript**: Prefer interfaces over types, explicit return types
- **Styling**: Tailwind CSS utility classes, mobile-first approach

## Gotchas
- No test framework configured (add tests if needed)
- No linting configured (consider ESLint/Prettier)
- Rate limiting resets on server restart (in-memory storage)
- Session cookie cleared on login failure/invalid token
- Admin routes redirect to `/dashboard?error=unauthorized` on failure