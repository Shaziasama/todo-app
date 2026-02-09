# Phase 0 Research: Phase III Local AI Todo Chatbot

**Feature**: 001-phase3-chatbot
**Date**: 2026-01-04
**Status**: Complete
**Inputs**: `/specs/001-phase3-chatbot/spec.md`, prior Phase II artifacts (`specs/phase2-fullstack-web/*`), LocalAI documentation, NextAuth credentials flow, Prisma multi-database guidance, shadcn/ui setup references.

---

## 1. Clarifications (All Resolved)

| Topic | Question | Resolution |
|-------|----------|------------|
| Feature isolation | Does Phase III reuse Phase II directories? | No. All runtime/server/UI assets must live under `/phase3-chatbot/` with its own `package.json`, `prisma`, `app`, `components`, `lib`, and `tools` folders. Phase II remains untouched; sharing happens only at the conceptual model level. |
| Authentication | How do we reuse Phase II credentials without duplicating logic? | Phase III imports the existing NextAuth Credentials configuration from Phase II (`lib/auth.ts`) via a shared package boundary (`/phase3-chatbot/lib/auth-options.ts`), pointing to the same user table while keeping independent environment files. |
| LocalAI availability | What happens if LocalAI is offline? | The orchestrating Server Action detects unreachable host (timeout > 5s) and returns a structured `LLMUnavailableError` message rendered inline in chat, instructing the user to (re)start Docker. |
| Tool surface | Which tool calls are in scope? | Only `addTodo`, `listTodos`, `updateTodo`, `toggleComplete`, and `deleteTodo`. Any new tool requires a new spec + plan iteration. |
| Persistence | Is Phase III allowed to modify Phase II's SQLite file? | No. A dedicated Prisma schema (`/phase3-chatbot/prisma/schema.prisma`) targets `prisma/dev.db`. For user auth, Prisma uses a datasource connected to the shared `User` table via a separate `.env` entry, preserving isolation. |
| Testing | What level of automated testing is expected? | Minimum: unit tests for tool payload validators, contract tests for OpenAPI fallback route, and integration tests covering LocalAI tool translation via mocked HTTP. End-to-end UI tests may be added later but are not blocking for planning. |

---

## 2. Dependencies & Integration Patterns

- **LocalAI (Dockerized OpenAI-compatible server)**
  - Run via `docker run -d --name localai -p 8080:8080 -e MODELS_PATH=/models -v $(pwd)/models:/models localai/localai:latest`. Models pulled using `docker exec localai ./download-model.sh --model ggml-gpt4all-j`. For llama3/mistral, mount downloaded GGUF files and reference via `MODEL=meta-llama/Meta-Llama-3-8B-Instruct-Q4` (or equivalent) in `.env.local`.
  - Configure server action to call `http://localhost:8080/v1/chat/completions` with streaming disabled initially (tool-first). Use `max_tokens=1024`, `temperature=0.3`, `top_p=0.9`. Timeout at 12s, retry once with exponential backoff, then surface error.
  - Log request/response metadata (excluding content) for telemetry under `lib/telemetry/localai.ts`.

- **NextAuth Credentials Reuse**
  - Re-export Phase II `authOptions` via package boundary or duplication that references the same hashing strategy (bcrypt 10 rounds). Session strategy remains JWT.
  - `/chat` route uses `getServerSession(authOptions)` to gate access. Middleware ensures `/chat` and LocalAI server actions are protected.

- **Prisma Multi-Database Isolation**
  - Maintain two datasources in `schema.prisma`: `db` (Phase III-specific tables) and `phase2` (shadow read-only preview of existing `User` + `Todo`). Use Prisma `@@map` to avoid naming collisions.
  - For writes, Phase III uses its own `Todo` table but synchronizes with shared semantics by reusing the same schema definition. Use separate Prisma client instances when necessary.

- **shadcn/ui Integration**
  - Initialize via `npx shadcn@latest init` inside `/phase3-chatbot`. Use "Default" style and CSS variables for easier theming.
  - Required components: `button`, `input`, `textarea`, `card`, `scroll-area`, `avatar`, `badge`, `separator`, `sonner` for toasts, `skeleton` for loading states.
  - Compose chat bubbles with `card` + Tailwind `flex` utilities; streaming indicator uses `skeleton` animations.

