# Data Model: Phase III Local AI Todo Chatbot

**Feature**: 001-phase3-chatbot
**Date**: 2026-01-04
**Status**: Phase 1 Complete
**Inputs**: `/specs/001-phase3-chatbot/spec.md`, `/specs/phase2-fullstack-web/data-model.md`

---

## Purpose
Phase III introduces conversational automation on top of the Evolution of Todo stack. This document defines the entities, relationships, validation rules, and state transitions required to operate todo CRUD, chat histories, tool invocations, and telemetry inside the standalone `phase3-chatbot/` workspace while remaining interoperable with earlier phases.

---

## Entity Overview

| Entity | Description |
|--------|-------------|
| `User` | Authenticated identity reused from Phase II (read-only reference in Phase III schema). |
| `Todo` | Task records owned by users; schema mirrors Phase II but lives in Phase III database to maintain isolation. |
| `Message` | Persistent record of each conversational turn (user, assistant, or tool). |
| `ToolInvocation` | Execution log for LLM-issued tool calls including payload, result, and telemetry. |
| `TelemetryEvent` (optional) | Structured log of LocalAI and tool performance metrics. |

---

## Shared Entities (Imported from Phase II)

### 1. User
Phase III does not redefine `User`. Instead, Prisma references Phase II's `User` table through a secondary datasource or via sync jobs. For validation and state rules, reuse `/specs/phase2-fullstack-web/data-model.md`.

Key constraints for interaction:
- `User.id` (UUID) is the foreign key for `Todo`, `Message`, and `ToolInvocation`.
- Authentication is enforced via NextAuth Credentials, guaranteeing `session.user.id` presence before any mutations.

### 2. Todo
Phase III uses the same shape as Phase II but stores data in its own SQLite file. Keeping a parallel schema avoids cross-phase coupling while enabling migration to PostgreSQL later.

```prisma
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

**Validation** (Zod):
```ts
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
```

**State Transitions**: Identical to Phase II (Created → Incomplete → Completed; Delete removes record). Additional Phase III rule: tool invocations must record the previous/next state in `ToolInvocation.delta`.

---

## Phase III Entities

### 3. Message
Represents every utterance in the chat session. Supports user text, assistant replies, and structured tool outputs.

```prisma
model Message {
  id             String         @id @default(uuid())
  userId         String
  role           MessageRole
  content        String         // Markdown or plain text for user/assistant
  toolInvocation ToolInvocation?
  metadata       Json?
  createdAt      DateTime       @default(now())

  user           User           @relation(fields: [userId], references: [id])
}

