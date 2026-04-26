# Agent Guidelines for Asistencia Project

## Project Overview

This is an Astro + Svelte project with TypeScript, Prisma (Supabase), Tailwind CSS, and JWT authentication for managing event attendance.

## Build & Development Commands

```bash
# Development
pnpm dev              # Start Astro dev server
pnpm start            # Alias for pnpm dev

# Build
pnpm build            # Install deps, generate Prisma, build Astro
pnpm preview          # Preview production build

# Prisma
pnpm genere           # Generate Prisma client
npx prisma studio     # Open Prisma database GUI

# Manual commands (no test/lint scripts configured)
npx astro check       # Type check Astro files
npx astro dev         # Run dev server
```

## Project Structure

```
src/
├── actions/           # Astro Actions (server-side logic)
│   ├── index.ts
│   └── Users/         # User-related actions
├── components/       # Astro & Svelte components
├── db/               # Prisma client singleton
├── layouts/          # Astro layouts
├── pages/            # Astro pages (file-based routing)
│   ├── api/          # API endpoints
│   └── *.astro       # Route pages
├── middleware.ts     # JWT auth middleware
└── const.ts          # Constants
```

## Code Style Guidelines

### TypeScript

- Use explicit typing for function parameters and return types
- Prefer interfaces over types for object shapes
- Use `z` from `astro:schema` for input validation in Actions

```typescript
// Good
interface UserData {
  id: number;
  rol: string;
}

function getUser(id: number): Promise<UserData | null> {
  // ...
}

// Bad - avoid using 'any'
function getUser(id: number): any {
  /* ... */
}
```

### Imports

- Use absolute imports from package names
- Use relative imports for internal modules (`../../db`)
- Group imports: external packages, then internal modules

```typescript
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";
```

### Naming Conventions

- **Files**: kebab-case for Astro/Svelte (`login.action.ts`), PascalCase for components
- **Functions**: camelCase (`loginUser`, `getUsers`)
- **Constants**: UPPER_SNAKE_CASE for config values (`MAX_ATTEMPTS`)
- **Variables**: camelCase, descriptive names
- **Interfaces**: PascalCase (`UserData`)

### Astro Actions

- Define actions in `src/actions/` with proper input validation using `zod`
- Use `accept: "form"` for form submissions
- Return structured responses with status codes

```typescript
export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    correo: z.string().email(),
    clave: z.string(),
  }),
  handler: async ({ correo, clave }, { cookies, clientAddress }) => {
    // Implementation
    return { status: 200, body: { message: "Success" } };
  },
});
```

### Error Handling

- Use try/catch blocks for async database operations
- Return appropriate HTTP status codes (200, 401, 403, 429, 500)
- Log errors with `console.error` for debugging
- Never expose sensitive information in error messages

```typescript
try {
  const user = await prisma.usuarios.findUnique({
    /* ... */
  });
} catch (error) {
  console.error("Error durante el login:", error);
  return { status: 500, body: { message: "Error interno del servidor" } };
}
```

### Database (Prisma)

- Use singleton pattern for Prisma client (already in `src/db/index.ts`)
- Use descriptive names for queries
- Always include `where` clause for updates/deletes

### Authentication (JWT)

- JWT secret from `import.meta.env.JWT_SECRET`
- Store user data in `context.locals.user` after verification
- Use httpOnly, secure, sameSite cookies for tokens
- Verify roles for admin routes in middleware

### CSS & Styling

- Use Tailwind CSS classes in Astro/Svelte templates
- Follow Tailwind conventions (mobile-first, utility classes)
- Use `class:list` for conditional classes in Svelte

### Astro Pages

- Use frontmatter for server-side logic
- Access user data via `Astro.locals.user`
- Use `Astro.redirect()` for auth redirects

### Security

- Never commit secrets to git (use `.env` files)
- Validate all user inputs with zod schemas
- Use bcrypt for password hashing
- Implement rate limiting for login endpoints

## Environment Variables

Required in `.env`:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SUPABASE_URL=...
SUPABASE_KEY=...
```

## Running the Project

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm genere  # or: npx prisma generate

# Start dev server
pnpm dev
```

## Notes

- No test framework configured - tests should be added if needed
- No linting configured - consider adding ESLint/Prettier
- This is an Astro 5 project using the new Actions API
- Supabase is used as the database with Prisma as ORM
