# Implementation Plan: Phase II Full-Stack Web Todo Application

**Branch**: `phase2-fullstack-web` | **Date**: 2025-12-31 | **Spec**: [spec.md](../features/phase2-fullstack-web.md)
**Input**: Feature specification from `/specs/features/phase2-fullstack-web.md`

---

## Summary

Build a secure, multi-user, full-stack web todo application using Next.js 14+ App Router, TypeScript, Prisma ORM with SQLite, NextAuth.js for authentication, and shadcn/ui for components. Each user can manage their own private todo list through a responsive, accessible browser interface. This is Phase II of the Evolution of Todo project, extending Phase I (CLI) to a complete web application with authentication and database persistence.

**Key Technical Approach**:
- Server-first architecture with Next.js Server Components
- Server Actions for mutations (preferred over API routes)
- JWT-based sessions with NextAuth.js
- Type-safe database access with Prisma ORM
- Local SQLite database for development
- Component library (shadcn/ui) for consistent, accessible UI
- Mobile-first responsive design with Tailwind CSS

---

## Technical Context

**Language/Version**: TypeScript 5+ with Next.js 14+ App Router
**Primary Dependencies**: Next.js, React 18+, Prisma, NextAuth.js, Tailwind CSS, shadcn/ui, Zod, bcrypt
**Storage**: SQLite (local file at `prisma/dev.db`)
**Testing**: Optional (Vitest + Playwright recommended for future phases)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application (frontend + backend unified in Next.js)
**Performance Goals**: FCP <1.5s, TTI <3s, mutations <500ms
**Constraints**: Local only, no cloud deployment, no OAuth, SQLite database
**Scale/Scope**: Multi-user (isolated data), ~100 todos per user, local development

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Strict Spec-Driven Development | PASS | All code from approved spec → plan → tasks → implement |
| II. Single Source of Truth | PASS | spec.md and plan.md define all requirements |
| III. Progressive Evolution | PASS | Phase II builds on Phase I foundation |
| IV. Clean & Hexagonal Architecture | DEFERRED | Web stack uses Next.js conventions (Server/Client Components); Clean Architecture principles applied where appropriate |
| V. Statelessness & Scalability | PARTIAL | JWT sessions (stateless), SQLite (local, not scalable) - PostgreSQL in future phases |
| VI. Security by Default | PASS | bcrypt password hashing, session security, authorization checks |
| VII. MCP Standard | N/A | Phase III+ requirement (AI chatbot integration) |
| VIII. Dapr Abstraction | N/A | Phase V requirement (K8s deployment) |
| IX. Portability & Zero Vendor Lock-in | PASS | No cloud services, SQLite easily migrates to PostgreSQL |
| X. Observability & Reproducibility | N/A | Phase IV+ requirement (monitoring, logging) |

**Quality Standards Check**:
- Type annotations: PASS (TypeScript strict mode required)
- Error handling: PASS (Comprehensive error messages, graceful failures)
- Confirmation of actions: PASS (Delete confirmation, loading states, success feedback)
- Accessibility: PASS (WCAG 2.1 AA compliance via shadcn/ui + semantic HTML)
- Responsive design: PASS (Mobile-first with Tailwind breakpoints)

**Gate Result**: PASS with notes - Architecture adapts to Next.js patterns while maintaining separation of concerns (Server Components for data, Client Components for interactivity, Server Actions for mutations).

---

## Project Structure

### Documentation (this feature)

```text
specs/phase2-fullstack-web/
├── spec.md                    # Feature specification (approved)
├── plan.md                    # This file (implementation plan)
├── research.md                # Technology decisions and patterns
├── data-model.md              # Entity definitions and database schema
├── quickstart.md              # Setup and verification guide
├── contracts/
│   └── server-actions.md      # Server Action contracts
└── tasks.md                   # Task breakdown (created by /sp.tasks)
```

### Source Code (repository root)