enum MessageRole {
  user
  assistant
  tool
  system
}
```

**Field Rules**:
- `role` determines rendering style (user bubble, assistant bubble, tool summary, system notification).
- `content` stores sanitized Markdown; streaming segments append to same record.
- `metadata` stores tokens: `{ "model": "meta-llama-3", "latencyMs": 1820 }`.
- `toolInvocationId` (nullable) links assistant/tool messages to the execution log.

**Validation**:
```ts
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'tool', 'system']),
  content: z.string().min(1).max(8000),
  metadata: z.record(z.any()).optional(),
});
```

**State Flow**:
1. User submits prompt → new `Message` with `role=user`.
2. Server Action streams assistant reasoning (optional) and final response `role=assistant`.
3. If assistant decides to call a tool, append `role=assistant` message summarizing the intent and create a linked `ToolInvocation`.
4. Once tool completes, create `role=tool` message summarizing results.

### 4. ToolInvocation
Audit record for each tool execution triggered by LocalAI.

```prisma
model ToolInvocation {
  id            String   @id @default(uuid())
  userId        String
  toolName      ToolName
  requestId     String   // UUID from LocalAI call
  inputPayload  Json
  resultPayload Json?
  status        InvocationStatus @default(PENDING)
  errorCode     String?
  errorMessage  String?
  durationMs    Int?
  message       Message? @relation(fields: [messageId], references: [id])
  messageId     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum ToolName {
  addTodo
  listTodos
  updateTodo
  toggleComplete
  deleteTodo
}

enum InvocationStatus {
  PENDING
  SUCCESS
  FAILED
}
```

**Field Rules**:
- `inputPayload` stores the parsed JSON from LocalAI tool call.
- `resultPayload` contains sanitized todo data (never raw Prisma models) for UI summaries.
- `durationMs` measured via telemetry helper.
- `messageId` references the assistant response that initiated the tool.

**Validation**:
Each tool has its own Zod schema (see Contracts section). `ToolInvocation` enforces `inputPayload` adherence before hitting database.

**State Machine**:
```
PENDING → SUCCESS (result stored, summary message created)
        ↘ FAILED (errorCode + errorMessage required)
```

### 5. TelemetryEvent (Optional but recommended)
Captures health metrics for LocalAI and tool handlers.

```prisma
model TelemetryEvent {
  id         String   @id @default(uuid())
  userId     String?
  category   TelemetryCategory
  name       String
  metadata   Json?
  durationMs Int?
  createdAt  DateTime  @default(now())
}

enum TelemetryCategory {
  localai
  tool
  ui
}
```

Use this model to store aggregated metrics (e.g., LocalAI latency, tool error counts). Optional for implementation but included for traceability.

---

## Relationships

- `User 1 - n Message`: Each message belongs to a user for authorization.
- `User 1 - n ToolInvocation`: Each tool execution scoped to user session.
- `Message 1 - 0..1 ToolInvocation`: Assistant messages that trigger tools link directly to the invocation for deterministic replay.
- `ToolInvocation n - m Todo` (implicit): Tool results refer to todo IDs but do not maintain join tables; `resultPayload` contains todo snapshots.

---

## Derived Types

```ts
export type MessageWithTool = Message & {
  toolInvocation?: ToolInvocation;
};

export interface ChatSessionState {
  userId: string;
  messages: MessageWithTool[];
  pendingTool?: ToolInvocation;
}
```

---

## Validation Summary

| Entity | Key Validation |
|--------|----------------|
| `Message` | Role enumeration, content length (≤ 8k chars), metadata size < 10KB |
| `ToolInvocation` | `inputPayload` conforms to per-tool schema, `durationMs >= 0`, `errorMessage` required when `status=FAILED` |
| `Todo` | Title 1-200 chars, description ≤1000, idempotent operations enforced by tool handlers |
| `TelemetryEvent` | `name` ≤ 64 chars, metadata serialized JSON < 16KB |

---

## State Considerations

- **Conversation Resume**: Fetch last N (`default 100`) messages sorted by `createdAt`. Provide pagination token for older history.
- **Idempotency**: Combine `userId + toolName + hash(inputPayload)` to detect repeated commands within 60 seconds. Store hash in `ToolInvocation` to prevent duplicates.
- **Deletion**: When a todo is deleted, associated `ToolInvocation.resultPayload` remains as audit trail.

---

## Data Privacy & Security

- Messages and tool payloads may contain sensitive text; ensure `.env.local` enforces encryption at rest only when migrating to PostgreSQL (future phase). For SQLite, rely on OS-level protections and gitignore `dev.db`.
- No PII beyond email addresses flows through LocalAI; redact email addresses before sending prompts by referencing `session.user.displayName`.
- Telemetry logs omit raw message content; only categories and durations.

---

## Migration Strategy

1. Create new Prisma schema inside `/phase3-chatbot/prisma/schema.prisma` with entities defined above.
2. Run `npx prisma migrate dev --name init_phase3` to produce Phase III migrations.
3. Provide backfill script to import existing todos from Phase II if shared state is required (optional, out of Phase III scope).
4. Document rollback by restoring `prisma/dev.db` backup created before migrations.

---

## References
- `/specs/001-phase3-chatbot/spec.md`
- `/specs/phase2-fullstack-web/data-model.md`
- LocalAI OpenAI-compatible tool schema

This data model is now ready for task decomposition and implementation planning.
