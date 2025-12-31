# Feature Specification: Phase II Full-Stack Web Todo Application

## Metadata
- **Feature ID**: phase2-fullstack-web
- **Status**: Draft
- **Created**: 2025-12-31
- **Author**: User
- **Phase**: Phase II - Web Stack
- **Dependencies**: Phase I CLI (optional reference)

---

## 1. Overview

### 1.1 Purpose
Transform the todo application from a CLI tool to a modern, secure, multi-user web application where each user can manage their own private todo list through a browser interface.

### 1.2 Success Criteria
- Users can sign up with email and password
- Users can log in and maintain sessions across browser refreshes
- Each user sees only their own todos
- All CRUD operations work correctly and persist to database
- UI is responsive, modern, and accessible
- Zero runtime errors after proper setup
- Complete authentication and authorization enforcement

### 1.3 Non-Goals (Out of Scope)
- AI chatbot interface
- Docker/Kubernetes containerization
- Cloud deployment configurations
- OAuth/Social login providers (Google, GitHub, etc.)
- External API integrations
- Real-time collaboration features
- Email verification or password reset flows

---

## 2. Technical Architecture

### 2.1 Technology Stack (Non-Negotiable)

#### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode: true)
- **Styling**: Tailwind CSS v3+
- **Component Library**: shadcn/ui (must initialize with `npx shadcn@latest init` and add components as needed)
- **Icons**: Lucide React

#### Backend
- **Framework**: Next.js 14+ App Router (Server Actions + optional API routes)
- **ORM**: Prisma
- **Database**: SQLite (local file at `prisma/dev.db`)
- **Authentication**: NextAuth.js v4 with Credentials Provider only
- **Password Hashing**: bcrypt

#### Development Tools
- **Package Manager**: npm
- **Node Version**: 18+ or 20+
- **TypeScript Config**: Strict mode enabled

### 2.2 Database Schema

#### User Model
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

#### Todo Model
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

