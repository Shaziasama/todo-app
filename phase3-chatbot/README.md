# Phase 3: AI-Powered Todo Chatbot

## Overview
This phase extends the full-stack Todo app from Phase 2 by adding a **natural language AI chatbot interface** using **LocalAI** (fully local LLM – zero paid API).

Users can manage their todos through casual conversation:
- Add new tasks
- List pending/completed tasks
- Mark tasks as complete
- Edit or delete tasks

All operations are performed via **tool/function calling** with a local Llama model.

## Features (Hackathon Requirements Met)

- **Natural Language Chat Interface** (/chat page)
  - Message history with user and AI bubbles
  - Premium luxury UI (navy blue + neon sky blue + golden accents + glassmorphism)

- **Tool/Function Calling Integration**
  - Functions: `addTodo`, `listTodos`, `toggleComplete`, `updateTodo`, `deleteTodo`
  - AI intelligently calls tools based on user intent
  - Friendly natural language responses (no raw JSON)

- **Full CRUD via Chat**
  - "Add buy milk tomorrow" → creates todo
  - "Show my pending tasks" → lists todos beautifully
  - "Complete the milk task" → marks complete
  - "Delete the old meeting" → removes todo

- **Authentication Protected**
  - Only logged-in users can access chat
  - Todos are user-specific

- **LocalAI Integration** (Bonus: Zero cost, fully local)
  - Uses LocalAI Docker container (Llama-3 model)
  - OpenAI-compatible endpoint (`http://localhost:8080/v1`)

- **Data Persistence**
  - Todos and chat history saved in SQLite (Prisma)
  - Data persists across restarts

- **No Breaking Changes**
  - Phase 2 dashboard functionality remains intact
  - Clear evolution from previous phases

## Tech Stack
- Next.js 14+ (App Router)
- Prisma + SQLite
- NextAuth.js (Credentials)
- Tailwind CSS + shadcn/ui
- LocalAI (Docker + Llama-3-Instruct)

## Local Setup & Run

1. Start LocalAI server (separate terminal):
   ```bash
   docker run -p 8080:8080 --name localai -ti localai/localai:latest-aio-cpu
