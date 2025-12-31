# Server Action Contracts: Phase II Full-Stack Web Todo Application

**Feature**: phase2-fullstack-web
**Date**: 2025-12-31
**Status**: Complete

## Purpose

This document defines the contracts for all Server Actions in the application. Server Actions are the preferred method for mutations in Next.js 14+ App Router, providing type-safe, secure operations from client components.

---

## Authentication Actions

### 1. signUp

**Purpose**: Create a new user account with email and password.

**File**: `app/actions/auth.ts`

**Signature**:
```typescript
'use server';

export async function signUp(
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  user?: { id: string; email: string };
}>
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `email` | string | Yes | Valid email format, max 255 chars, lowercase |
| `password` | string | Yes | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |

**Process**:
1. Validate email and password format with Zod schemas
2. Check if email already exists in database
3. Hash password with bcrypt (10 rounds)
4. Create User record in database
5. Create NextAuth session (auto-login)
6. Return success with user data (no passwordHash)

**Output** (Success):
```typescript
{
  success: true,
  user: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "user@example.com"
  }
}
```

**Output** (Error):
```typescript
{
  success: false,
  error: "An account with this email already exists"
}
// OR
{
  success: false,
  error: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
}
// OR
{
  success: false,
  error: "Unable to create account. Please try again."
}
```

**Error Codes**:
- Email validation failure: "Invalid email format"
- Password validation failure: Specific validation error from Zod
- Duplicate email: "An account with this email already exists"
- Database error: "Unable to create account. Please try again."

**Side Effects**:
- Creates User record in database
- Creates NextAuth session (JWT cookie set)
- Redirects to `/` (dashboard) via client navigation

**Security**:
- Password never stored in plain text
- Password never returned in response
- Email normalized to lowercase
- CSRF protection via NextAuth

**Example Usage**:
```typescript
'use client';

async function handleSignup(email: string, password: string) {
  const result = await signUp(email, password);
  if (result.success) {
    router.push('/');
  } else {
    setError(result.error);
  }
}
```

---

### 2. signIn (via NextAuth)

**Purpose**: Authenticate existing user with email and password.

**File**: NextAuth configuration in `lib/auth.ts` (called via `signIn('credentials', ...)`)

**Signature**:
```typescript
// Called via NextAuth client function
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: string,
  password: string,
  redirect: false
});
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `email` | string | Yes | Must be provided |
| `password` | string | Yes | Must be provided |

**Process**:
1. NextAuth calls authorize function in CredentialsProvider
2. Look up user by email
3. Compare password with stored hash using bcrypt
4. If valid, create session with user ID and email
5. Return user object or null

**Output** (Success):
```typescript
{
  ok: true,
  error: null,
  status: 200,
  url: "/"
}
```

**Output** (Error):
```typescript
{
  ok: false,
  error: "CredentialsSignin",
  status: 401,
  url: null
}
```

**Error Handling**:
- Invalid credentials → Generic "Invalid email or password" (never reveal which is wrong)
- Database error → "Unable to log in. Please try again."

**Side Effects**:
- Creates NextAuth session (JWT cookie set)
- Redirects to `/` (dashboard) if `redirect: true`