### 2.3 Project Structure
```
todo-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── (optional API routes if not using Server Actions)
│   ├── actions/
│   │   ├── auth.ts
│   │   └── todos.ts
│   ├── layout.tsx
│   ├── page.tsx (Dashboard - protected)
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── todos/
│   │   ├── TodoList.tsx
│   │   ├── TodoItem.tsx
│   │   ├── CreateTodoForm.tsx
│   │   ├── EditTodoModal.tsx
│   │   └── DeleteConfirmDialog.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navbar.tsx
├── lib/
│   ├── auth.ts (NextAuth config)
│   ├── db.ts (Prisma client)
│   └── validations.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

#### FR-3.1.1: User Signup
- **Input**: Email (string), Password (string)
- **Validation**:
  - Email must be valid format (RFC 5322 compliant)
  - Email must be unique in database
  - Password minimum 8 characters, must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character
- **Process**:
  1. Validate input format
  2. Check email uniqueness
  3. Hash password with bcrypt (salt rounds: 10)
  4. Create User record in database
  5. Auto-login user after successful signup
- **Output**:
  - Success: Redirect to dashboard with active session
  - Failure: Display specific error message (e.g., "Email already exists", "Password too weak")
- **Error Handling**:
  - Duplicate email: "An account with this email already exists"
  - Weak password: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
  - Database error: "Unable to create account. Please try again."

#### FR-3.1.2: User Login
- **Input**: Email (string), Password (string)
- **Validation**:
  - Email must be provided
  - Password must be provided
- **Process**:
  1. Look up user by email
  2. Compare password with stored hash using bcrypt
  3. Create session with NextAuth if credentials valid
- **Output**:
  - Success: Redirect to dashboard with active session
  - Failure: "Invalid email or password" (never reveal which is wrong)
- **Error Handling**:
  - Invalid credentials: Generic message for security
  - Database error: "Unable to log in. Please try again."

#### FR-3.1.3: User Logout
- **Input**: Button click
- **Process**: Destroy session via NextAuth signOut
- **Output**: Redirect to /login page
- **Error Handling**: Silent failure, always redirect to login

#### FR-3.1.4: Session Management
- **Requirements**:
  - Sessions must persist across browser refresh
  - Session expiry: 7 days of inactivity
  - Session token stored in httpOnly cookie
  - CSRF protection enabled
- **Implementation**: NextAuth.js session strategy with JWT

#### FR-3.1.5: Route Protection
- **Protected Routes**: All routes except /login and /signup
- **Behavior**:
  - Unauthenticated users redirected to /login
  - Authenticated users accessing /login or /signup redirected to /
- **Implementation**: NextAuth middleware or per-route session checks

### 3.2 Todo CRUD Operations

#### FR-3.2.1: Create Todo
- **Input**:
  - Title (string, required, 1-200 characters)
  - Description (string, optional, 0-1000 characters)
- **Authorization**: User must be authenticated
- **Validation**:
  - Title cannot be empty or whitespace only
  - Title max length: 200 characters
  - Description max length: 1000 characters
- **Process**:
  1. Validate input
  2. Create Todo record with userId from session
  3. Set completed = false by default
  4. Refresh UI to show new todo
- **Output**:
  - Success: New todo appears in list instantly
  - Failure: Display error message
- **Error Handling**:
  - Empty title: "Todo title is required"
  - Title too long: "Title must be 200 characters or less"
  - Database error: "Unable to create todo. Please try again."

#### FR-3.2.2: Read/List Todos
- **Input**: None (uses session userId)
- **Authorization**: User must be authenticated
- **Process**:
  1. Query todos where userId matches session user
  2. Order by createdAt descending (newest first)
  3. Display in list/card format
- **Output**: List of user's todos with title, description, completed status, actions
- **Edge Cases**:
  - No todos: Display friendly empty state message ("No todos yet. Create your first todo!")
  - Large lists: Consider pagination or virtualization if >100 items

#### FR-3.2.3: Update Todo (Edit)
- **Input**:
  - Todo ID (uuid)
  - New title (string, optional)
  - New description (string, optional)
- **Authorization**: User must own the todo (userId check)
- **Validation**:
  - Same as create validation
  - Todo must exist and belong to user
- **Process**:
  1. Verify todo ownership
  2. Validate new values
  3. Update Todo record
  4. Refresh UI
- **Output**:
  - Success: Updated todo reflects changes instantly
  - Failure: Display error message
- **Error Handling**:
  - Unauthorized: "You don't have permission to edit this todo"
  - Not found: "Todo not found"
  - Validation errors: Same as create

#### FR-3.2.4: Toggle Todo Completion
- **Input**: Todo ID (uuid)
- **Authorization**: User must own the todo
- **Process**:
  1. Verify todo ownership
  2. Toggle completed field (true ↔ false)
  3. Update database
  4. Update UI instantly
- **Output**: Checkbox state reflects new completion status
- **Error Handling**:
  - Unauthorized: Silent failure or error toast
  - Not found: "Todo not found"

#### FR-3.2.5: Delete Todo
- **Input**: Todo ID (uuid)
- **Authorization**: User must own the todo
- **Process**:
  1. Show confirmation dialog ("Are you sure you want to delete this todo?")
  2. If confirmed, verify ownership
  3. Delete Todo record from database
  4. Remove from UI
- **Output**: Todo removed from list
- **Error Handling**:
  - Unauthorized: "You don't have permission to delete this todo"
  - Not found: "Todo not found"
  - Database error: "Unable to delete todo. Please try again."

### 3.3 User Interface Requirements

#### FR-3.3.1: Responsive Design
- **Mobile (320px - 767px)**:
  - Single column layout
  - Hamburger menu for navigation
  - Touch-friendly button sizes (min 44x44px)
  - Stack form fields vertically
- **Tablet (768px - 1023px)**:
  - Comfortable spacing
  - Optional side navigation
- **Desktop (1024px+)**:
  - Multi-column layout where appropriate
  - Horizontal navigation bar
  - Wider content area

#### FR-3.3.2: Accessibility (WCAG 2.1 Level AA)
- **Keyboard Navigation**: All interactive elements accessible via Tab/Shift+Tab
- **Screen Readers**: Proper ARIA labels, semantic HTML
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus states on all interactive elements
- **Form Labels**: All inputs have associated labels

#### FR-3.3.3: Visual Design
- **Color Scheme**: Modern, professional (suggest neutral base with accent color)
- **Typography**: Clear hierarchy, readable font sizes (min 16px body text)
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Components**: Use shadcn/ui for buttons, inputs, dialogs, cards, checkboxes

#### FR-3.3.4: Loading States
- **Form Submissions**: Show loading spinner on button, disable inputs
- **Page Loads**: Loading skeleton or spinner
- **Data Fetching**: Suspense boundaries where appropriate

#### FR-3.3.5: Error States
- **Form Errors**: Inline error messages below fields, red border on invalid inputs
- **Global Errors**: Toast notifications or alert banners
- **Empty States**: Friendly messages with suggested actions

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Page Load**: First Contentful Paint < 1.5s on 3G
- **Time to Interactive**: < 3s on 3G
- **Todo Operations**: Create/Update/Delete completes in < 500ms
- **Bundle Size**: Optimize with Next.js code splitting, target < 200KB initial JS

### 4.2 Security
- **Password Storage**: bcrypt with salt rounds ≥ 10
- **Session Security**: httpOnly cookies, CSRF tokens
- **SQL Injection**: Protected by Prisma parameterized queries
- **XSS Protection**: React auto-escaping, Content Security Policy headers
- **Authorization**: Every mutation validates userId ownership
- **Rate Limiting**: Optional but recommended for login/signup endpoints

### 4.3 Reliability
- **Database**: SQLite ACID guarantees
- **Error Recovery**: Graceful error handling, no unhandled promise rejections
- **Data Integrity**: Foreign key constraints, cascading deletes

### 4.4 Maintainability
- **Code Quality**: ESLint + Prettier, TypeScript strict mode
- **Component Structure**: Atomic design principles
- **Testing**: (Optional for Phase II, but recommended: Vitest/Jest + React Testing Library)
- **Documentation**: Inline comments for complex logic, README with setup steps

### 4.5 Scalability (Local Scope)
- **Database**: SQLite suitable for single-user local development
- **Performance**: Optimized queries with indexes on userId
- **Future-Proofing**: Architecture allows easy migration to PostgreSQL/MySQL

---

## 5. Data Models & Validation

### 5.1 User Model
```typescript
interface User {
  id: string; // uuid
  email: string; // unique, valid email format
  passwordHash: string; // bcrypt hash
  createdAt: Date;
  updatedAt: Date;
  todos: Todo[];
}
```

**Validation Rules**:
- `email`: Must match regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, max 255 chars
- `passwordHash`: Never expose in API responses
- Database constraint: UNIQUE on email

### 5.2 Todo Model
```typescript
interface Todo {
  id: string; // uuid
  title: string; // 1-200 chars, required
  description: string | null; // 0-1000 chars, optional
  completed: boolean; // default false
  userId: string; // foreign key
  createdAt: Date;
  updatedAt: Date;
}
```

**Validation Rules**:
- `title`: Required, trim whitespace, 1-200 characters
- `description`: Optional, trim whitespace, max 1000 characters
- `completed`: Boolean, default false
- `userId`: Must reference existing User

### 5.3 Session Model (NextAuth)
```typescript
interface Session {
  user: {
    id: string;
    email: string;
  };
  expires: string; // ISO 8601
}
```

---

## 6. API Design (Server Actions + Optional API Routes)

### 6.1 Preferred: Server Actions

#### Authentication Actions (`app/actions/auth.ts`)
```typescript
'use server';

