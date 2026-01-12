---
id: 001
title: Phase3 Chatbot Specification
stage: spec
date: 2026-01-04
surface: agent
model: claude-sonnet-4-5
feature: 001-phase3-chatbot
branch: 001-phase3-chatbot
user: Zohaib
command: /sp.specify
labels: ["specification","phase3","chatbot"]
links:
  spec: specs/features/phase3-separate-folder-chatbot.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-phase3-chatbot/spec.md
  - specs/001-phase3-chatbot/checklists/requirements.md
  - specs/features/phase3-separate-folder-chatbot.md
tests:
  - Not applicable (spec authoring)
---

## Prompt

Create a complete specification for Phase III: Local AI Todo Chatbot in a completely separate folder.

Goal: Build a fully working natural language chatbot that extends the Phase II web app, but all code must be in a new independent folder so that Phase 1, Phase 2, and Phase 3 remain completely separate and do not interfere with each other.

Project Structure Must Be:
evolution-of-todo/
├── phase1-console/          # Already exists (Phase 1 CLI)
├── phase2-web/              # Already exists (Phase 2 Next.js web app)
├── phase3-chatbot/          # NEW FOLDER – Claude must create everything here
│   ├── app/
│   ├── components/
│   ├── prisma/
│   ├── lib/
│   ├── tools/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── README-phase3.md
├── constitution.md
└── AGENTS.md

Strict Requirements:
- Claude must automatically create the entire "phase3-chatbot" folder from scratch
- Use Next.js 14+ App Router + TypeScript (strict)
- Prisma + SQLite (local prisma/dev.db inside phase3-chatbot folder)
- Tailwind + shadcn/ui fully initialized
- NextAuth.js v4 Credentials only (same as Phase 2)
- Custom chat UI (/chat page) with shadcn/ui components
- FREE local LLM: LocalAI (Docker) with llama3 or mistral model (OpenAI-compatible API)
- Tool calling: addTodo, listTodos, toggleComplete, updateTodo, deleteTodo
- Server Action handles chat → LocalAI call → tool execution → response
- New Message table for chat history persistence
- All features work: natural language add/list/update/delete/complete
- Zero paid services, fully local

Claude Responsibilities:
- Automatically run all setup commands (npx create-next-app in phase3-chatbot folder, prisma init, shadcn init, etc.)
- Generate all files in phase3-chatbot folder only
- Include exact README with setup steps (docker run localai, pull model, npm install, npm run dev)
- Ensure the app runs independently without touching phase1 or phase2

Save spec as /specs/features/phase3-separate-folder-chatbot.md and mark ready for sp.plan.

## Response snapshot

- Created feature branch `001-phase3-chatbot` (spec work only) and drafted full specification covering user stories, edge cases, 12 functional requirements, entities, success criteria, and constraints ensuring the entire Phase III stack lives in `phase3-chatbot/`.
- Authored Specification Quality Checklist at `specs/001-phase3-chatbot/checklists/requirements.md`, validated all criteria, and copied the finalized spec to `specs/features/phase3-separate-folder-chatbot.md` for downstream `/sp.plan`.

## Outcome

- ✅ Impact: Specification + checklist ready for planning, with clear functional scope and acceptance criteria for Phase III chatbot.
- 🧪 Tests: Not applicable (documentation work only).
- 📁 Files: spec.md, checklist, and feature-level spec copy created under Phase III directories.
- 🔁 Next prompts: Proceed with `/sp.plan` for implementation architecture.
- 🧠 Reflection: Ensured strict separation between phases and codified all LocalAI/tooling constraints before planning.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell dependency initially missing; resolved via user-provided path but script still emitted benign warning before spec creation.
- Graders run and results (PASS/FAIL): Not applicable.
- Prompt variant (if applicable): N/A.
- Next experiment (smallest change to try): Automate non-PowerShell fallback for create-new-feature when pwsh unavailable.