**Security**:
- Generic error message (don't reveal if email exists)
- bcrypt timing-safe comparison
- CSRF protection via NextAuth
- Rate limiting recommended (optional)

**Example Usage**:
```typescript
'use client';

async function handleLogin(email: string, password: string) {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });

  if (result?.ok) {
    router.push('/');
  } else {
    setError('Invalid email or password');
  }
}
```

---

### 3. signOut (via NextAuth)

**Purpose**: Log out user and destroy session.

**File**: NextAuth built-in (called via `signOut()`)

**Signature**:
```typescript
import { signOut } from 'next-auth/react';

await signOut({ redirect: true, callbackUrl: '/login' });
```

**Input**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `redirect` | boolean | No | true | Whether to redirect after sign out |
| `callbackUrl` | string | No | '/login' | Where to redirect after sign out |

**Process**:
1. NextAuth destroys session
2. Clears JWT cookie
3. Redirects to callbackUrl

**Output**:
```typescript
// Redirects to /login
```

**Side Effects**:
- Destroys NextAuth session
- Clears cookies
- Redirects to login page

**Security**:
- httpOnly cookie cleared
- CSRF token invalidated

**Example Usage**:
```typescript
'use client';

async function handleLogout() {
  await signOut({ callbackUrl: '/login' });
}
```

---

## Todo CRUD Actions

### 4. getTodos

**Purpose**: Fetch all todos for the authenticated user.

**File**: `app/actions/todos.ts`

**Signature**:
```typescript
'use server';

export async function getTodos(): Promise<Todo[]>
```

**Input**: None (uses session from `getServerSession()`)

**Authorization**: User must be authenticated (session required)

**Process**:
1. Get session with `getServerSession(authOptions)`
2. If no session, return empty array
3. Query todos where `userId` matches session user ID
4. Order by `createdAt` descending (newest first)
5. Return todos

**Output** (Success):
```typescript
[
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    completed: false,
    userId: "user-id",
    createdAt: "2025-12-31T10:00:00.000Z",
    updatedAt: "2025-12-31T10:00:00.000Z"
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    title: "Finish project",
    description: null,
    completed: true,
    userId: "user-id",
    createdAt: "2025-12-30T15:30:00.000Z",
    updatedAt: "2025-12-31T09:00:00.000Z"
  }
]
```

**Output** (Unauthenticated):
```typescript
[] // Empty array
```

**Security**:
- Only returns todos owned by authenticated user
- No authorization bypass possible (query filters by userId)

**Example Usage**:
```typescript
// app/page.tsx (Server Component)
import { getTodos } from '@/app/actions/todos';

export default async function DashboardPage() {
  const todos = await getTodos();
  return <TodoList todos={todos} />;
}
```

---

### 5. createTodo

**Purpose**: Create a new todo for the authenticated user.

**File**: `app/actions/todos.ts`

**Signature**:
```typescript
'use server';

export async function createTodo(
  title: string,
  description?: string
): Promise<{
  success: boolean;
  error?: string;
  todo?: Todo;
}>
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `title` | string | Yes | 1-200 chars, trimmed, non-empty |
| `description` | string | No | Max 1000 chars, trimmed, optional |

**Authorization**: User must be authenticated

**Process**:
1. Get session with `getServerSession(authOptions)`
2. If no session, return error "Unauthorized"
3. Validate title and description with Zod schemas
4. Create Todo record with userId from session
5. Set completed = false (default)
6. Revalidate path `/` to refresh cache
7. Return success with todo

**Output** (Success):
```typescript
{
  success: true,
  todo: {
    id: "770e8400-e29b-41d4-a716-446655440002",
    title: "New todo",
    description: "Optional description",
    completed: false,
    userId: "user-id",
    createdAt: "2025-12-31T12:00:00.000Z",
    updatedAt: "2025-12-31T12:00:00.000Z"
  }
}
```

**Output** (Error):
```typescript
{
  success: false,
  error: "Unauthorized"
}
// OR
{
  success: false,
  error: "Todo title is required"
}
// OR
{
  success: false,
  error: "Title must be 200 characters or less"
}
// OR
{
  success: false,
  error: "Unable to create todo. Please try again."
}
```

**Error Codes**:
- No session: "Unauthorized"
- Empty title: "Todo title is required"
- Title too long: "Title must be 200 characters or less"
- Description too long: "Description must be 1000 characters or less"
- Database error: "Unable to create todo. Please try again."

**Side Effects**:
- Creates Todo record in database
- Revalidates `/` path (triggers re-fetch in UI)

**Security**:
- Session check before any operation
- userId automatically set from session (user cannot create todos for others)

**Example Usage**:
```typescript
'use client';

async function handleCreate(title: string, description?: string) {
  const result = await createTodo(title, description);
  if (result.success) {
    toast.success('Todo created');
    setTitle('');
    setDescription('');
  } else {
    toast.error(result.error);
  }
}
```

---

### 6. updateTodo

**Purpose**: Update title and/or description of an existing todo.

**File**: `app/actions/todos.ts`

**Signature**:
```typescript
'use server';

export async function updateTodo(
  id: string,
  data: {
    title?: string;
    description?: string;
  }
): Promise<{
  success: boolean;
  error?: string;
  todo?: Todo;
}>
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | Valid UUID |
| `data.title` | string | No | If provided: 1-200 chars, trimmed |
| `data.description` | string | No | If provided: max 1000 chars, trimmed |

**Authorization**: User must own the todo

**Process**:
1. Get session with `getServerSession(authOptions)`
2. If no session, return error "Unauthorized"
3. Validate id and update data with Zod schemas
4. Fetch todo by id
5. Verify ownership: `todo.userId === session.user.id`
6. If not owned, return error "Todo not found"
7. Update Todo record with new values
8. Revalidate path `/`
9. Return success with updated todo

**Output** (Success):
```typescript
{
  success: true,
  todo: {
    id: "770e8400-e29b-41d4-a716-446655440002",
    title: "Updated title",
    description: "Updated description",
    completed: false,
    userId: "user-id",
    createdAt: "2025-12-31T12:00:00.000Z",
    updatedAt: "2025-12-31T12:30:00.000Z" // Changed
  }
}
```

**Output** (Error):
```typescript
{
  success: false,
  error: "Unauthorized"
}
// OR
{
  success: false,
  error: "Todo not found"
}
// OR
{
  success: false,
  error: "Todo title is required"
}
// OR
{
  success: false,
  error: "Unable to update todo. Please try again."
}
```

**Error Codes**:
- No session: "Unauthorized"
- Todo not found or not owned: "Todo not found"
- Invalid title: Validation error from Zod
- Database error: "Unable to update todo. Please try again."

**Side Effects**:
- Updates Todo record in database
- Updates `updatedAt` timestamp
- Revalidates `/` path

**Security**:
- Session check
- Ownership verification (critical)
- User cannot update other users' todos

**Example Usage**:
```typescript
'use client';

async function handleUpdate(id: string, title: string, description?: string) {
  const result = await updateTodo(id, { title, description });
  if (result.success) {
    toast.success('Todo updated');
    setIsEditing(false);
  } else {
    toast.error(result.error);
  }
}
```

---

### 7. toggleTodoComplete

**Purpose**: Toggle the completed status of a todo (true ↔ false).

**File**: `app/actions/todos.ts`

**Signature**:
```typescript
'use server';

export async function toggleTodoComplete(
  id: string
): Promise<{
  success: boolean;
  error?: string;
  completed?: boolean;
}>
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | Valid UUID |

**Authorization**: User must own the todo

**Process**:
1. Get session with `getServerSession(authOptions)`
2. If no session, return error "Unauthorized"
3. Validate id (UUID format)
4. Fetch todo by id
5. Verify ownership: `todo.userId === session.user.id`
6. If not owned, return error "Todo not found"
7. Toggle completed: `!todo.completed`
8. Update Todo record
9. Revalidate path `/`
10. Return success with new completed status

**Output** (Success):
```typescript
{
  success: true,
  completed: true // New status
}
```

**Output** (Error):
```typescript
{
  success: false,
  error: "Unauthorized"
}
// OR
{
  success: false,
  error: "Todo not found"
}
// OR
{
  success: false,
  error: "Unable to update todo. Please try again."
}
```

**Error Codes**:
- No session: "Unauthorized"
- Todo not found or not owned: "Todo not found"
- Invalid ID: "Invalid todo ID"
- Database error: "Unable to update todo. Please try again."

**Side Effects**:
- Updates `completed` field in database
- Updates `updatedAt` timestamp
- Revalidates `/` path

**Security**:
- Session check
- Ownership verification

**Optimistic UI**:
This action is ideal for optimistic updates:
```typescript
'use client';
import { useOptimistic } from 'react';

function TodoItem({ todo }) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    todo.completed,
    (state) => !state
  );

  async function handleToggle() {
    setOptimisticCompleted(!todo.completed); // Immediate UI update
    const result = await toggleTodoComplete(todo.id);
    if (!result.success) {
      toast.error(result.error);
      // UI auto-reverts if optimistic update not confirmed
    }
  }

  return <Checkbox checked={optimisticCompleted} onChange={handleToggle} />;
}
```

---

### 8. deleteTodo

**Purpose**: Permanently delete a todo from the database.

**File**: `app/actions/todos.ts`

**Signature**:
```typescript
'use server';

