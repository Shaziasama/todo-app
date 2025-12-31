# Data Model: Phase II Full-Stack Web Todo Application

**Feature**: phase2-fullstack-web
**Date**: 2025-12-31
**Status**: Complete

## Purpose

This document defines the complete data model for Phase II, including entity definitions, relationships, validation rules, state transitions, and database schema. This serves as the single source of truth for all data structures in the application.

---

## Entity Definitions

### 1. User Entity

**Purpose**: Represents an authenticated user who can manage their own private todos.

**TypeScript Interface**:
```typescript
interface User {
  id: string;           // UUID primary key
  email: string;        // Unique email address
  passwordHash: string; // bcrypt hashed password
  createdAt: Date;      // Timestamp of account creation
  updatedAt: Date;      // Timestamp of last update
  todos: Todo[];        // One-to-many relationship with Todo
}
```

**Prisma Schema**:
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  todos        Todo[]
}
```

**Field Definitions**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Primary key, auto-generated | Unique identifier for user |
| `email` | String | Unique, max 255 chars, valid email format | User's email address for login |
| `passwordHash` | String | Never null, bcrypt hash | Hashed password (bcrypt, 10 rounds) |
| `createdAt` | DateTime | Auto-set on creation | When the user account was created |
| `updatedAt` | DateTime | Auto-updated | Last modification timestamp |
| `todos` | Todo[] | Relation | All todos owned by this user |

**Validation Rules**:

```typescript
import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email must be 255 characters or less')
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Less strict for login
});
```

**Invariants**:
- Email must be unique across all users
- Password must never be stored in plain text
- `passwordHash` field must never be exposed in API responses or to client
- User cannot be deleted while todos exist (handled by cascade delete)

**State Transitions**:
- **Created**: User signs up → User record created with hashed password
- **Authenticated**: User logs in → Session created
- **Updated**: Password change (future feature) → `updatedAt` timestamp changes
- **Deleted**: (Future feature) → All todos cascade deleted

---

### 2. Todo Entity

**Purpose**: Represents a task/todo item owned by a specific user.

**TypeScript Interface**:
```typescript
interface Todo {
  id: string;              // UUID primary key
  title: string;           // Required title (1-200 chars)
  description: string | null; // Optional description (0-1000 chars)
  completed: boolean;      // Completion status
  userId: string;          // Foreign key to User
  user: User;              // Many-to-one relationship with User
  createdAt: Date;         // Timestamp of creation
  updatedAt: Date;         // Timestamp of last update
}
```

**Prisma Schema**:
```prisma
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

**Field Definitions**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | String (UUID) | Primary key, auto-generated | Unique identifier for todo |
| `title` | String | Required, 1-200 chars, trimmed | Todo title/summary |
| `description` | String? | Optional, max 1000 chars, trimmed | Detailed description of todo |
| `completed` | Boolean | Default false | Whether todo is completed |
| `userId` | String (UUID) | Foreign key, indexed | Owner of this todo |
| `user` | User | Relation | User who owns this todo |
| `createdAt` | DateTime | Auto-set on creation | When todo was created |
| `updatedAt` | DateTime | Auto-updated | Last modification timestamp |

**Validation Rules**:

```typescript
import { z } from 'zod';

export const todoTitleSchema = z
  .string()
  .min(1, 'Todo title is required')
  .max(200, 'Title must be 200 characters or less')
  .trim();

export const todoDescriptionSchema = z
  .string()
  .max(1000, 'Description must be 1000 characters or less')
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

export const todoIdSchema = z.string().uuid('Invalid todo ID');
```

**Invariants**:
- Title cannot be empty (must have at least 1 non-whitespace character after trim)
- `userId` must reference an existing User
- A todo can only be accessed/modified by its owner (authorization check required)
- `completed` defaults to `false` on creation

**State Transitions**:

