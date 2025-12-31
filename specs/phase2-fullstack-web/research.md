# Research Document: Phase II Full-Stack Web Todo Application

**Feature**: phase2-fullstack-web
**Date**: 2025-12-31
**Status**: Complete

## Purpose

This document captures research findings and technology decisions for Phase II of the Evolution of Todo project. All technical unknowns from the specification have been resolved through research and documented here for reference during implementation.

---

## 1. Next.js 14+ App Router Architecture

### Decision: Use Next.js 14+ with App Router (not Pages Router)

**Rationale**:
- App Router is the current recommendation from Vercel for new projects
- Server Components by default → better performance, smaller client bundles
- Built-in support for Server Actions (preferred over API routes for mutations)
- Streaming and Suspense support out of the box
- File-based routing with layouts and nested routes
- Better TypeScript integration

**Alternatives Considered**:
1. **Next.js Pages Router**: Older, more mature, but lacks Server Components and modern patterns
2. **Remix**: Similar RSC support, but less ecosystem adoption than Next.js
3. **Vite + React Router**: More configuration, no SSR/RSC out of box

**Key Patterns**:
- `app/` directory for all routes
- `(auth)` route groups for login/signup (excluded from URL path)
- Server Components by default (add `'use client'` only when needed)
- Server Actions for mutations (preferred over API routes)
- Middleware for route protection

---

## 2. NextAuth.js v4 Integration with Credentials Provider

### Decision: Use NextAuth.js v4 with Credentials Provider only

**Rationale**:
- Industry-standard authentication library for Next.js
- Built-in session management with JWT or database sessions
- CSRF protection and security best practices
- Extensible for future OAuth providers (out of scope for Phase II)
- Works seamlessly with App Router via `next-auth@beta` adapters

**Alternatives Considered**:
1. **Lucia Auth**: Newer, more flexible, but less mature ecosystem
2. **Better Auth**: TypeScript-first, good DX, but newer and less proven
3. **Custom JWT implementation**: Too much security surface area to manage

**Implementation Pattern**:
```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !await compare(credentials.password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
```

**Session Strategy**: JWT (token-based) over database sessions for simplicity in Phase II.

**Route Protection Pattern**:
- Use `middleware.ts` for global route protection
- Use `getServerSession()` in Server Components and Server Actions
- Redirect to `/login` if unauthenticated

---

## 3. Prisma ORM with SQLite

### Decision: Prisma ORM with SQLite for local development

**Rationale**:
- **Prisma**: Type-safe query builder, excellent TypeScript support, migration system
- **SQLite**: Zero-config, file-based, perfect for local development, ACID guarantees
- Easy migration path to PostgreSQL/MySQL in future phases

**Alternatives Considered**:
1. **Drizzle ORM**: Lighter, but less mature migration tooling
2. **TypeORM**: Older, decorator-based, not as TypeScript-friendly
3. **Raw SQL**: Too much boilerplate, no type safety

**Key Patterns**:
- Centralized Prisma Client instance in `lib/db.ts`
- Use Prisma Client in Server Actions and API routes (never in Client Components)
- Migrations managed via `prisma migrate dev`
- Schema-first development (edit `schema.prisma`, generate types)

**Prisma Client Singleton**:
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 4. Server Actions vs API Routes

### Decision: Prefer Server Actions for all mutations (Create, Update, Delete, Toggle)

**Rationale**:
- **Server Actions**: Modern Next.js pattern, better DX, less boilerplate
- Automatically secure (no CSRF concerns with proper setup)
- Progressive enhancement (works without JS in simple forms)
- Colocated with Server Components
- Type-safe end-to-end with TypeScript

**When to Use API Routes**:
- External API consumers (not needed in Phase II)
- Webhooks (not needed in Phase II)
- Polling endpoints (not needed in Phase II)

**Server Action Pattern**:
```typescript
// app/actions/todos.ts
'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createTodo(title: string, description?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validation
  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Todo title is required' };
  }

  if (title.length > 200) {
    return { success: false, error: 'Title must be 200 characters or less' };
  }

  const todo = await prisma.todo.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      userId: session.user.id,
    }
  });

  revalidatePath('/');
  return { success: true, todo };
}
```

**Alternatives Considered**:
1. **API Routes**: More boilerplate, requires separate request/response handling
2. **Direct Prisma calls in components**: Not possible in Client Components, bad separation of concerns

---

## 5. shadcn/ui Component Library

### Decision: Use shadcn/ui for UI components

**Rationale**:
- Not a dependency (components copied into your project)
- Built on Radix UI (accessible, unstyled primitives)
- Tailwind CSS integration
- Full control and customization
- TypeScript-first
- Active community and ecosystem

**Alternatives Considered**:
1. **Material-UI (MUI)**: Heavier, opinionated styles, harder to customize
2. **Chakra UI**: Good DX, but more runtime overhead
3. **Headless UI**: Good, but shadcn/ui provides more complete components
4. **Custom components**: Too much work for common patterns (dialogs, forms, toasts)

