# Phase 3 Chatbot - Setup Guide

## 🚀 Ultra-Premium AI TodoChat

Your application is running on **http://localhost:3000** with a navy blue, neon sky, and gold luxury theme.

## 🧠 Connecting the Intelligence (LocalAI)

The chatbot relies on an **OpenAI-compatible API** to function. By default, it is configured for **LocalAI**.

### Option A: Run LocalAI (Free, Privacy-Focused)

1. **Install LocalAI**: [https://localai.io/basics/getting_started/](https://localai.io/basics/getting_started/)
2. **Run LocalAI**:
   ```bash
   # Example monitoring the models directory
   docker run -p 8080:8080 -v $PWD/models:/build/models -ti --rm quay.io/go-skynet/local-ai:latest
   ```
3. **Install a Model**:
   - Download a generic model like `llama-3-8b` or `phi-2`.
   - Place it in your models folder.
4. **Update .env**:
   Edit `src/app/phase3-chatbot/.env`:
   ```env
   LOCALAI_BASE_URL="http://127.0.0.1:8080/v1"
   LOCALAI_MODEL="your-model-name-here"
   ```

### Option B: Use OpenAI (Easy Setup)

If you prefer to use OpenAI's API instead of running a local model:

1. **Update .env**:
   ```env
   LOCALAI_BASE_URL="https://api.openai.com/v1"
   LOCALAI_MODEL="gpt-3.5-turbo"
   LOGOAL_API_KEY="sk-..." # You will need to add support for this in src/lib/localai.ts
   ```

## 🛠️ Troubleshooting

- **Server Port**: The app runs on port 3000. If it says "Port in use", it will pick the next available port (3001, etc).
- **Prisma Errors**: If you see Prisma errors, ensure you are running `npm run dev` and not `next dev` directly, as we fixed the configuration for Next.js 16.
- **Database**: The SQLite database is at `prisma/dev.db`. You can view it with `npx prisma studio`.

## ✨ Features

- **Natural Language Task Management**: "Add buy milk to my list"
- **Ultra-Premium UI**: Glassmorphism, Animations, Neon Glows
- **Tool Calling**: The AI can intelligently call `addTodo`, `listTodos`, etc.
