# Feature Specification: Phase III Local AI Todo Chatbot

**Feature Branch**: `001-phase3-chatbot`
**Created**: 2026-01-04
**Status**: Ready for Planning
**Input**: User description: "Create a complete specification for Phase III: Local AI Todo Chatbot as described in the latest user request. Ensure the spec captures all listed requirements, folder structure, tech stack, tool calling, LocalAI integration, and deliverables. Save to specs/features/phase3-separate-folder-chatbot.md and mark ready for sp.plan."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture todos by chatting (Priority: P1)

Authenticated users want to add or list todos using natural language inside the chat surface so they no longer need to visit the Phase II UI for routine input.

**Why this priority**: Enables the core value of Phase III—hands-free task capture via conversation—so the chatbot is useful immediately.

**Independent Test**: Sign in, open `/chat`, issue commands like “add buy milk tomorrow” or “what are my tasks?” and observe assistant executing add/list operations without touching legacy screens.

**Acceptance Scenarios**:

1. **Given** a signed-in user with LocalAI reachable, **When** they say "add a todo to schedule dentist appointment next Monday", **Then** a new todo appears in their list with the parsed title and metadata and the assistant confirms the action.
2. **Given** a signed-in user with existing todos, **When** they ask "show me my remaining todos", **Then** the chat returns a concise list matching the data store.

---

### User Story 2 - Modify todos conversationally (Priority: P2)

Users need to update descriptions, mark items complete, or delete todos using follow-up chat instructions without switching contexts.

**Why this priority**: Keeps the conversation productive beyond capture, ensuring the assistant can drive the entire lifecycle of a todo.

**Independent Test**: From `/chat`, issue commands like "mark grocery list done" or "change 'draft proposal' to 'draft proposal v2'" and verify updates propagate to the shared todo store.

**Acceptance Scenarios**:

1. **Given** a todo in "incomplete" status, **When** the user says "complete the grocery list task", **Then** the assistant toggles it to complete and returns confirmation along with the updated status.
2. **Given** an existing todo, **When** the user says "delete the dentist reminder", **Then** the record is removed and the chat explains the outcome.

---

### User Story 3 - Resume context with saved conversations (Priority: P3)

Users expect the chatbot to remember prior exchanges so they can resume work later without repeating instructions.

**Why this priority**: Conversation history is essential for referencing earlier tool invocations and reduces friction during longer planning sessions.

**Independent Test**: Conduct a chat session that includes commands and AI responses, refresh the browser, and confirm that past messages and todo state rehydrate from storage.

**Acceptance Scenarios**:

1. **Given** prior conversation records exist for a user, **When** they reopen `/chat`, **Then** the UI renders historical messages chronologically before allowing new input.
2. **Given** multiple concurrent sessions, **When** the user switches devices, **Then** the message log remains consistent because it is stored centrally in the Phase III database.

### Edge Cases

- LocalAI container is unreachable or the selected model is missing: assistant should surface a clear error and prompt the user to start the local model before retrying.
- Natural language requests are ambiguous (e.g., "update the task" when multiple tasks match): assistant must request clarification before executing a tool.
- Tool execution fails (SQLite locked, Prisma error, etc.): assistant should log failure, present the reason, and avoid partial data writes.
- Users attempt to run Phase III actions while still inside Phase II UI: Phase III must remain isolated and refuse cross-folder imports to avoid state leakage.
- Concurrent chat sessions issue conflicting commands on the same todo: last-write wins must still leave a consistent audit trail in the Message table.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Phase III solution MUST live entirely inside `evolution-of-todo/phase3-chatbot/` with the required subfolders (`app`, `components`, `prisma`, `lib`, `tools`) plus `package.json`, `tsconfig.json`, `next.config.js`, and `README-phase3.md` so earlier phases remain untouched.
- **FR-002**: The `/chat` route MUST render a shadcn/ui-based conversation surface optimized for desktop and mobile viewports, including message bubbles, timestamps, and streaming assistant replies.
- **FR-003**: User authentication MUST reuse the Credentials-based flow established in Phase II via NextAuth.js v4, ensuring only authenticated users can access chat or invoke todo tools.
- **FR-004**: A Server Action MUST orchestrate each user prompt by calling the LocalAI OpenAI-compatible endpoint, passing prior messages as context, and enforcing zero reliance on paid APIs.
- **FR-005**: The assistant MUST translate LocalAI tool calls into concrete todo operations: `addTodo`, `listTodos`, `toggleComplete`, `updateTodo`, and `deleteTodo`, each mapped to Prisma-backed handlers.
- **FR-006**: Todo data MUST be stored via Prisma with a SQLite database located at `phase3-chatbot/prisma/dev.db`, and schema changes cannot spill into Phase I or Phase II schemas.
- **FR-007**: A dedicated `Message` table MUST persist every user and AI utterance, the resolved tool calls, and execution metadata so chat history can be replayed deterministically.
- **FR-008**: The chat UI MUST refresh automatically whenever a tool call completes, showing both the assistant narrative and structured summaries of todo changes for transparency.
- **FR-009**: README-phase3 MUST describe exact setup steps (cloning, `npm install`, running LocalAI via Docker, pulling llama3/mistral weights, launching `npm run dev`) so another contributor can reproduce the environment offline.
- **FR-010**: The LocalAI integration MUST default to free, locally hosted models (llama3 or mistral) and expose configuration (URL, model name, temperature) via environment variables documented in `.env.example` under Phase III only.
- **FR-011**: Tool execution MUST enforce idempotency: repeated identical messages (e.g., "mark task A done" twice) should not create duplicate data or contradictory states.
- **FR-012**: System telemetry MUST log tool invocation outcomes (success/failure, latency) somewhere under `phase3-chatbot/lib/` to support debugging without referencing external monitoring vendors.

### Key Entities *(include if feature involves data)*

- **User Account**: Authenticated identity reused from prior phases; references Phase III sessions but never exposes credentials outside NextAuth boundaries.
- **Todo Item**: Shared task object already defined in prior phases; Phase III requires read/write access through Prisma while respecting ownership metadata.
- **Chat Message**: Represents each conversational turn with fields for role (user/assistant/tool), content, related todo IDs, and timestamps.
- **Tool Invocation**: Logical record of a requested add/list/update/delete action tying LocalAI tool calls to actual database mutations and their outcomes.
- **LocalAI Configuration**: Settings for host, port, model name, and auth (if any) kept within Phase III `.env` to drive deterministic LLM responses.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of natural language add/list/update/delete requests succeed on the first attempt without needing to open the Phase II UI.
- **SC-002**: Chat responses, including tool execution summaries, render within 3 seconds for single-step operations when LocalAI is running locally.
- **SC-003**: After signing out and back in, users see 100% of their prior chat history and todo changes without manual data exports.
- **SC-004**: A clean workstation following README-phase3 instructions can run the chatbot, LocalAI container, and SQLite database entirely offline with zero paid services.

## Assumptions & Constraints

- Phase III MUST NOT modify `phase1-console/` or `phase2-web/`; all new assets live under `phase3-chatbot/` and communicate only through shared data models.
- Tech stack constraints are fixed: Next.js 14+ App Router with strict TypeScript, Prisma + SQLite, Tailwind + shadcn/ui, NextAuth Credentials, and LocalAI-compatible tool calling.
- Tool set is limited to todo CRUD operations; any future tool (e.g., reminders) requires a new specification.
- LocalAI will run via Docker using llama3 or mistral weights obtained from public sources; bandwidth or storage for these models is available to developers.