**Installation Pattern**:
```bash
npx shadcn@latest init
# Choose: New York style, Neutral palette, CSS variables

npx shadcn@latest add button input label card checkbox dialog form toast
```

**Usage Pattern**:
- Import from `@/components/ui/*`
- Customize via Tailwind classes
- Extend variants using `class-variance-authority`

---

## 6. Form Handling and Validation

### Decision: Zod for validation + React Hook Form (optional, may use plain forms with Server Actions)

**Rationale**:
- **Zod**: TypeScript-first schema validation, inference, composable
- Server Actions can validate directly without client-side library
- React Hook Form optional for complex forms with field-level validation

**Pattern for Simple Forms (Server Action only)**:
```typescript
// Validation in Server Action
export async function createTodo(formData: FormData) {
  const title = formData.get('title')?.toString();

  if (!title || title.trim().length === 0) {
    return { success: false, error: 'Title required' };
  }

  // ... create todo
}
```

**Pattern for Complex Forms (Zod + React Hook Form)**:
```typescript
// lib/validations.ts
import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, 'Title required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'At least one uppercase')
    .regex(/[a-z]/, 'At least one lowercase')
    .regex(/[0-9]/, 'At least one number')
    .regex(/[^A-Za-z0-9]/, 'At least one special character'),
});
```

**Alternatives Considered**:
1. **Yup**: Older, less TypeScript-friendly
2. **Joi**: More verbose API
3. **Custom validation**: Reinventing the wheel

---

## 7. Password Hashing with bcrypt

### Decision: Use bcrypt with 10 salt rounds

**Rationale**:
- Industry standard for password hashing
- Adaptive hash function (can increase rounds for future-proofing)
- Well-tested, widely audited
- Node.js native bindings available

**Alternatives Considered**:
1. **Argon2**: More secure, but native module complications on Windows
2. **scrypt**: Good, but less ecosystem support
3. **PBKDF2**: Older, less resistant to GPU attacks

**Implementation Pattern**:
```typescript
import { hash, compare } from 'bcrypt';

// Signup
const passwordHash = await hash(password, 10);

// Login
const isValid = await compare(password, user.passwordHash);
```

**Salt Rounds**: 10 (balance between security and performance for 2025 hardware).

---

## 8. State Management

### Decision: No global state library needed; use React Server Components + Server Actions

**Rationale**:
- Server Components eliminate need for client-side data fetching
- Server Actions handle mutations and revalidation
- React `useState` sufficient for local UI state (modals, forms)
- No Redux, Zustand, or Context API needed for data layer

**Patterns**:
- **Data Fetching**: Direct Prisma queries in Server Components
- **Mutations**: Server Actions with `revalidatePath()` or `revalidateTag()`
- **Optimistic Updates**: `useOptimistic` hook for toggle/delete
- **Form State**: `useFormState` hook with Server Actions

**Example**:
```typescript
// app/page.tsx (Server Component)
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const todos = await prisma.todo.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return <TodoList todos={todos} />;
}
```

**Alternatives Considered**:
1. **Redux/Redux Toolkit**: Overkill for this simple app
2. **Zustand**: Not needed with Server Components
3. **React Context**: Not needed for data layer, maybe for theme (future)

---

## 9. Error Handling Strategy

### Decision: Structured error responses from Server Actions + client-side toast notifications

**Rationale**:
- Server Actions return `{ success: boolean, error?: string, data?: T }`
- Client components display errors via toast (shadcn/ui Sonner toast)
- Global error boundary for unexpected errors

**Pattern**:
```typescript
// Server Action
export async function deleteTodo(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    // Check ownership
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== session.user.id) {
      return { success: false, error: 'Todo not found' };
    }

    await prisma.todo.delete({ where: { id } });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Unable to delete todo. Please try again.' };
  }
}

// Client Component
'use client';
import { toast } from 'sonner';

async function handleDelete(id: string) {
  const result = await deleteTodo(id);
  if (result.success) {
    toast.success('Todo deleted');
  } else {
    toast.error(result.error);
  }
}
```

**Alternatives Considered**:
1. **Throwing errors**: Harder to handle gracefully in UI
2. **API route status codes**: More boilerplate, less type-safe
3. **Error boundaries only**: Not granular enough for form validation

---

## 10. Responsive Design Strategy

### Decision: Mobile-first with Tailwind CSS breakpoints

**Rationale**:
- Tailwind provides consistent responsive utilities
- Mobile-first approach ensures core functionality works on all devices
- shadcn/ui components are responsive by default

