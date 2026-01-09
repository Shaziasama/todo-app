# Todo Application - Multi-Phase Evolution

A comprehensive todo application showcasing progression from CLI to full-stack web application with AI integration.

## 🎯 Project Overview

This repository demonstrates the evolution of a todo application across multiple phases:

### Phase I: CLI Application
**Location**: `phase1/`

A command-line interface todo application built with Python.

**Features**:
- ✅ Basic CRUD operations via command line
- ✅ JSON file storage
- ✅ Pure Python implementation
- ✅ pytest for testing

[📖 Phase I Documentation →](./phase1/README.md)

---

### Phase II: Full-Stack Web Application
**Location**: `phase2/`

A modern, colorful web application with authentication and database.

**Features**:
- 🎨 Beautiful gradient UI (purple/pink/cyan theme)
- 🔐 User authentication with NextAuth.js
- 💾 SQLite database with Prisma ORM
- ⚡ Server Actions for real-time updates
- 📱 Responsive design with shadcn/ui
- 🎭 Animated components and icons
- 👤 Multi-user support with protected routes

**Tech Stack**:
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Prisma + SQLite
- NextAuth.js v4
- Tailwind CSS + shadcn/ui
- bcrypt for password hashing

[📖 Phase II Documentation →](./phase2/README.md)

---

### Phase III: AI-Powered Chatbot
**Location**: `phase3-chatbot/`

An ultra-premium AI-powered todo assistant with natural language processing capabilities.

**Features**:
- 🧠 Natural language task management ("Add buy milk to my list")
- 🔐 Enhanced authentication with signup functionality
- 💬 Interactive chat interface with AI responses
- 🛠️ Tool calling capabilities (addTodo, listTodos, etc.)
- 🎨 Luxury navy blue, neon sky, and gold UI theme
- 🤖 Integration with LocalAI or OpenAI-compatible APIs
- 📊 Real-time task management through AI conversations

**Tech Stack**:
- Next.js 16+ (App Router)
- TypeScript (strict mode)
- Prisma + SQLite
- NextAuth.js v4
- Tailwind CSS
- bcrypt for password hashing
- OpenAI-compatible API integration

[📖 Phase III Documentation →](./phase3-chatbot/README_PHASE3.md)

---

## 🚀 Quick Start

### Phase I (CLI)
```bash
cd phase1
uv sync
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python -m src.todo_cli
```

### Phase II (Web)
```bash
cd phase2
npm install
npx prisma migrate dev
npm run dev
```

### Phase III (AI Chatbot)
```bash
cd phase3-chatbot
npm install
npx prisma migrate dev
npm run dev
```

Visit: `http://localhost:3000`

For LocalAI setup, see [Phase III Documentation](./phase3-chatbot/README_PHASE3.md)

---

## 📁 Repository Structure

```
todo-app/
├── phase1/              # Phase I: CLI Application
│   ├── src/            # Python source code
│   ├── tests/          # Unit tests
│   ├── pyproject.toml  # Python project config
│   └── README.md       # Phase I documentation
│
├── phase2/              # Phase II: Web Application
│   ├── app/            # Next.js app router
│   ├── components/     # React components
│   ├── lib/            # Utilities and configs
│   ├── prisma/         # Database schema & migrations
│   ├── public/         # Static assets
│   └── README.md       # Phase II documentation
│
├── phase3-chatbot/      # Phase III: AI Chatbot
│   ├── app/            # Next.js app router with AI features
│   ├── components/     # React components
│   ├── lib/            # Utilities and AI configs
│   ├── prisma/         # Database schema & migrations
│   ├── public/         # Static assets
│   └── README.md       # Phase III documentation
│
├── .specify/           # Spec-Driven Development artifacts
├── specs/              # Feature specifications
├── history/            # Development history & prompts
└── README.md           # This file
```

---

## 🎨 Phase III Highlights

The AI-powered chatbot features:
- 🧠 Natural language processing for task management
- 💬 Conversational AI interface
- 🔐 Secure authentication with signup/login
- 🎨 Luxury navy blue, neon sky, and gold UI theme
- 🛠️ Smart tool calling for todo operations
- 📊 Real-time task visualization

---

## 👩‍💻 Author

**Shazia Zohaib**

---

## 📝 Development Approach

This project follows **Spec-Driven Development (SDD)** methodology:
1. Feature specification (`specs/`)
2. Implementation planning (`plan.md`)
3. Task breakdown (`tasks.md`)
4. Test-driven implementation
5. Documentation and deployment

All development history is preserved in `history/prompts/` for learning and reference.

---

## 🔮 Future Phases

- **Phase IV**: Kubernetes deployment
- **Phase V**: Cloud-native architecture with Dapr

---

## 📄 License

MIT License - feel free to use this project for learning!

---

**Made with ❤️ by Shazia Zohaib**

*Organizing Life, One Todo at a Time!* ✨