export async function signUp(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
}>;

export async function signIn(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
}>;

export async function signOut(): Promise<void>;
```

#### Todo Actions (`app/actions/todos.ts`)
```typescript
'use server';

export async function createTodo(title: string, description?: string): Promise<{
  success: boolean;
  todo?: Todo;
  error?: string;
}>;

export async function getTodos(): Promise<Todo[]>;

export async function updateTodo(id: string, data: {
  title?: string;
  description?: string;
}): Promise<{
  success: boolean;
  todo?: Todo;
  error?: string;
}>;

export async function toggleTodoComplete(id: string): Promise<{
  success: boolean;
  error?: string;
}>;

export async function deleteTodo(id: string): Promise<{
  success: boolean;
  error?: string;
}>;
```

### 6.2 Alternative: REST API Routes (if Server Actions not used)

All routes require authentication except signup/login.

#### POST /api/auth/signup
- **Request**: `{ email: string, password: string }`
- **Response**: `{ success: true, user: { id, email } }` or `{ success: false, error: string }`
- **Status Codes**: 201 (created), 400 (validation error), 409 (conflict)

#### POST /api/auth/login
- **Request**: `{ email: string, password: string }`
- **Response**: `{ success: true }` or `{ success: false, error: string }`
- **Status Codes**: 200 (ok), 401 (unauthorized)

#### GET /api/todos
- **Auth**: Required
- **Response**: `{ todos: Todo[] }`
- **Status Codes**: 200 (ok), 401 (unauthorized)

#### POST /api/todos
- **Auth**: Required
- **Request**: `{ title: string, description?: string }`
- **Response**: `{ success: true, todo: Todo }` or `{ success: false, error: string }`
- **Status Codes**: 201 (created), 400 (validation error), 401 (unauthorized)

#### PATCH /api/todos/[id]
- **Auth**: Required
- **Request**: `{ title?: string, description?: string, completed?: boolean }`
- **Response**: `{ success: true, todo: Todo }` or `{ success: false, error: string }`
- **Status Codes**: 200 (ok), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found)

#### DELETE /api/todos/[id]
- **Auth**: Required
- **Response**: `{ success: true }` or `{ success: false, error: string }`
- **Status Codes**: 200 (ok), 401 (unauthorized), 403 (forbidden), 404 (not found)

---

## 7. User Flows

### 7.1 New User Signup Flow
1. User navigates to `/signup`
2. Enters email and password
3. Client validates format (real-time feedback)
4. Submits form
5. Server validates uniqueness and strength
6. Server hashes password and creates User
7. Server creates session
8. Redirect to `/` (dashboard)
9. User sees empty todo list with "Create your first todo" prompt

### 7.2 Returning User Login Flow
1. User navigates to `/login`
2. Enters email and password
3. Submits form
4. Server validates credentials
5. Server creates session
6. Redirect to `/` (dashboard)
7. User sees their todo list

### 7.3 Create Todo Flow
1. User on dashboard (`/`)
2. Clicks "Add Todo" or similar CTA
3. Form appears (inline or modal)
4. Enters title (required) and description (optional)
5. Submits form
6. Server validates and creates todo
7. Todo appears at top of list
8. Form resets/closes

### 7.4 Edit Todo Flow
1. User clicks "Edit" on a todo item
2. Inline editor or modal opens with current values
3. User modifies title/description
4. Submits changes
5. Server validates and updates todo
6. Updated todo reflects changes in UI
7. Editor closes

### 7.5 Toggle Completion Flow
1. User clicks checkbox on todo item
2. Optimistic UI update (instant visual feedback)
3. Server action toggles completed field
4. On success: UI state persists
5. On failure: Revert UI and show error

### 7.6 Delete Todo Flow
1. User clicks "Delete" on a todo item
2. Confirmation dialog appears
3. User confirms deletion
4. Server deletes todo
5. Todo removed from UI
6. Success feedback (optional toast)

---

## 8. Edge Cases & Error Handling

### 8.1 Authentication Edge Cases
- **Duplicate signup**: Show "Email already exists" message
- **Login with wrong password**: Generic "Invalid credentials" message
- **Session expiry**: Auto-redirect to login with "Session expired" message
- **Logout during operation**: Gracefully handle, redirect to login

### 8.2 Todo Operation Edge Cases
- **Empty title**: Prevent submission, show validation error
- **Very long title/description**: Truncate or show character count
- **Concurrent edits**: Last write wins (no conflict resolution in Phase II)
- **Delete already deleted todo**: Handle 404 gracefully
- **Toggle already deleted todo**: Handle 404 gracefully

### 8.3 Network & Database Errors
- **Database connection failure**: Show generic error, log details
- **Network timeout**: Show retry option
- **Unexpected errors**: Catch all, show "Something went wrong" message, log error

### 8.4 Browser Edge Cases
- **JavaScript disabled**: Show message "This app requires JavaScript"
- **Cookies disabled**: NextAuth will fail, show message
- **Old browsers**: Use modern features with graceful degradation or show unsupported message

---

## 9. Setup & Deployment Instructions

### 9.1 Prerequisites
- Node.js 18+ or 20+
- npm 9+
- Git

### 9.2 Initial Setup Commands (Exact)
```bash
# Clone/navigate to project directory
cd todo-app