- **Testing Expectations**
  - **Unit**: Zod schemas for tool payloads, telemetry helpers, LocalAI response transformers (Vitest).
  - **Integration**: Mock LocalAI HTTP endpoint using MSW or custom fetch mock to validate server action flows.
  - **Contract**: OpenAPI spec-driven tests verifying fallback REST endpoint matches schema (Prism or Schemathesis optional but recommended).
  - **Manual**: Quickstart instructs verifying LocalAI container, migrating Prisma schema, seeding user, running `npm run dev`, then performing sample chat interactions.

---

## 3. LocalAI Best Practices

1. **Model Management**: Store GGUF weights under `/phase3-chatbot/models`. Provide script `npm run localai:pull` to download recommended open models (Llama 3 8B Instruct Q4, Mistral 7B Instruct). Always document checksums.
2. **Tooling Format**: Use OpenAI function-calling schema with deterministic JSON payloads. Validate LocalAI outputs using Zod before executing.
3. **Resource Constraints**: Configure `n_ctx=4096`, `threads` derived from host CPU, disable GPU-specific flags to keep cross-platform compatibility.
4. **Security**: Bind LocalAI to `127.0.0.1` to prevent remote access. No API keys transmitted; rely on HTTP Basic disabled.
5. **Observability**: Wrap fetch calls with `withTelemetry` helper capturing latency, tool invoked, success/failure. Persist summary records in `TelemetryEvent` table (optional) or structured logs.

---

## 4. NextAuth Reuse Strategy

- Reuse hashing + credential validation logic by importing `authOptions` from Phase II (or replicating file inside `/phase3-chatbot/lib/auth.ts` referencing common environment). Ensure `.env.local` in Phase III defines `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `PHASE3_DATABASE_URL`.
- Middleware ensures `/chat`, `/api/localai/proxy`, and server actions require authentication while keeping `/login` (if re-exposed) available.
- Session metadata adds `phase` claim to differentiate clients for telemetry.

---

## 5. Prisma Multi-Database Isolation

- **Datasources**:
  ```prisma
  datasource phase3 {
    provider = "sqlite"
    url      = env("PHASE3_DATABASE_URL")
  }

  datasource legacy {
    provider = "sqlite"
    url      = env("PHASE2_DATABASE_URL")
  }
  ```
- **Generators**: Create two Prisma clients (`@/lib/prisma-phase3`, `@/lib/prisma-legacy`). Use `NodeNext` module resolution to avoid duplication.
- **Migration Policy**: Only run `prisma migrate dev` inside `/phase3-chatbot`. Phase II migrations remain untouched. Document rollback by restoring `prisma/dev.db` from timestamped backup.

---

## 6. shadcn/ui Integration Plan

- Initialize theme identical to Phase II for visual continuity but host inside `/phase3-chatbot/components/ui`.
- Chat layout: `ScrollArea` for history, `Textarea` + `Button` for composer, `Skeleton` for streaming, `Avatar` for roles, `Badge` for tool call summary.
- Use `cn` utility for conditional classes (copy from Phase II or regenerate via shadcn init).
- Compose message timeline component to accept `MessageWithTool[]` typed interface.

---

## 7. Testing Expectations

| Layer | Tooling | Scope |
|-------|---------|-------|
| Unit | Vitest + @testing-library/react | Message formatter, telemetry helpers, Prisma data transformers |
| Integration | Vitest/MSW | Server Action calling LocalAI mock, ensuring tool JSON parsed & executed |
| Contract | `prism mock` or `schemathesis` | `/api/chat/fallback` OpenAPI spec compliance |
| Manual smoke | Quickstart steps | Run LocalAI container, login, send sample prompts, verify persistence |

---

## 8. Dependencies Checklist

- [x] LocalAI Docker image + llama3/mistral weights
- [x] Next.js 15 App Router (per Phase III spec requirement; upgrade from Phase II if needed)
- [x] Prisma dual datasource config
- [x] NextAuth Credentials (shared secret) + session middleware
- [x] shadcn/ui components for chat experience
- [x] Vitest + Testing Library for coverage

---

## 9. Integration Risks & Mitigations

1. **LocalAI Latency**: Mitigated by caching conversation context server-side, limiting max tokens, and streaming partial responses.
2. **Data Drift Between Phases**: Mitigate via single source of truth for Todo schema and automated migration gating before running Phase III server.
3. **Tool Misclassification**: Use guard rails in system prompt and fallback clarifying questions; reject ambiguous commands with `ClarificationNeededError`.

---

## 10. Ready-for-Plan Statement

All Phase 0 questions are resolved, dependencies are identified, and integration patterns are documented. No `NEEDS CLARIFICATION` strings remain. Proceeding to Phase 1 design artifacts and plan drafting.
