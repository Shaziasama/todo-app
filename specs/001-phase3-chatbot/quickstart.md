# Quickstart Guide: Phase III Local AI Todo Chatbot

**Feature**: 001-phase3-chatbot
**Date**: 2026-01-04
**Audience**: Contributors setting up the standalone Phase III workspace (`phase3-chatbot/`) with LocalAI-powered chat interface.

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20.x LTS (>=20.10) | Required by Next.js 15 / Server Actions |
| npm | 10.x | Bundled with Node 20 |
| Docker Desktop | 4.26+ | Needed for LocalAI container |
| Git | Latest | For cloning repo |
| Disk Space | 15 GB+ | Llama 3 / Mistral weights + LocalAI layers |

Ensure virtualization is enabled (BIOS) so Docker can start LocalAI.

---

## 2. Clone and Navigate

```bash
cd C:/Users/Zohaib/Desktop
git clone <repo-url> todo-app
cd todo-app/phase3-chatbot
```

> **Note**: Phase III lives entirely in `phase3-chatbot/`. Do not run commands from Phase II root.

---

## 3. Install Dependencies

```bash
npm install
```

Expected output (truncated):
```
added 412 packages, and audited 413 packages in 32s
```

Key dependencies installed: Next.js 15, React 19 RC, Prisma 5, shadcn/ui components, NextAuth, LocalAI client helpers, Vitest.

---

## 4. Environment Configuration

1. Copy template:
   ```bash
   cp .env.example .env.local
   ```
2. Fill the following variables:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<generate-random>
   PHASE3_DATABASE_URL="file:./prisma/dev.db"
   PHASE2_DATABASE_URL="file:../phase2-fullstack-web/prisma/dev.db" # read-only reference
   LOCALAI_BASE_URL="http://127.0.0.1:8080/v1"
   LOCALAI_MODEL="meta-llama/Meta-Llama-3-8B-Instruct-Q4"
   LOCALAI_TEMPERATURE="0.3"
   LOCALAI_MAX_TOKENS="1024"
   ```
3. Generate secret (PowerShell):
   ```powershell
   [Convert]::ToBase64String((1..32 | % { Get-Random -Min 0 -Max 256 }))
   ```

---

## 5. Set Up Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init_phase3
```

Outputs:
```
✔ Generated Prisma Client (5.x.x)
Applying migration `20260104_init_phase3`
```

SQLite file created at `prisma/dev.db`.

---

## 6. Start LocalAI (Docker)

1. Create models directory:
   ```bash
   mkdir -p models
   ```
2. Pull LocalAI image:
   ```bash
   docker pull localai/localai:latest
   ```
3. Run container:
   ```bash
   docker run -d --name localai \
     -p 8080:8080 \
     -e MODELS_PATH=/models \
     -v ${PWD}/models:/models \
     localai/localai:latest
   ```
4. Download model (example Llama 3 8B Q4):
   ```bash
   docker exec localai ./download-model.sh \
     --model meta-llama/Meta-Llama-3-8B-Instruct-Q4_GGUF \
     --alias meta-llama/Meta-Llama-3-8B-Instruct-Q4
   ```
5. Verify:
   ```bash
   curl http://127.0.0.1:8080/readyz
   # Expected: {"ready":true}
   ```

> Optionally pull Mistral 7B Instruct Q4 and update `LOCALAI_MODEL` accordingly.

---

## 7. Initialize shadcn/ui Components

```bash
npx shadcn@latest init
npx shadcn@latest add button input textarea card avatar badge scroll-area separator skeleton sonner
```

This populates `components/ui/` and configures Tailwind tokens.

---

## 8. Development Workflow

### 8.1 Run Dev Server
```bash
npm run dev
```
Expected log:
```
  ▲ Next.js 15.x.x
  - Local:   http://localhost:3000
```

### 8.2 Access Application
- Visit `http://localhost:3000/chat`
- Login via existing credentials (from Phase II database). If no account exists, run Phase II quickstart to create one.

### 8.3 Sample Scenario
1. Login → redirected to `/chat` UI.
2. Start LocalAI container (if not already).
3. Send prompt: "Add a todo to prepare tax documents by Friday."
   - Assistant confirms tool call.
   - Chat history shows structured todo summary.
4. Prompt: "List my todos." → Chat lists tasks.
5. Prompt: "Mark prepare tax documents as done." → Todo toggles complete.

---

## 9. Testing Commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint (Next.js defaults + custom rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest suites (tool validators, telemetry) |
| `npm run test:integration` | Runs LocalAI mock integration tests |

---

## 10. Troubleshooting

| Issue | Fix |
|-------|-----|
| LocalAI 503 errors | Ensure container running, `curl /readyz`, check model alias matches `LOCALAI_MODEL`. |
| Server Action errors about auth | Verify `.env.local` secrets, sign out/in, ensure Phase II DB path correct. |
| Prisma migration conflicts | Delete `prisma/dev.db`, rerun `npx prisma migrate dev`. |
| Shadcn styles missing | Re-run `npx shadcn@latest init` and `npm run dev` (tailwind rebuild). |

---

## 11. Shutdown & Cleanup

```bash
docker stop localai && docker rm localai
```

SQLite DB and models remain locally until deleted. To reset, remove `prisma/dev.db` and rerun migrations.

This quickstart, combined with the Phase 0 research and data model, prepares the project for task creation and implementation.