```text
todo-app/
├── app/                       # Next.js App Router
│   ├── (auth)/                # Auth route group (excluded from URL path)
│   │   ├── login/
│   │   │   └── page.tsx       # Login page (unauthenticated)
│   │   └── signup/
│   │       └── page.tsx       # Signup page (unauthenticated)
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts   # NextAuth API route handler
│   ├── actions/               # Server Actions (mutations)
│   │   ├── auth.ts            # signUp action
│   │   └── todos.ts           # createTodo, updateTodo, toggleTodoComplete, deleteTodo
│   ├── layout.tsx             # Root layout (metadata, fonts, providers)
│   ├── page.tsx               # Dashboard (protected, Server Component)
│   └── globals.css            # Global Tailwind styles
│
├── components/
│   ├── ui/                    # shadcn/ui components (button, input, etc.)
│   ├── auth/
│   │   ├── LoginForm.tsx      # Login form (Client Component)
│   │   └── SignupForm.tsx     # Signup form (Client Component)
│   ├── todos/
│   │   ├── TodoList.tsx       # Todo list container (Client Component)
│   │   ├── TodoItem.tsx       # Individual todo item (Client Component)
│   │   ├── CreateTodoForm.tsx # Create todo form (Client Component)
│   │   ├── EditTodoModal.tsx  # Edit modal (Client Component)
│   │   └── DeleteConfirmDialog.tsx # Delete confirmation (Client Component)
│   └── layout/
│       ├── Header.tsx         # App header with user info, logout
│       └── Navbar.tsx         # Navigation (if needed)
│
├── lib/
│   ├── auth.ts                # NextAuth configuration (authOptions)
│   ├── db.ts                  # Prisma client singleton
│   ├── validations.ts         # Zod schemas for validation
│   └── utils.ts               # shadcn/ui utilities (cn function)
│
├── prisma/
│   ├── schema.prisma          # Database schema (User, Todo models)
│   ├── migrations/            # Migration history
│   │   └── 20251231_init/
│   │       └── migration.sql
│   └── dev.db                 # SQLite database file (gitignored)
│
├── public/                    # Static assets (favicon, images)
│
├── .env.local                 # Environment variables (gitignored)
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration (strict mode)
├── package.json               # Dependencies and scripts
├── package-lock.json          # Lockfile
└── README.md                  # Project documentation
```

**Structure Decision**: Web application structure following Next.js 14+ App Router conventions. All routes in `app/` directory, components organized by feature, shared utilities in `lib/`, database layer in `prisma/`. Server Components used by default for pages, Client Components (`'use client'`) only where interactivity needed.

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations requiring justification | Constitution principles followed or appropriately deferred to future phases |

---

## Architecture Overview

### Next.js 14+ App Router Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Client Components ('use client')                              │ │
│  │  - LoginForm, SignupForm                                       │ │
│  │  - TodoList, TodoItem, CreateTodoForm                          │ │
│  │  - EditTodoModal, DeleteConfirmDialog                          │ │
│  │  - Interactive elements (buttons, forms, dialogs)              │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│                               │ Server Actions (async function calls) │
│                               ▼                                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (Node.js)                        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Server Components (default)                                   │ │
│  │  - app/page.tsx (Dashboard)                                    │ │
│  │  - app/(auth)/login/page.tsx                                   │ │
│  │  - app/(auth)/signup/page.tsx                                  │ │
│  │  - Direct Prisma queries for data fetching                     │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Server Actions ('use server')                                 │ │
│  │  - app/actions/auth.ts: signUp                                 │ │
│  │  - app/actions/todos.ts: create, update, toggle, delete        │ │
│  │  - Session validation with getServerSession()                  │ │
│  │  - Authorization checks (ownership)                            │ │
│  │  - Input validation with Zod                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  NextAuth.js (Authentication)                                  │ │
│  │  - app/api/auth/[...nextauth]/route.ts                         │ │
│  │  - Credentials Provider (email + password)                     │ │
│  │  - JWT session strategy                                        │ │
│  │  - httpOnly cookies, CSRF protection                           │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Data Access Layer (Prisma ORM)                                │ │
│  │  - lib/db.ts: Prisma Client singleton                          │ │
│  │  - Type-safe queries                                           │ │
│  │  - Parameterized queries (SQL injection protection)            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│                               ▼                                       │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SQLite Database                                │
│                      prisma/dev.db                                  │
│                                                                       │
│  Tables:                                                              │
│  - User (id, email, passwordHash, createdAt, updatedAt)             │
│  - Todo (id, title, description, completed, userId, timestamps)     │
│                                                                       │
│  Indexes:                                                             │
│  - User.email (unique)                                               │
│  - Todo.userId (foreign key, indexed)                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow: User Creates Todo