export async function deleteTodo(
  id: string
): Promise<{
  success: boolean;
  error?: string;
}>
```

**Input**:
| Parameter | Type | Required | Validation |
|-----------|------|----------|------------|
| `id` | string | Yes | Valid UUID |

**Authorization**: User must own the todo

**Process**:
1. Get session with `getServerSession(authOptions)`
2. If no session, return error "Unauthorized"
3. Validate id (UUID format)
4. Fetch todo by id
5. Verify ownership: `todo.userId === session.user.id`
6. If not owned, return error "Todo not found"
7. Delete Todo record
8. Revalidate path `/`
9. Return success

**Output** (Success):
```typescript
{
  success: true
}
```

**Output** (Error):
```typescript
{
  success: false,
  error: "Unauthorized"
}
// OR
{
  success: false,
  error: "Todo not found"
}
// OR
{
  success: false,
  error: "Unable to delete todo. Please try again."
}
```

**Error Codes**:
- No session: "Unauthorized"
- Todo not found or not owned: "Todo not found"
- Invalid ID: "Invalid todo ID"
- Database error: "Unable to delete todo. Please try again."

**Side Effects**:
- Deletes Todo record from database (permanent)
- Revalidates `/` path

**Security**:
- Session check
- Ownership verification
- No cascade concerns (Todo is leaf entity)

**Example Usage**:
```typescript
'use client';