# Install dependencies
npm install

# Install shadcn/ui (interactive, follow prompts)
npx shadcn@latest init
# Select: New York style, Neutral color, CSS variables: yes

# Add required shadcn components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add checkbox
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add toast

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with test data
npx prisma db seed

# Start development server
npm run dev
```

### 9.3 Environment Variables (.env.local)
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here-generate-with-openssl-rand-base64-32"

# Node Environment
NODE_ENV="development"
```

### 9.4 Scripts (package.json)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "prisma db seed",
    "db:reset": "prisma migrate reset"
  }
}
```

### 9.5 Verification Steps
1. Navigate to `http://localhost:3000`
2. Should redirect to `/login` (unauthenticated)
3. Navigate to `/signup`
4. Create account with email and password
5. Should auto-login and redirect to `/` (dashboard)
6. Create a new todo
7. Toggle completion checkbox
8. Edit todo title/description
9. Delete todo with confirmation
10. Logout
11. Login again and verify todos persist
12. Refresh page and verify session persists

---

## 10. Acceptance Criteria

### 10.1 Authentication
- [ ] User can sign up with email and password
- [ ] Duplicate email shows clear error message
- [ ] Weak password shows validation error
- [ ] User can log in with correct credentials
- [ ] Invalid login shows generic error message
- [ ] Session persists across browser refresh
- [ ] User can log out successfully
- [ ] Unauthenticated users redirected to /login
- [ ] Authenticated users cannot access /login or /signup (redirected to /)