```
1. User clicks "Add Todo" button
   │
   ▼
2. CreateTodoForm (Client Component) displays
   │
   ▼
3. User enters title and description, clicks "Save"
   │
   ▼
4. Client Component calls Server Action: createTodo(title, description)
   │
   ▼
5. Server Action (app/actions/todos.ts):
   - getServerSession() → validate user authenticated
   - Zod validation → validate title (1-200 chars)
   - prisma.todo.create() → insert Todo with userId
   - revalidatePath('/') → invalidate dashboard cache
   - Return { success: true, todo }
   │
   ▼
6. Database: Todo record inserted
   │
   ▼
7. Server responds to client with result
   │
   ▼
8. Client Component:
   - if success: close form, show toast "Todo created"
   - if error: show error message
   │
   ▼
9. Dashboard re-renders with new todo (revalidation triggered)
```

### Session Flow

```
┌──────────┐
│  Signup  │
└────┬─────┘
     │
     ▼
┌────────────────────────┐
│ Server Action: signUp │
│ - Validate email/pass  │
│ - Hash password        │
│ - Create User          │
│ - Call signIn()        │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│  NextAuth: signIn      │
│ - Validate credentials │
│ - Generate JWT         │
│ - Set httpOnly cookie  │
└────┬───────────────────┘
     │
     ▼
┌────────────────────────┐
│   Session Active       │
│ - JWT stored in cookie │
│ - Valid for 7 days     │
└────┬───────────────────┘
     │
     ├─────► Server Component: getServerSession() → User data
     │
     ├─────► Server Action: getServerSession() → Validate ownership
     │
     ├─────► Middleware: Check session → Protect routes
     │
     ▼
┌────────────────────────┐
│   Logout (signOut)     │
│ - Clear JWT cookie     │
│ - Redirect to /login   │
└────────────────────────┘
```

---

## Key Implementation Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14+ App Router | RSC support, Server Actions, built-in optimizations |
| Language | TypeScript (strict mode) | Type safety, IDE support, catch errors at compile time |
| Styling | Tailwind CSS 3+ | Utility-first, mobile-first, customizable |
| Components | shadcn/ui | Accessible (Radix UI), customizable, no dependency |
| Authentication | NextAuth.js v4 | Industry standard, secure, extensible |
| Password Hashing | bcrypt (10 rounds) | Proven security, adaptive hashing |
| Database | SQLite (Prisma ORM) | Zero-config, file-based, easy PostgreSQL migration |
| Session Strategy | JWT | Stateless, no database session storage |
| Mutation Pattern | Server Actions | Type-safe, less boilerplate than API routes |
| Validation | Zod | TypeScript-first, composable schemas |
| State Management | React Server Components | No global state library needed |
| Form Handling | React hooks + Server Actions | Simple, progressive enhancement |
| Icons | Lucide React | Tree-shakable, extensive icon set |

---

## Component Breakdown

### Authentication Components

#### 1. LoginForm (Client Component)
- **Purpose**: Email/password login form
- **Location**: `components/auth/LoginForm.tsx`
- **Props**: None (manages own state)
- **State**: email, password, error, loading
- **Actions**: Calls `signIn('credentials', ...)` from NextAuth
- **Validation**: Client-side (real-time feedback) + server-side
- **UI**: Card with email input, password input, submit button, "Sign up" link
- **Error Handling**: Display generic "Invalid email or password" on failure

#### 2. SignupForm (Client Component)
- **Purpose**: Email/password signup form
- **Location**: `components/auth/SignupForm.tsx`
- **Props**: None
- **State**: email, password, confirmPassword (optional), error, loading
- **Actions**: Calls `signUp(email, password)` Server Action
- **Validation**: Password strength indicator, email format check
- **UI**: Card with email input, password input, password strength bar, submit button, "Log in" link
- **Error Handling**: Display specific errors (duplicate email, weak password)

