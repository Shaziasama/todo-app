# Tasks: Phase III Local AI Todo Chatbot

**Input**: Design documents from `/specs/001-phase3-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly mandated; functional verification described per user story.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- `[P]`: Parallelizable (different files, no dependencies)
- `[Story]`: User story label (`US1`, `US2`, `US3`)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and required scaffolding

- [x] T001 Create `phase3-chatbot/` folder and initialize Next.js App Router (TypeScript) project via `npx create-next-app --ts` inside repository root
- [x] T002 Add base files (`next.config.js`, `tsconfig.json`, `.gitignore`, `package.json`) under `phase3-chatbot/` matching plan structure

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure required before user stories

- [ ] T003 Install and configure Tailwind CSS + PostCSS pipeline in `phase3-chatbot/tailwind.config.ts` and `phase3-chatbot/styles/globals.css`
- [ ] T004 Run `npx shadcn@latest init` and add required components into `phase3-chatbot/components/ui/`
- [ ] T005 Install Prisma + NextAuth deps, create `phase3-chatbot/prisma/schema.prisma`, and run `npx prisma init --datasource-provider sqlite`
- [ ] T006 Create `.env.example` in `phase3-chatbot/` with `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `PHASE3_DATABASE_URL`, `LOCALAI_*` variables per spec
- [ ] T007 Add utility helpers (`lib/utils.ts`, `lib/cn.ts`) and Tailwind plugin wiring referenced by shadcn components

**Checkpoint**: Foundational environment ready → proceed to user stories

---

## Phase 3: User Story 1 – Capture todos by chatting (Priority: P1) 🎯 MVP
**Goal**: Allow authenticated users to add/list todos via LocalAI-powered chat
**Independent Test**: Sign in, open `/chat`, ask “add buy milk tomorrow” and “show me my remaining todos”; both succeed without Phase II UI

### Implementation
- [x] T008 Create Prisma models for `Todo`, `Message`, `ToolInvocation`, `TelemetryEvent` in `phase3-chatbot/prisma/schema.prisma`; run `npx prisma migrate dev --name init_phase3`
- [x] T009 Create Prisma client helper in `phase3-chatbot/lib/prisma.ts` with singleton pattern targeting SQLite DB
- [x] T010 Implement NextAuth Credentials config in `phase3-chatbot/lib/auth.ts` (reuse Phase II hashing + callbacks)
- [x] T011 Add NextAuth route handler at `phase3-chatbot/app/api/auth/[...nextauth]/route.ts`
- [ ] T012 [P] [US1] Build base `/chat` route layout in `phase3-chatbot/app/chat/page.tsx` with shadcn shell + streaming placeholders
- [ ] T013 [P] [US1] Implement chat UI components (`components/chat/ChatShell.tsx`, `MessageBubble.tsx`, `Composer.tsx`) with Tailwind styles
- [ ] T014 [US1] Implement server action `runChatTurn` in `phase3-chatbot/app/actions/chat.ts` to call LocalAI (OpenAI SDK) with function/tool definitions
- [ ] T015 [US1] Create todo CRUD tool handlers (`addTodo`, `listTodos`) in `phase3-chatbot/app/actions/tools.ts` using Prisma + idempotency hash
- [ ] T016 [US1] Wire LocalAI tool function definitions (JSON) under `phase3-chatbot/tools/*.json` and export schema references
- [ ] T017 [US1] Persist Messages and ToolInvocations inside server action; ensure history reload on `/chat` via `getMessages()` helper in `phase3-chatbot/lib/messages.ts`
- [ ] T018 [US1] Display tool results + telemetry in UI, refreshing chat view after tool completion

**Checkpoint**: US1 functional – capture/list flows validated manually per spec

---

## Phase 4: User Story 2 – Modify todos conversationally (Priority: P2)
**Goal**: Support update, toggle complete, and delete commands via chat
**Independent Test**: From `/chat`, issue “mark grocery list done” and “delete dentist reminder”; database updates reflect immediately