### 10.2 Todo Operations
- [ ] User can create todo with title only
- [ ] User can create todo with title and description
- [ ] Empty title shows validation error
- [ ] New todo appears in list immediately
- [ ] User can toggle todo completion via checkbox
- [ ] Checkbox state persists after page refresh
- [ ] User can edit todo title
- [ ] User can edit todo description
- [ ] Updated todo reflects changes immediately
- [ ] User can delete todo after confirmation
- [ ] Deleted todo removed from UI and database
- [ ] User only sees their own todos (not other users' todos)

### 10.3 User Interface
- [ ] UI is responsive on mobile (320px+)
- [ ] UI is responsive on tablet (768px+)
- [ ] UI is responsive on desktop (1024px+)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards
- [ ] Loading states shown during async operations
- [ ] Error messages displayed clearly
- [ ] Empty state shown when no todos exist

### 10.4 Technical
- [ ] TypeScript strict mode enabled, zero type errors
- [ ] No console errors in browser
- [ ] No unhandled promise rejections
- [ ] Prisma migrations run successfully
- [ ] Database schema matches specification
- [ ] shadcn/ui initialized and components working
- [ ] NextAuth configured correctly
- [ ] All dependencies installed correctly
- [ ] Development server starts without errors
- [ ] Build process completes without errors

### 10.5 Security
- [ ] Passwords hashed with bcrypt
- [ ] Sessions use httpOnly cookies
- [ ] CSRF protection enabled
- [ ] Authorization checks on all todo mutations
- [ ] Users cannot access other users' todos
- [ ] SQL injection prevented by Prisma

---

## 11. Testing Strategy (Optional for Phase II)

### 11.1 Unit Tests
- Validation functions (email format, password strength)
- bcrypt hashing and comparison
- Server action logic

### 11.2 Integration Tests
- Auth flow: signup → login → logout
- Todo CRUD: create → read → update → delete
- Authorization: user can only access own todos

### 11.3 E2E Tests (Playwright/Cypress)
- Complete user journey: signup → create todos → manage todos → logout → login
- Protected route redirects

### 11.4 Manual Testing Checklist
See Acceptance Criteria section above.

---

## 12. Future Enhancements (Post-Phase II)

- Email verification
- Password reset flow
- Todo categories/tags
- Todo priority levels
- Due dates and reminders
- Search and filter todos
- Bulk operations (multi-select, bulk delete)
- Dark mode toggle
- User profile settings
- Export todos (JSON, CSV)
- Undo/redo functionality
- Keyboard shortcuts
- Real-time sync (if multi-device)

---

## 13. Dependencies & Installation

### 13.1 Required npm Packages
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "next-auth": "^4.24.0",
    "bcrypt": "^5.1.0",
    "@types/bcrypt": "^5.0.0",
    "zod": "^3.22.0",
    "lucide-react": "latest",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### 13.2 shadcn/ui Components (via CLI)
- button
- input
- label
- card
- checkbox
- dialog
- form
- toast
- (Others as needed: badge, separator, dropdown-menu, etc.)

---

## 14. Risk Analysis

### 14.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| NextAuth configuration errors | High | Follow official docs exactly, test thoroughly |
| Prisma migration issues | Medium | Use migrations, avoid direct schema edits |
| Session persistence bugs | High | Test across browsers, verify cookie settings |
| Authorization bypass | Critical | Double-check userId validation in all mutations |

### 14.2 Usability Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusing error messages | Medium | Use clear, actionable messages |
| Poor mobile experience | High | Test on real devices, follow mobile-first design |
| Slow load times | Medium | Optimize bundle, use Next.js best practices |

### 14.3 Development Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Medium | Strictly follow spec, defer enhancements to future |
| Tight coupling | Low | Use modular components, separation of concerns |
| Missing edge cases | Medium | Thorough testing, follow edge case section |

---

## 15. Definition of Done

This feature is considered **complete** when:

1. All acceptance criteria are met (Section 10)
2. Setup commands run successfully from scratch
3. No TypeScript errors with strict mode
4. No runtime errors in browser console
5. All user flows work as specified (Section 7)
6. UI is responsive and accessible
7. Database schema matches specification
8. Authentication and authorization working correctly
9. All CRUD operations persist to database
10. Code follows project conventions (see constitution)
11. README updated with setup and usage instructions
12. Specification approved and marked ready for planning

---

## 16. Specification Status

- **Status**: Ready for Review
- **Next Step**: Run `/sp.plan` to generate architectural plan
- **Approval Required**: Yes (user approval before implementation)
- **Blocking Issues**: None

---

## Appendix A: Example UI Mockup Descriptions

### Login Page
- Centered card on gradient background
- Logo/app name at top
- Email input field
- Password input field
- "Log In" button (full width)
- "Don't have an account? Sign up" link below
- Error message area above form

### Signup Page
- Similar layout to login
- Email input field
- Password input field (with show/hide toggle)
- Confirm password field (optional, recommended)
- "Create Account" button
- "Already have an account? Log in" link
- Password strength indicator

### Dashboard Page
- Header with app name/logo, user email, logout button
- "Add Todo" button (prominent, top-right or center)
- Todo list area:
  - Each todo as card or list item
  - Checkbox on left
  - Title (bold) and description (lighter text)
  - Edit and Delete icons on right
  - Completed todos styled differently (strikethrough, faded)
- Empty state: Icon, "No todos yet", "Create your first todo!" button

### Create/Edit Todo Form
- Modal or inline expansion
- Title input field (required indicator)
- Description textarea (optional)
- "Save" and "Cancel" buttons
- Character count for title/description

### Delete Confirmation Dialog
- Modal overlay
- "Are you sure you want to delete this todo?"
- Todo title displayed
- "Delete" (destructive/red) and "Cancel" buttons

---

## Appendix B: Configuration Files

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // shadcn/ui configuration will be added here during init
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

### prisma/schema.prisma
```prisma
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

## Sign-Off

**Specification Author**: User
**Date**: 2025-12-31
**Status**: Ready for `/sp.plan`
**Approved By**: Pending

---

**End of Specification**
