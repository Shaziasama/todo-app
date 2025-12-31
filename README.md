# Todo Application - Multi-Phase Evolution

A comprehensive todo application showcasing progression from CLI to full-stack web application.

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

Visit: `http://localhost:3000`

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
├── .specify/           # Spec-Driven Development artifacts
├── specs/              # Feature specifications
├── history/            # Development history & prompts
└── README.md           # This file
```

---

## 🎨 Phase II Screenshots

The web application features:
- 💜 Gradient backgrounds with animations
- ✨ Sparkles, rocket, and heart icons
- 🎯 Smooth hover effects and transitions
- 🌈 Colorful buttons and cards
- 📱 Fully responsive design

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

- **Phase III**: AI-powered features
- **Phase IV**: Kubernetes deployment
- **Phase V**: Cloud-native architecture with Dapr

---

## 📄 License

MIT License - feel free to use this project for learning!

---

**Made with ❤️ by Shazia Zohaib**

*Organizing Life, One Todo at a Time!* ✨