### Todo Components

#### 3. TodoList (Client Component)
- **Purpose**: Container for all todos
- **Location**: `components/todos/TodoList.tsx`
- **Props**: `todos: Todo[]` (from Server Component)
- **State**: Local state for UI interactions (modals, dialogs)
- **Actions**: None directly (passes down to TodoItem)
- **UI**: Grid or list layout, empty state, "Add Todo" button
- **Responsive**: Single column mobile, 2-3 columns desktop

#### 4. TodoItem (Client Component)
- **Purpose**: Individual todo display and actions
- **Location**: `components/todos/TodoItem.tsx`
- **Props**: `todo: Todo`
- **State**: Optimistic completed state
- **Actions**: `toggleTodoComplete()`, open edit modal, open delete dialog
- **UI**: Checkbox, title, description, edit/delete buttons
- **Styling**: Completed todos (strikethrough, faded), hover states
- **Optimistic Updates**: Instant checkbox toggle, revert on error

#### 5. CreateTodoForm (Client Component)
- **Purpose**: Form to create new todo
- **Location**: `components/todos/CreateTodoForm.tsx`
- **Props**: None or `onSuccess: () => void` callback
- **State**: title, description, errors, loading
- **Actions**: Calls `createTodo(title, description)` Server Action
- **Validation**: Title required (1-200 chars), description optional (max 1000)
- **UI**: Modal or inline form with title input, description textarea, save/cancel buttons
- **UX**: Character counters, real-time validation, loading state

#### 6. EditTodoModal (Client Component)
- **Purpose**: Modal to edit existing todo
- **Location**: `components/todos/EditTodoModal.tsx`
- **Props**: `todo: Todo`, `open: boolean`, `onClose: () => void`
- **State**: title, description, errors, loading
- **Actions**: Calls `updateTodo(id, { title, description })` Server Action
- **UI**: Dialog with title input, description textarea, save/cancel buttons
- **Validation**: Same as create
- **UX**: Pre-fill with current values, disable save if no changes

#### 7. DeleteConfirmDialog (Client Component)
- **Purpose**: Confirmation dialog before delete
- **Location**: `components/todos/DeleteConfirmDialog.tsx`
- **Props**: `todo: Todo`, `open: boolean`, `onClose: () => void`
- **Actions**: Calls `deleteTodo(id)` Server Action
- **UI**: Dialog with warning message, todo title, "Delete" (destructive) and "Cancel" buttons
- **UX**: Emphasize destructive action (red button), keyboard shortcuts (Esc to cancel)

### Layout Components

#### 8. Header (Client/Server Component)
- **Purpose**: Top navigation bar
- **Location**: `components/layout/Header.tsx`
- **Props**: `user: { email: string }` (from session)
- **UI**: App name/logo, user email, logout button
- **Actions**: `signOut()` from NextAuth
- **Responsive**: Hamburger menu on mobile (optional)

---

## Database Layer

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  todos        Todo[]
}

model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

### Prisma Client Singleton

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

**Why Singleton**: Prevents multiple Prisma Client instances in development (hot reload).

---

## Authentication Layer

### NextAuth Configuration

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

### Route Protection (Middleware)

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};
```

**What This Does**: Protects all routes except `/login`, `/signup`, and static assets.

---

## Server Actions

See `contracts/server-actions.md` for detailed contracts.

**Summary**:
1. **signUp(email, password)**: Create user account, auto-login
2. **getTodos()**: Fetch user's todos (Server Component only)
3. **createTodo(title, description?)**: Create new todo
4. **updateTodo(id, data)**: Update todo title/description
5. **toggleTodoComplete(id)**: Toggle completed status
6. **deleteTodo(id)**: Delete todo (requires confirmation)

**Pattern**:
```typescript
'use server';

export async function actionName(params) {
  // 1. Get session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // 2. Validate inputs
  const result = schema.safeParse(params);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // 3. Check authorization (if resource-specific)
  const resource = await prisma.model.findUnique({ where: { id } });
  if (!resource || resource.userId !== session.user.id) {
    return { success: false, error: 'Not found' };
  }

  // 4. Perform operation
  try {
    const data = await prisma.model.operation({ ... });
    revalidatePath('/');
    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Operation failed. Please try again.' };
  }
}
```

---

## Validation Layer

### Zod Schemas

```typescript
// lib/validations.ts
import { z } from 'zod';