```
┌─────────────┐
│   Created   │ ─────────────────────────┐
└─────────────┘                           │
       │                                  │
       │ User creates todo                │
       │ (title + optional description)   │
       ▼                                  │
┌─────────────┐                           │
│ Incomplete  │ ◄────────────────────────┤
│(completed:  │                           │
│   false)    │                           │
└─────────────┘                           │
       │                                  │
       │ User toggles complete            │
       │                                  │
       ▼                                  │
┌─────────────┐                           │
│  Complete   │                           │
│(completed:  │                           │
│   true)     │                           │
└─────────────┘                           │
       │                                  │
       │ User toggles incomplete          │
       │                                  │
       └──────────────────────────────────┘

       │ User edits (title/description)
       │ → updatedAt changes, state preserved

       │ User deletes
       ▼
┌─────────────┐
│   Deleted   │ (removed from database)
└─────────────┘
```

**Business Rules**:
1. **Create**: User must be authenticated, title required
2. **Read**: User can only see their own todos
3. **Update**: User can only update their own todos, ownership check required
4. **Toggle**: User can only toggle their own todos
5. **Delete**: User can only delete their own todos, requires confirmation in UI

---

### 3. Session Entity (NextAuth)

**Purpose**: Represents an authenticated session for a user.

**Note**: Sessions are managed by NextAuth.js using JWT strategy (not stored in database).

**TypeScript Interface** (NextAuth session object):
```typescript
interface Session {
  user: {
    id: string;     // User ID from User entity
    email: string;  // User email
  };
  expires: string;  // ISO 8601 timestamp
}
```

**JWT Token Structure** (stored in httpOnly cookie):
```typescript
interface JWT {
  id: string;       // User ID
  email: string;    // User email
  iat: number;      // Issued at (Unix timestamp)
  exp: number;      // Expiry (Unix timestamp)
  jti: string;      // JWT ID (unique)
}
```

**Session Configuration**:
- **Strategy**: JWT (token-based, no database storage)
- **Max Age**: 7 days (604800 seconds)
- **Cookie**: httpOnly, secure (HTTPS only in production), sameSite: lax
- **Refresh**: Automatic on page load if close to expiry

**Security Properties**:
- Tokens signed with `NEXTAUTH_SECRET`
- CSRF tokens generated and validated
- Session cookie cannot be accessed by JavaScript (httpOnly)
- Session automatically expires after 7 days of inactivity

---

## Relationships

### User ↔ Todo (One-to-Many)

**Relationship**: One User has many Todos; each Todo belongs to one User.

**Prisma Representation**:
```prisma
model User {
  id    String @id @default(uuid())
  // ... other fields
  todos Todo[] // One-to-many
}

model Todo {
  id     String @id @default(uuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  // ... other fields

  @@index([userId]) // Performance: fast lookups by user
}
```

**Cascade Rules**:
- `onDelete: Cascade`: If User is deleted, all their Todos are automatically deleted
- `onUpdate: Cascade`: If User ID changes (unlikely with UUID), Todo foreign keys update

**Query Patterns**:

```typescript
// Get all todos for a user
const todos = await prisma.todo.findMany({
  where: { userId: session.user.id },
  orderBy: { createdAt: 'desc' }
});

// Get a single todo with user info
const todo = await prisma.todo.findUnique({
  where: { id: todoId },
  include: { user: true }
});

// Count todos for a user
const count = await prisma.todo.count({
  where: { userId: session.user.id }
});

// Get user with all todos
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { todos: true }
});
```

---

## Database Indexes

### Performance Indexes

```prisma
model Todo {
  // ...
  @@index([userId]) // Fast filtering by user
}
```

**Rationale**:
- **`userId` index**: Most queries filter todos by user (e.g., "get all todos for user X")
- SQLite automatically indexes primary keys and unique constraints

**Future Indexes** (not needed in Phase II):
- `@@index([userId, completed])` - If filtering by completion status becomes common
- `@@index([userId, createdAt])` - If sorting/pagination by date needed

---

## Validation Summary

### Server-Side Validation (Required)

All validation happens in Server Actions before database operations:

