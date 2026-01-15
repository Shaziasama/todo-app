# Phase 3: AI-Powered Todo Chatbot

**Project:** Evolution of Todo  
**Phase:** III – Natural Language Todo Management  
**Folder:** `phase3-chatbot`  
**Status:** Complete & Fully Working Locally  
**Author:** SHAZIA  
**Date:** January 15, 2026  

## Overview

This phase adds a fully functional AI chatbot to the existing Todo web app. Users can manage their todos using natural language in a beautiful chat interface.

The chatbot understands commands like:
- "Add buy milk tomorrow"
- "Mark the meeting task as complete"
- "Show me my pending tasks"
- "Delete the groceries task"
- "Update task 1 to 'Call mom tonight'"

All operations are performed securely on the user's private todos.

## Key Features

- **Natural Language Todo Management** – Add, list, complete, update, delete todos via chat
- **Responsive Chat Interface** – Clean, modern design with message history
- **Persistent Chat History** – All conversations saved in database
- **Full Authentication** – Protected routes using NextAuth (email + password)
- **Todo Dashboard** – View and manage todos traditionally alongside chat
- **Zero Cost Local AI** – Runs with LocalAI (Docker) + free open-source model (llama3/mistral)

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Prisma ORM + SQLite (local `prisma/dev.db`)
- Tailwind CSS + shadcn/ui components
- NextAuth.js v4 (Credentials provider)
- LocalAI (Docker) with llama3 or mistral model
- Lucide React icons

## Local Setup Instructions

### 1. Start LocalAI (AI Engine)
```bash
# Run LocalAI container
docker run -p 8080:8080 --name localai -ti localai/localai:latest-aio-cpu

# Download llama3 model (run once)
curl http://localhost:8080/models/apply -H "Content-Type: application/json" -d '{
  "id": "llama3"
}'                                                                                                                                                              
### 2. Run the App
Bashcd phase3-chatbot

npm install

npx prisma generate

npx prisma migrate dev --name init

npm run dev