async function handleDelete(id: string) {
  // Show confirmation dialog first
  const confirmed = await showConfirmDialog('Are you sure you want to delete this todo?');
  if (!confirmed) return;

  const result = await deleteTodo(id);
  if (result.success) {
    toast.success('Todo deleted');
  } else {
    toast.error(result.error);
  }
}
```

---

## Helper Functions (Internal)

### getServerSession

**Purpose**: Get current user session in Server Components and Server Actions.

**File**: Imported from `next-auth`

**Signature**:
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
```

**Output**:
```typescript
{
  user: {
    id: "user-id",
    email: "user@example.com"
  },
  expires: "2025-01-07T12:00:00.000Z"
} | null
```

**Usage Pattern**:
```typescript
const session = await getServerSession(authOptions);
if (!session?.user?.id) {
  return { success: false, error: 'Unauthorized' };
}
// Proceed with authorized operation
```

---

## Error Response Format

All Server Actions follow a consistent error response format:

```typescript
type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };
```

**Example**:
```typescript
// Success with data
{ success: true, todo: { id: '...', title: '...' } }

// Success without data
{ success: true }

// Error
{ success: false, error: 'Descriptive error message' }
```

---

## Security Checklist

Every Server Action must:
- [ ] Check session with `getServerSession(authOptions)`
- [ ] Return error if no session (for protected actions)
- [ ] Validate all inputs with Zod schemas
- [ ] Verify ownership for resource-specific actions (todos)
- [ ] Use Prisma parameterized queries (automatic)
- [ ] Never expose sensitive data (passwordHash, etc.)
- [ ] Call `revalidatePath()` after mutations to refresh cache
- [ ] Handle database errors gracefully (try/catch)
- [ ] Return consistent response format

---

## Revalidation Strategy

After every mutation, revalidate the dashboard path:

```typescript
import { revalidatePath } from 'next/cache';

// After create/update/delete/toggle
revalidatePath('/'); // Revalidate dashboard
```

**Why**: Next.js caches Server Component renders. Revalidation ensures the UI reflects the latest data after mutations.

**Alternative**: `revalidateTag()` for more granular control (not needed in Phase II).

---

## Summary

**Total Server Actions**: 6
- Authentication: 1 custom (signUp) + 2 NextAuth (signIn, signOut)
- Todo CRUD: 5 (getTodos, createTodo, updateTodo, toggleTodoComplete, deleteTodo)

**All Actions**:
- Type-safe with TypeScript
- Validated with Zod
- Authorized with session checks
- Error-handled with try/catch
- Consistent response format

**Contracts Status**: ✅ Complete
**Next Step**: Generate quickstart documentation