**Breakpoints** (Tailwind defaults):
- `sm`: 640px (mobile landscape, small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

**Pattern**:
```tsx
<div className="flex flex-col sm:flex-row gap-4">
  {/* Stacks on mobile, horizontal on tablet+ */}
</div>

<Button className="w-full sm:w-auto">
  {/* Full width on mobile, auto on tablet+ */}
</Button>
```

**Alternatives Considered**:
1. **CSS Media Queries**: More verbose, less maintainable
2. **CSS-in-JS**: Not needed with Tailwind
3. **Separate mobile/desktop views**: Over-engineering

---

## 11. Development Workflow

### Decision: TypeScript strict mode + ESLint + Prettier (Next.js defaults)

**Rationale**:
- Catch type errors at compile time
- Consistent code formatting
- Standard Next.js conventions

**Configuration**:
- TypeScript: `strict: true` in `tsconfig.json`
- ESLint: `eslint-config-next` (includes React, a11y rules)
- Prettier: Optional but recommended (integrates with ESLint)

**Key Scripts**:
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

**Pre-commit Hooks** (optional but recommended):
- Husky + lint-staged
- Run ESLint and type-check before commit

---

## 12. Testing Strategy (Optional for Phase II)

### Decision: Testing optional but recommended patterns documented

**Rationale**:
- Specification marks testing as optional for Phase II
- If implemented, use: Vitest (unit) + Playwright (E2E)

**Recommended Tools** (if testing added):
1. **Vitest**: Fast, Vite-native, Jest-compatible
2. **React Testing Library**: Test user interactions
3. **Playwright**: E2E testing, cross-browser

**Not Implemented in Phase II**:
- Unit tests (validation functions, utilities)
- Integration tests (auth flow, CRUD flow)
- E2E tests (user journeys)

---

## 13. Performance Optimization

### Decision: Use Next.js built-in optimizations

**Techniques**:
1. **Server Components**: Reduce client-side JavaScript
2. **Automatic Code Splitting**: Next.js splits by route
3. **Image Optimization**: `next/image` for future images
4. **Font Optimization**: `next/font` for custom fonts
5. **Suspense Boundaries**: Stream data, show loading states

**Not Needed in Phase II**:
- CDN (local development only)
- Caching layers (SQLite is fast enough)
- Pagination (small datasets)
- Virtualization (few todos expected)

---

## 14. Security Considerations

### Decision: Follow Next.js and NextAuth.js security best practices

**Security Measures Implemented**:
1. **Password Hashing**: bcrypt with 10 rounds
2. **Session Security**: httpOnly cookies, JWT with secure flags
3. **CSRF Protection**: NextAuth built-in
4. **SQL Injection**: Prisma parameterized queries
5. **XSS Protection**: React auto-escaping, CSP headers (future)
6. **Authorization**: Every mutation validates session.user.id === resource.userId

**Environment Variables**:
```env
NEXTAUTH_SECRET=<random-32-byte-string>
DATABASE_URL="file:./dev.db"
```

**Not Implemented** (out of scope):
- Rate limiting (optional, mentioned in spec)
- Email verification
- Password reset tokens
- 2FA

---

## 15. Accessibility (WCAG 2.1 AA)

### Decision: Use semantic HTML + shadcn/ui (built on Radix UI) for accessibility

**Techniques**:
1. **Semantic HTML**: `<button>`, `<form>`, `<label>`, `<input>`
2. **ARIA Labels**: Provided by shadcn/ui components
3. **Keyboard Navigation**: Tab order, Enter/Space for actions
4. **Focus Indicators**: Tailwind focus rings
5. **Color Contrast**: Test with tools like Lighthouse

**shadcn/ui Benefits**:
- Built on Radix UI (accessibility primitives)
- Dialog, Checkbox, Form components are keyboard-navigable
- Screen reader friendly

**Testing**:
- Lighthouse accessibility audit
- Manual keyboard navigation testing
- axe DevTools (browser extension)

---

## 16. Deployment (Not in Scope for Phase II)

### Decision: Local development only; deployment deferred to future phases

**Future Considerations**:
- Vercel (easiest for Next.js)
- Migrate SQLite → PostgreSQL for production
- Environment variable management
- CI/CD pipelines

**Phase II Scope**:
- Run locally with `npm run dev`
- No Docker, no Kubernetes, no cloud deployment

---

## Summary of Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | Full-stack framework (App Router) |
| React | 18+ | UI library |
| TypeScript | 5+ | Type safety |
| Prisma | 5+ | ORM |
| SQLite | 3+ | Database |
| NextAuth.js | 4.24+ | Authentication |
| bcrypt | 5.1+ | Password hashing |
| Tailwind CSS | 3.4+ | Styling |
| shadcn/ui | Latest | UI components |
| Zod | 3.22+ | Validation |
| Lucide React | Latest | Icons |

---

## Open Questions Resolved

All "NEEDS CLARIFICATION" items from the Technical Context have been resolved:

1. ✅ **Language/Version**: TypeScript 5+ with Next.js 14+
2. ✅ **Primary Dependencies**: Next.js, Prisma, NextAuth, Tailwind, shadcn/ui
3. ✅ **Storage**: SQLite via Prisma ORM
4. ✅ **Testing**: Optional (Vitest + Playwright recommended if added)
5. ✅ **Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
6. ✅ **Performance Goals**: <1.5s FCP, <3s TTI, <500ms mutations
7. ✅ **Constraints**: Local SQLite, no cloud, no OAuth
8. ✅ **Scale/Scope**: Multi-user (isolated todos), ~100 todos per user max

---

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)

---

**Research Status**: ✅ Complete
**Next Step**: Phase 1 - Data Model and Contracts
