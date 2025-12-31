# Tasks: Phase II Full-Stack Web Todo Application

**Input**: Design documents from `/specs/phase2-fullstack-web/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/server-actions.md

**Tests**: Tests are OPTIONAL per specification (Section 11). Not included in this task breakdown.

**Organization**: Tasks organized sequentially following implementation phases: Setup → Foundational → User Stories → Polish

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US6)
- Include exact file paths in descriptions

## Path Conventions

Next.js 14+ App Router structure:
- **Routes**: `app/` directory
- **Components**: `components/` directory
- **Libraries**: `lib/` directory
- **Database**: `prisma/` directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Next.js project with TypeScript, Tailwind CSS, and shadcn/ui

- [ ] T201 Create Next.js 14+ project with TypeScript and App Router at repository root
- [ ] T202 Configure TypeScript with strict mode in tsconfig.json
- [ ] T203 [P] Configure Tailwind CSS v3+ in tailwind.config.ts
- [ ] T204 [P] Initialize shadcn/ui with New York style, Neutral color, CSS variables
- [ ] T205 [P] Add shadcn/ui components: button, input, label, card, checkbox, dialog, form, toast
- [ ] T206 [P] Create lib/utils.ts with cn utility function (shadcn/ui helper)
- [ ] T207 [P] Configure environment variables template in .env.local.example
- [ ] T208 [P] Update .gitignore to exclude .env.local, dev.db, node_modules

**Expected Behavior**: `npm run dev` starts Next.js server on port 3000 with default page

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T209 Create Prisma schema with User and Todo models in prisma/schema.prisma
- [ ] T210 Configure DATABASE_URL in .env.local for SQLite (file:./dev.db)
- [ ] T211 Generate Prisma Client with `npx prisma generate`
- [ ] T212 Run initial database migration with `npx prisma migrate dev --name init`
- [ ] T213 Create Prisma client singleton in lib/db.ts
- [ ] T214 [P] Create Zod validation schemas in lib/validations.ts (email, password, todo)
- [ ] T215 [P] Configure NextAuth.js options in lib/auth.ts with Credentials Provider
- [ ] T216 [P] Create NextAuth API route in app/api/auth/[...nextauth]/route.ts
- [ ] T217 [P] Create middleware.ts for route protection (redirect unauthenticated to /login)
- [ ] T218 [P] Create root layout in app/layout.tsx with SessionProvider and Toaster
- [ ] T219 [P] Create global styles in app/globals.css with Tailwind directives

**Checkpoint**: Foundation ready - database migrated, auth configured, routing protected

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP Core

**Goal**: Users can sign up with email/password and log in to access their account

**Independent Test**: Navigate to /signup, create account with email test@example.com and password TestPass123!, auto-redirect to dashboard, refresh browser and verify session persists

### Implementation for User Story 1

- [ ] T220 [P] [US1] Create signup page component in app/(auth)/signup/page.tsx
- [ ] T221 [P] [US1] Create login page component in app/(auth)/login/page.tsx
- [ ] T222 [P] [US1] Create SignupForm client component in components/auth/SignupForm.tsx
- [ ] T223 [P] [US1] Create LoginForm client component in components/auth/LoginForm.tsx
- [ ] T224 [US1] Implement signUp Server Action in app/actions/auth.ts (email validation, bcrypt hash, create user, auto-login)
- [ ] T225 [US1] Add email uniqueness check and error handling in signUp action
- [ ] T226 [US1] Add password strength validation in SignupForm (real-time feedback)
- [ ] T227 [US1] Wire up LoginForm to NextAuth signIn with credentials provider
- [ ] T228 [US1] Add error display for invalid credentials in LoginForm
- [ ] T229 [US1] Test signup flow: create account → auto-login → redirect to /
- [ ] T230 [US1] Test login flow: enter credentials → redirect to /
- [ ] T231 [US1] Test session persistence: refresh browser → still logged in
- [ ] T232 [US1] Test protected route: access / while logged out → redirect to /login

**Checkpoint**: User can sign up, log in, and sessions persist across refresh. Protected routes redirect unauthenticated users.

---

## Phase 4: User Story 2 - View Todos (Priority: P1) 🎯 MVP Core

**Goal**: Authenticated users see their todo list (empty state initially, then populated)

**Independent Test**: Log in as test@example.com, see dashboard with "No todos yet" message

### Implementation for User Story 2

- [ ] T233 [US2] Create dashboard page (Server Component) in app/page.tsx that fetches user's todos
- [ ] T234 [US2] Implement getTodos helper function in app/page.tsx using getServerSession + Prisma query
- [ ] T235 [P] [US2] Create TodoList client component in components/todos/TodoList.tsx
- [ ] T236 [P] [US2] Create TodoItem client component in components/todos/TodoItem.tsx
- [ ] T237 [P] [US2] Create Header component in components/layout/Header.tsx with user email and logout button
- [ ] T238 [US2] Add empty state UI in TodoList component ("No todos yet. Create your first todo!")
- [ ] T239 [US2] Add logout button functionality in Header using NextAuth signOut
- [ ] T240 [US2] Style TodoList with responsive grid/list layout (mobile: 1 column, desktop: 2-3 columns)
- [ ] T241 [US2] Test empty state: log in → see "No todos yet" message
- [ ] T242 [US2] Test logout: click logout → redirect to /login

**Checkpoint**: Dashboard displays empty todo list with proper layout and logout functionality

---

## Phase 5: User Story 3 - Create Todos (Priority: P1) 🎯 MVP Core

**Goal**: Users can create new todos with title (required) and description (optional)

**Independent Test**: Click "Add Todo" button, enter title "Buy groceries" and description "Milk, eggs, bread", click Save, see new todo appear in list

### Implementation for User Story 3

- [ ] T243 [P] [US3] Create CreateTodoForm client component in components/todos/CreateTodoForm.tsx
- [ ] T244 [US3] Implement createTodo Server Action in app/actions/todos.ts (session check, validation, Prisma create)
- [ ] T245 [US3] Add title input with character counter (max 200) in CreateTodoForm
- [ ] T246 [US3] Add description textarea with character counter (max 1000) in CreateTodoForm
- [ ] T247 [US3] Add form validation: title required, trim whitespace, max length checks
- [ ] T248 [US3] Wire up CreateTodoForm to createTodo Server Action with error handling
- [ ] T249 [US3] Add "Add Todo" button to dashboard that opens CreateTodoForm (modal or inline)
- [ ] T250 [US3] Add loading state to Save button (spinner, disabled inputs)
- [ ] T251 [US3] Add success toast notification after todo created
- [ ] T252 [US3] Call revalidatePath('/') in createTodo action to refresh todo list
- [ ] T253 [US3] Test create todo: add "Buy groceries" → appears at top of list
- [ ] T254 [US3] Test validation: try empty title → error message displayed
- [ ] T255 [US3] Test character limits: exceed 200 chars → error message

**Checkpoint**: Users can create todos with title and description. Todos appear in list immediately with validation.

---

## Phase 6: User Story 4 - Toggle Completion (Priority: P1) 🎯 MVP Core

**Goal**: Users can mark todos as complete/incomplete by clicking checkbox

**Independent Test**: Click checkbox next to "Buy groceries" → todo styled as complete (strikethrough, faded), refresh page → checkbox state persists

### Implementation for User Story 4

- [ ] T256 [US4] Implement toggleTodoComplete Server Action in app/actions/todos.ts (session check, ownership verification, toggle completed field)
- [ ] T257 [US4] Add Checkbox component from shadcn/ui to TodoItem
- [ ] T258 [US4] Wire up Checkbox onChange to toggleTodoComplete Server Action
- [ ] T259 [US4] Add optimistic update using useOptimistic hook for instant checkbox feedback
- [ ] T260 [US4] Style completed todos: strikethrough title, faded opacity, gray text
- [ ] T261 [US4] Add error handling: on failure, show toast and revert optimistic update
- [ ] T262 [US4] Test toggle complete: check box → todo styled as complete
- [ ] T263 [US4] Test toggle incomplete: uncheck box → todo styled as active
- [ ] T264 [US4] Test persistence: toggle complete, refresh page → checkbox state persists

**Checkpoint**: Checkbox toggling works with optimistic updates and persists to database

---

## Phase 7: User Story 5 - Edit Todos (Priority: P2)

**Goal**: Users can edit todo title and description via modal dialog

**Independent Test**: Click edit icon on "Buy groceries", change title to "Buy groceries and snacks", update description, click Save, see changes reflected immediately

### Implementation for User Story 5

- [ ] T265 [P] [US5] Create EditTodoModal client component in components/todos/EditTodoModal.tsx
- [ ] T266 [US5] Implement updateTodo Server Action in app/actions/todos.ts (session check, ownership verification, validation, Prisma update)
- [ ] T267 [US5] Add edit button (icon) to TodoItem that opens EditTodoModal
- [ ] T268 [US5] Pre-fill EditTodoModal form with current todo title and description
- [ ] T269 [US5] Add form validation in EditTodoModal: same rules as create (title required, max lengths)
- [ ] T270 [US5] Wire up EditTodoModal to updateTodo Server Action with error handling
- [ ] T271 [US5] Add loading state to Save button in EditTodoModal
- [ ] T272 [US5] Add success toast notification after todo updated
- [ ] T273 [US5] Call revalidatePath('/') in updateTodo action to refresh todo list
- [ ] T274 [US5] Test edit todo: change title → see updated title in list
- [ ] T275 [US5] Test edit validation: clear title → error message displayed
- [ ] T276 [US5] Test cancel: open edit modal, make changes, cancel → changes discarded

**Checkpoint**: Users can edit todos via modal with validation and instant UI updates

---

## Phase 8: User Story 6 - Delete Todos (Priority: P2)

**Goal**: Users can delete todos with confirmation dialog to prevent accidents

**Independent Test**: Click delete icon on "Buy groceries", see confirmation dialog "Are you sure you want to delete this todo?", confirm → todo removed from list

### Implementation for User Story 6

- [ ] T277 [P] [US6] Create DeleteConfirmDialog client component in components/todos/DeleteConfirmDialog.tsx
- [ ] T278 [US6] Implement deleteTodo Server Action in app/actions/todos.ts (session check, ownership verification, Prisma delete)
- [ ] T279 [US6] Add delete button (icon) to TodoItem that opens DeleteConfirmDialog
- [ ] T280 [US6] Display todo title in DeleteConfirmDialog for confirmation
- [ ] T281 [US6] Wire up DeleteConfirmDialog "Delete" button to deleteTodo Server Action
- [ ] T282 [US6] Add loading state to Delete button in dialog
- [ ] T283 [US6] Add success toast notification after todo deleted
- [ ] T284 [US6] Call revalidatePath('/') in deleteTodo action to refresh todo list
- [ ] T285 [US6] Style Delete button as destructive (red) in dialog
- [ ] T286 [US6] Test delete todo: confirm deletion → todo removed from list
- [ ] T287 [US6] Test cancel delete: open dialog, click cancel → todo not deleted
- [ ] T288 [US6] Test keyboard shortcuts: Escape to cancel, Enter to confirm (if applicable)

**Checkpoint**: Users can delete todos with confirmation dialog and instant UI updates

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements for production-ready application

- [ ] T289 [P] Add loading skeleton to dashboard while todos are fetching (Suspense boundary)
- [ ] T290 [P] Add form error states: red border on invalid inputs, inline error messages
- [ ] T291 [P] Add global error boundary in app/error.tsx for unexpected errors
- [ ] T292 [P] Verify responsive design on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] T293 [P] Test accessibility: keyboard navigation (Tab, Enter, Esc), focus indicators visible
- [ ] T294 [P] Test accessibility: screen reader compatibility (ARIA labels from shadcn/ui)
- [ ] T295 [P] Add favicon and app metadata in app/layout.tsx
- [ ] T296 [P] Optimize bundle size: verify Next.js automatic code splitting working
- [ ] T297 [P] Run TypeScript type check: `npx tsc --noEmit` with zero errors
- [ ] T298 [P] Run ESLint: `npm run lint` with zero warnings/errors
- [ ] T299 [P] Test build process: `npm run build` succeeds without errors
- [ ] T300 Update README.md with setup instructions from quickstart.md
- [ ] T301 Verify all 46 acceptance criteria from spec.md Section 10
- [ ] T302 Run complete quickstart.md verification steps
- [ ] T303 Test session expiry: wait 7+ days or manually expire JWT → redirect to login

**Checkpoint**: Application is production-ready, all acceptance criteria met, zero TypeScript/ESLint errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T201-T208) completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational (T209-T219) completion
  - US1 (Auth): Can start after Foundational - No dependencies on other stories
  - US2 (View): Depends on US1 (must be logged in to view) - T220-T232 complete
  - US3 (Create): Depends on US1 + US2 (must be logged in, need dashboard) - T220-T242 complete
  - US4 (Toggle): Depends on US1 + US2 + US3 (need todos to toggle) - T220-T255 complete
  - US5 (Edit): Depends on US1 + US2 + US3 (need todos to edit) - T220-T255 complete
  - US6 (Delete): Depends on US1 + US2 + US3 (need todos to delete) - T220-T255 complete
- **Polish (Phase 9)**: Depends on all user stories (T220-T288) being complete

### Sequential Flow (MVP Order)

**Critical Path** (minimum viable product):
1. T201-T208: Setup
2. T209-T219: Foundational
3. T220-T232: US1 Authentication
4. T233-T242: US2 View Todos
5. T243-T255: US3 Create Todos
6. T256-T264: US4 Toggle Completion

**Enhanced Features** (can be deferred):
7. T265-T276: US5 Edit Todos
8. T277-T288: US6 Delete Todos
9. T289-T303: Polish

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T203-T208 can all run in parallel after T201-T202

**Within Foundational (Phase 2)**:
- T214-T219 can run in parallel after T209-T213

**Within User Stories**:
- T220-T221 (signup/login pages) can run in parallel
- T222-T223 (form components) can run in parallel
- T233-T236 (dashboard components) can run in parallel after their dependencies
- T243 (CreateTodoForm) can be built in parallel with other components
- All polish tasks (T289-T299) can run in parallel

### Parallel Example: Foundational Phase

```bash
# After T209-T213 complete, launch these in parallel:
Task: "Create Zod validation schemas in lib/validations.ts"
Task: "Configure NextAuth.js options in lib/auth.ts"
Task: "Create NextAuth API route in app/api/auth/[...nextauth]/route.ts"
Task: "Create middleware.ts for route protection"
Task: "Create root layout in app/layout.tsx"
Task: "Create global styles in app/globals.css"
```

### Parallel Example: User Story 1

```bash
# Launch these together:
Task: "Create signup page component in app/(auth)/signup/page.tsx"
Task: "Create login page component in app/(auth)/login/page.tsx"