```typescript
// app/actions/auth.ts
export async function signUp(email: string, password: string) {
  // Validate with Zod
  const result = signupSchema.safeParse({ email, password });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  // Check email uniqueness
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Hash password
  const passwordHash = await hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: { email, passwordHash }
  });

  return { success: true, user: { id: user.id, email: user.email } };
}
```

```typescript
// app/actions/todos.ts
export async function createTodo(title: string, description?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Validate with Zod
  const result = createTodoSchema.safeParse({ title, description });
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  const todo = await prisma.todo.create({
    data: {
      title: result.data.title,
      description: result.data.description || null,
      userId: session.user.id,
    }
  });

  revalidatePath('/');
  return { success: true, todo };
}
```

### Client-Side Validation (Optional, UX Enhancement)

Client-side validation provides immediate feedback but is NOT a security measure:

```typescript
// components/auth/SignupForm.tsx
'use client';

function SignupForm() {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validateEmail(email: string) {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setErrors(prev => ({ ...prev, email: result.error.errors[0].message }));
    } else {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  }

  // ... render form with real-time validation
}
```

---

## Data Access Patterns

### Authorization Pattern (Critical)

**Every data access must check ownership**:

```typescript
// CORRECT: Ownership check
export async function updateTodo(id: string, data: { title?: string; description?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Verify ownership
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== session.user.id) {
    return { success: false, error: 'Todo not found' };
  }

  // Safe to update
  const updated = await prisma.todo.update({
    where: { id },
    data: {
      title: data.title?.trim(),
      description: data.description?.trim() || null,
    }
  });

  revalidatePath('/');
  return { success: true, todo: updated };
}
```

**WRONG: Missing ownership check** (security vulnerability):
```typescript
// ❌ NEVER DO THIS
export async function updateTodo(id: string, data: any) {
  // Missing session check!
  // Missing ownership check!
  const updated = await prisma.todo.update({ where: { id }, data });
  return updated;
}
```

---

## Error Handling

### Database Errors

```typescript
try {
  const user = await prisma.user.create({ data: { email, passwordHash } });
} catch (error) {
  if (error.code === 'P2002') {
    // Unique constraint violation
    return { success: false, error: 'Email already exists' };
  }
  console.error('Database error:', error);
  return { success: false, error: 'Unable to create account. Please try again.' };
}
```

### Common Prisma Error Codes:
- `P2002`: Unique constraint violation
- `P2003`: Foreign key constraint violation
- `P2025`: Record not found (for updates/deletes)

---

## Migration Strategy

### Initial Migration

```bash
npx prisma migrate dev --name init
```

Creates the SQLite database with the schema defined in `prisma/schema.prisma`.

### Future Migrations

When schema changes:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <descriptive-name>`
3. Commit migration files to version control

**Example**: Adding a `priority` field to Todo (future enhancement):
```prisma
model Todo {
  // ... existing fields
  priority String @default("medium") // New field
}
```

```bash
npx prisma migrate dev --name add_todo_priority
```

---

## Data Seeding (Optional, for Development)

**Purpose**: Create test users and todos for local development.

**Script** (`prisma/seed.ts`):
```typescript
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const passwordHash = await hash('TestPass123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash,
    }
  });

  // Create sample todos
  await prisma.todo.createMany({
    data: [
      { title: 'Welcome to your todo app', description: 'This is a sample todo', userId: user.id },
      { title: 'Try marking a todo as complete', userId: user.id },
      { title: 'You can also edit todos', description: 'Click the edit button to try', userId: user.id, completed: true },
    ]
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run**: `npx prisma db seed`

---

## Complete Prisma Schema

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

---

## Summary

**Entities**: 2 (User, Todo)
**Relationships**: 1 (User has many Todos)
**Indexes**: 1 (userId on Todo)
**Validation**: Zod schemas for all inputs
**Authorization**: Ownership checks on all mutations
**Security**: bcrypt password hashing, JWT sessions

**Data Model Status**: ✅ Complete
**Next Step**: Define API/Server Action contracts