// Auth
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255)
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'At least one uppercase')
  .regex(/[a-z]/, 'At least one lowercase')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character');

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Todos
export const todoTitleSchema = z
  .string()
  .min(1, 'Title required')
  .max(200, 'Title too long')
  .trim();

export const todoDescriptionSchema = z
  .string()
  .max(1000, 'Description too long')
  .trim()
  .optional()
  .nullable();

export const createTodoSchema = z.object({
  title: todoTitleSchema,
  description: todoDescriptionSchema,
});

export const updateTodoSchema = z.object({
  title: todoTitleSchema.optional(),
  description: todoDescriptionSchema,
});

export const todoIdSchema = z.string().uuid('Invalid ID');
```

---

## Non-Functional Considerations

### Performance
- **Server Components**: Default rendering mode, less JavaScript shipped to client
- **Code Splitting**: Automatic per-route by Next.js
- **Image Optimization**: Use `next/image` for any images (future)
- **Font Optimization**: Use `next/font` for custom fonts
- **Streaming**: Suspense boundaries for progressive loading (optional)

### Security
- **Passwords**: bcrypt hashed, never stored plain text
- **Sessions**: JWT with httpOnly cookies, CSRF protection
- **Authorization**: Every Server Action checks session and ownership
- **SQL Injection**: Prisma parameterized queries
- **XSS**: React auto-escaping, no dangerouslySetInnerHTML
- **Environment Variables**: Never expose secrets to client

### Error Handling
- **Server Actions**: Try/catch, return structured errors
- **Client Components**: Display errors via toast notifications
- **Global Errors**: Error boundary for unexpected errors
- **Database Errors**: Graceful fallback messages
- **Network Errors**: Retry options (future enhancement)

### Accessibility
- **Semantic HTML**: Use proper elements (`<button>`, `<form>`, `<label>`)
- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **ARIA Labels**: Provided by shadcn/ui components
- **Focus Management**: Visible focus indicators
- **Color Contrast**: Tailwind default palette meets WCAG AA
- **Screen Reader**: Announce form errors, loading states

### Responsive Design
- **Mobile-First**: Base styles for mobile, use `sm:`, `md:`, `lg:` for larger screens
- **Touch Targets**: Min 44x44px for buttons on mobile
- **Viewport**: Meta viewport tag in layout
- **Breakpoints**: Tailwind defaults (640px, 768px, 1024px, 1280px)

---

## Development Workflow

### Setup (First Time)
1. Install dependencies: `npm install`
2. Initialize shadcn/ui: `npx shadcn@latest init`
3. Add components: `npx shadcn@latest add button input ...`
4. Create `.env.local` with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
5. Generate Prisma client: `npx prisma generate`
6. Run migrations: `npx prisma migrate dev --name init`
7. Start dev server: `npm run dev`

### Daily Development
1. Start dev server: `npm run dev`
2. Open Prisma Studio (optional): `npx prisma studio`
3. Make changes to code
4. Hot reload updates browser automatically
5. Check TypeScript errors: `npx tsc --noEmit`
6. Lint code: `npm run lint`

### Schema Changes
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <descriptive-name>`
3. Prisma Client auto-regenerated

### Testing (Optional)
1. Write tests in `__tests__/` or `*.test.ts` files
2. Run tests: `npm test` (Vitest)
3. E2E tests: `npx playwright test`

---