### Implementation
- [ ] T019 [P] [US2] Extend tool handlers in `phase3-chatbot/app/actions/tools.ts` with `updateTodo`, `toggleComplete`, `deleteTodo`, enforcing ownership + validation
- [ ] T020 [US2] Add supporting Zod schemas + JSON definitions under `phase3-chatbot/tools/` for new tool payloads
- [ ] T021 [US2] Update server action logic to route LocalAI tool calls to new handlers and surface confirmations in chat UI
- [ ] T022 [US2] Enhance UI to show todo status changes (e.g., strikethrough for completed, removal confirmation) within `components/chat/MessageBubble.tsx`

**Checkpoint**: US1 + US2 independently testable; todo lifecycle manageable via chat

---

## Phase 5: User Story 3 – Resume context with saved conversations (Priority: P3)
**Goal**: Persist chat history and reload it seamlessly across sessions/devices
**Independent Test**: Conduct chat, refresh page, confirm prior messages + assistant outputs render chronologically; repeat on another device

### Implementation
- [ ] T023 [US3] Implement history fetcher in `phase3-chatbot/lib/history.ts` to load last N messages + tool invocations sorted by `createdAt`
- [ ] T024 [US3] Add server components/hooks in `/chat` page to load persisted history on mount and hydrate UI state
- [ ] T025 [US3] Ensure message pagination or truncation strategy (default 100) documented and implemented to avoid unbounded loads

**Checkpoint**: Users can resume conversations with full context across sessions

---

## Phase 6: Protected Routes & Error Handling
**Purpose**: Cross-cutting auth + resilience requirements

- [ ] T026 Add auth middleware/guard (e.g., `phase3-chatbot/middleware.ts` or layout guard) to restrict `/chat` and server actions to authenticated sessions
- [ ] T027 Implement LocalAI health check + retry logic in `phase3-chatbot/lib/localai.ts`, surfacing friendly errors when container unavailable
- [ ] T028 Add telemetry logger in `phase3-chatbot/lib/telemetry.ts` capturing tool outcomes + latency, invoked from server action + tool handlers

---

## Phase 7: Documentation & Polish
**Purpose**: Final deliverables + quality pass

- [ ] T029 Update `phase3-chatbot/README-phase3.md` with exact setup commands (docker run, model pull, npm install, prisma migrate, npm run dev)
- [ ] T030 Document `.env.example` usage and LocalAI model options in README + `.env.example`
- [ ] T031 Validate quickstart by following README end-to-end; record issues + fixes if discrepancies arise
- [ ] T032 Run lint, typecheck, and sample manual scenario (US1–US3) documenting outcomes in README or issue tracker

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** → 2. **Foundational (Phase 2)** → 3. **US1 (Phase 3)** → 4. **US2 (Phase 4)** → 5. **US3 (Phase 5)** → 6. **Protection/Error Handling (Phase 6)** → 7. **Polish (Phase 7)**

### User Story Dependencies
- US1 (P1) depends on Foundational completion
- US2 (P2) builds on US1 tool scaffolding
- US3 (P3) depends on persisted Message/ToolInvocation models from US1

### Parallel Opportunities
- Tasks marked **[P]** (e.g., T012, T013, T019) can run concurrently after dependencies satisfied
- Different user stories can proceed in parallel once prior phases complete, though sequential delivery ensures MVP stability

---

## Implementation Strategy

### MVP First (US1 only)
1. Complete Setup + Foundational phases
2. Deliver User Story 1 (chat add/list) and validate manually – **MVP**
3. Optionally pause to demo before additional stories

### Incremental Delivery
- After MVP, implement US2 (modify todos) then US3 (history resume), validating each independently

### Parallel Team Strategy
- Once foundational work done: assign separate owners to US1, US2, US3 tasks with clear boundaries and shared schema awareness