# Then launch these together:
Task: "Create SignupForm client component in components/auth/SignupForm.tsx"
Task: "Create LoginForm client component in components/auth/LoginForm.tsx"
```

---

## Implementation Strategy

### MVP First (Core Features Only)

**Deliverable**: Working authentication + todo viewing + creating + toggling

1. Complete Phase 1: Setup (T201-T208)
2. Complete Phase 2: Foundational (T209-T219) - CRITICAL BLOCKER
3. Complete Phase 3: US1 Authentication (T220-T232)
4. Complete Phase 4: US2 View Todos (T233-T242)
5. Complete Phase 5: US3 Create Todos (T243-T255)
6. Complete Phase 6: US4 Toggle Completion (T256-T264)
7. **STOP and VALIDATE**: Test all MVP features independently
8. Demo to user

**MVP Acceptance Criteria** (from spec.md):
- ✅ User signup working
- ✅ User login working with session persistence
- ✅ Protected routes redirect unauthenticated users
- ✅ Dashboard displays todos (empty state initially)
- ✅ Create todo working with validation
- ✅ Toggle completion working with persistence
- ✅ Responsive UI on mobile/desktop
- ✅ Zero runtime errors

### Incremental Delivery (Full Features)

**Post-MVP additions** (can ship separately):

9. Add Phase 7: US5 Edit Todos (T265-T276) → Deploy
10. Add Phase 8: US6 Delete Todos (T277-T288) → Deploy
11. Add Phase 9: Polish (T289-T303) → Final production release

### Task Execution Tips

- **Before starting**: Verify all Foundational tasks (T209-T219) are complete
- **Per task**: Read plan.md and contracts/ for implementation details
- **After each task**: Test the specific functionality added
- **After each story**: Test the complete user story end-to-end
- **Commits**: Commit after each task or logical group (e.g., all auth forms)
- **Errors**: If TypeScript errors appear, resolve before continuing
- **Checkpoints**: Stop at each checkpoint to validate independently

---

## File Creation Summary

**Total Files to Create/Modify**: ~40 files

### Configuration (8 files)
- tsconfig.json, tailwind.config.ts, next.config.js
- .env.local, .gitignore, package.json
- middleware.ts, prisma/schema.prisma

### App Router (6 files)
- app/layout.tsx, app/page.tsx, app/globals.css
- app/(auth)/login/page.tsx, app/(auth)/signup/page.tsx
- app/api/auth/[...nextauth]/route.ts

### Server Actions (2 files)
- app/actions/auth.ts
- app/actions/todos.ts

### Components (11 files)
- components/auth/LoginForm.tsx, SignupForm.tsx
- components/todos/TodoList.tsx, TodoItem.tsx, CreateTodoForm.tsx, EditTodoModal.tsx, DeleteConfirmDialog.tsx
- components/layout/Header.tsx
- components/ui/* (8 shadcn components: button, input, label, card, checkbox, dialog, form, toast)

### Libraries (4 files)
- lib/auth.ts, lib/db.ts, lib/validations.ts, lib/utils.ts

### Database (2+ files)
- prisma/schema.prisma
- prisma/migrations/*/migration.sql (generated)

---

## Validation Checklist

Before marking Phase II complete, verify:

- [ ] All 303 tasks completed (T201-T303)
- [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
- [ ] ESLint passes with zero warnings (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] All 46 acceptance criteria from spec.md Section 10 met
- [ ] Quickstart.md verification steps pass
- [ ] Demo recorded showing all user flows (signup → create → toggle → edit → delete → logout → login)

---

## Notes

- **[P] tasks** = Different files, no dependencies between them
- **[Story] labels** = Maps task to specific user story for traceability
- **File paths** = Always absolute or relative to repository root
- **Sequential execution** = Follow task order (T201 → T202 → T303)
- **Parallel execution** = Tasks marked [P] in same phase can run together
- **Checkpoints** = Stop and test complete story before continuing
- **Commits** = Commit after each task or logical group of related tasks
- **Errors** = Stop and fix TypeScript/ESLint errors immediately
- **Testing** = Manual verification per quickstart.md (automated tests optional)

---

**Tasks Status**: Ready for `/sp.implement`
**Total Tasks**: 103 tasks (T201-T303)
**Estimated Phases**: 9 phases (Setup, Foundational, 6 User Stories, Polish)
**MVP Scope**: Phases 1-6 (T201-T264) = 64 tasks
**Full Scope**: All 9 phases (T201-T303) = 103 tasks