## Risk Analysis

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| NextAuth configuration errors | High | Medium | Follow official docs, test thoroughly, verify session persistence |
| Prisma migration conflicts | Medium | Low | Use migrations properly, avoid manual schema edits, commit migrations to git |
| Authorization bypass (users accessing others' todos) | Critical | Low | Double-check userId validation in every Server Action, write tests |
| Password reset not implemented | Low | High | Out of scope for Phase II, document as future enhancement |
| Session expiry UX | Medium | Medium | Test 7-day expiry, handle gracefully with redirect to login |
| SQLite limitations (no concurrency) | Low | High | Acceptable for local development, migrate to PostgreSQL in future phases |
| Missing edge case handling | Medium | Medium | Follow spec edge cases section, test all user flows |

---

## Deployment Strategy (Out of Scope)

Phase II focuses on local development. Future deployment considerations:
- **Platform**: Vercel (recommended), Railway, Render, or self-hosted
- **Database**: Migrate to PostgreSQL or MySQL
- **Environment**: Separate prod/staging environments
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Error tracking (Sentry), analytics (Vercel Analytics)

---

## Artifacts Generated

| Artifact | Path | Status | Description |
|----------|------|--------|-------------|
| Research | `research.md` | ✅ Complete | Technology decisions and patterns |
| Data Model | `data-model.md` | ✅ Complete | Entity definitions, Prisma schema |
| Contracts | `contracts/server-actions.md` | ✅ Complete | Server Action signatures and behavior |
| Quickstart | `quickstart.md` | ✅ Complete | Setup and verification guide |
| Plan | `plan.md` | ✅ Complete | This file (implementation plan) |
| Tasks | `tasks.md` | ⏳ Pending | Created by `/sp.tasks` command |

---

## Acceptance Criteria Summary

Implementation is complete when all criteria from `spec.md` Section 10 are met:

### Authentication (9 criteria)
- User signup, login, logout
- Duplicate email/weak password errors
- Session persistence across refresh
- Route protection (redirect unauthenticated users)

### Todo Operations (12 criteria)
- Create todo (title only, title + description)
- Toggle completion (persist across refresh)
- Edit todo (title, description)
- Delete todo (with confirmation)
- User isolation (only see own todos)

### User Interface (9 criteria)
- Responsive (mobile, tablet, desktop)
- Accessible (keyboard navigation, WCAG AA)
- Loading states, error messages, empty states

### Technical (10 criteria)
- TypeScript strict mode, zero errors
- No console errors, no unhandled rejections
- Prisma migrations successful
- shadcn/ui initialized
- Development server starts without errors
- Build process completes successfully

### Security (6 criteria)
- bcrypt password hashing
- httpOnly session cookies
- CSRF protection
- Authorization checks on all mutations
- User isolation enforced
- SQL injection protection (Prisma)

**Total**: 46 acceptance criteria

---

## Definition of Done

This feature is complete when:

1. ✅ All 46 acceptance criteria met
2. ✅ Setup commands run successfully from scratch (per quickstart.md)
3. ✅ TypeScript compiles without errors (strict mode)
4. ✅ No runtime errors in browser console
5. ✅ All user flows work as specified (Section 7 of spec.md)
6. ✅ UI responsive on mobile, tablet, desktop
7. ✅ Accessibility tested (keyboard navigation, contrast)
8. ✅ Database schema matches specification
9. ✅ Authentication and authorization functioning correctly
10. ✅ All CRUD operations persist to database
11. ✅ Code follows Next.js conventions (not Constitution principles where they conflict with Next.js patterns)
12. ✅ README updated with setup instructions
13. ✅ Tasks completed and verified (from tasks.md)
14. ✅ Demo-ready for user acceptance testing

---

## Next Steps

1. **Generate Tasks**: Run `/sp.tasks` to break down this plan into concrete implementation tasks
2. **Implementation**: Run `/sp.implement` to execute tasks incrementally
3. **Testing**: Verify each acceptance criterion after implementation
4. **User Acceptance**: Demo to user, gather feedback
5. **Documentation**: Update README with usage instructions
6. **Commit**: Create git commit with message referencing Phase II completion

---

## References

- **Specification**: `specs/features/phase2-fullstack-web.md`
- **Research**: `specs/phase2-fullstack-web/research.md`
- **Data Model**: `specs/phase2-fullstack-web/data-model.md`
- **Contracts**: `specs/phase2-fullstack-web/contracts/server-actions.md`
- **Quickstart**: `specs/phase2-fullstack-web/quickstart.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js Docs**: https://next-auth.js.org/
- **shadcn/ui Docs**: https://ui.shadcn.com/

---

**Plan Status**: ✅ Complete
**Approved By**: Pending user review
**Ready for**: `/sp.tasks` command to generate task breakdown
