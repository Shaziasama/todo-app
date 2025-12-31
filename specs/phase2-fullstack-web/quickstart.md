# Quickstart Guide: Phase II Full-Stack Web Todo Application

**Feature**: phase2-fullstack-web
**Date**: 2025-12-31
**Audience**: Developers setting up and running the application locally

## Purpose

This guide provides step-by-step instructions to set up, run, and verify the Phase II full-stack web todo application from scratch.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18.x or 20.x
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm**: Version 9.x+ (comes with Node.js)
  - Check: `npm --version`

- **Git**: For cloning repository (optional if working from archive)
  - Check: `git --version`
  - Download: https://git-scm.com/

- **Code Editor**: VS Code recommended
  - Download: https://code.visualstudio.com/

---

## Step 1: Project Setup

### 1.1 Navigate to Project Directory

```bash
cd todo-app
```

### 1.2 Install Dependencies

```bash
npm install
```

**Expected Output**:
```
added 324 packages, and audited 325 packages in 15s
```

**What Gets Installed**:
- Next.js 14+
- React 18+
- TypeScript 5+
- Prisma 5+
- NextAuth.js 4+
- Tailwind CSS 3+
- shadcn/ui dependencies (Radix UI, lucide-react, etc.)
- Zod, bcrypt, and other dependencies

---

## Step 2: Environment Configuration

### 2.1 Create `.env.local` File

```bash
# On Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# On macOS/Linux
touch .env.local
```

### 2.2 Add Environment Variables

Open `.env.local` and add:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# Node Environment
NODE_ENV="development"
```

### 2.3 Generate NextAuth Secret

**On macOS/Linux**:
```bash
openssl rand -base64 32
```

**On Windows (PowerShell)**:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Output Example**:
```
Xj8k9LmN4pQ2rS5tU6vW7xY8zA0bB1cC2dD3eE4fF5g=
```

Replace `your-random-secret-here` in `.env.local` with this value.

**Final `.env.local`**:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Xj8k9LmN4pQ2rS5tU6vW7xY8zA0bB1cC2dD3eE4fF5g="
NODE_ENV="development"
```

---

## Step 3: Initialize shadcn/ui

### 3.1 Run shadcn/ui Init

```bash
npx shadcn@latest init
```

**Prompts and Answers**:
```
? Which style would you like to use? › New York
? Which color would you like to use as base color? › Neutral
? Would you like to use CSS variables for colors? › yes
```

**What This Does**:
- Creates `components/ui/` directory
- Configures Tailwind CSS with shadcn/ui theme
- Adds utility files (`lib/utils.ts`)
- Updates `tailwind.config.ts`

### 3.2 Add Required Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add checkbox
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add toast
```

**What This Does**:
- Copies component files to `components/ui/`
- Each component is fully customizable
- No external dependency added (components are yours to own)

**Expected Structure**:
```
components/
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── label.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    ├── form.tsx
    └── toast.tsx
```

---

## Step 4: Database Setup

### 4.1 Generate Prisma Client

```bash
npx prisma generate
```

**Expected Output**:
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

**What This Does**:
- Reads `prisma/schema.prisma`
- Generates TypeScript types and Prisma Client
- Creates query methods for User and Todo models

### 4.2 Run Database Migrations

```bash
npx prisma migrate dev --name init
```

**Expected Output**:
```
Applying migration `20251231120000_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20251231120000_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

**What This Does**:
- Creates SQLite database file at `prisma/dev.db`
- Applies schema from `prisma/schema.prisma`
- Creates `User` and `Todo` tables
- Generates migration files in `prisma/migrations/`

### 4.3 (Optional) View Database

```bash
npx prisma studio
```

**What This Does**:
- Opens browser at `http://localhost:5555`
- Visual database browser
- View/edit data in User and Todo tables

---

## Step 5: Run Development Server

### 5.1 Start Next.js Dev Server

```bash
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

### 5.2 Open Browser

Navigate to: **http://localhost:3000**

**Expected Behavior**:
- Automatically redirects to `/login` (unauthenticated)
- Login page displayed

---

## Step 6: Verify Application

### 6.1 Create Account

1. On login page, click **"Don't have an account? Sign up"**
2. Navigate to `/signup`
3. Enter email: `test@example.com`
4. Enter password: `TestPass123!`
5. Click **"Create Account"**

**Expected Outcome**:
- Account created
- Auto-login
- Redirect to `/` (dashboard)
- Empty state: "No todos yet. Create your first todo!"

### 6.2 Create Todos

1. Click **"Add Todo"** button
2. Enter title: `Buy groceries`
3. Enter description (optional): `Milk, eggs, bread`
4. Click **"Save"**

**Expected Outcome**:
- Todo appears in list
- Shows title, description, checkbox, edit/delete buttons

**Create More Todos**:
- `Finish project report`
- `Call dentist` (mark as complete)
- `Read documentation`

### 6.3 Test Todo Operations

**Toggle Completion**:
- Click checkbox next to "Call dentist"
- Todo styled as complete (strikethrough, faded)
- Refresh page → checkbox state persists

**Edit Todo**:
- Click edit icon on "Buy groceries"
- Change title to: `Buy groceries and snacks`
- Add description: `Milk, eggs, bread, chips`
- Click **"Save"**
- Changes reflected immediately

**Delete Todo**:
- Click delete icon on "Read documentation"
- Confirmation dialog appears
- Click **"Delete"**
- Todo removed from list

### 6.4 Test Session Persistence

1. Refresh browser page (F5 or Cmd+R)
   - Should stay logged in
   - Todos still visible

2. Close browser tab
3. Open new tab → http://localhost:3000
   - Should stay logged in (7-day session)
   - Todos still visible

### 6.5 Test Logout

1. Click **"Logout"** button
2. Redirect to `/login`
3. Try navigating to http://localhost:3000
   - Redirect back to `/login` (protected route)

### 6.6 Test Login

1. On `/login` page
2. Enter email: `test@example.com`
3. Enter password: `TestPass123!`
4. Click **"Log In"**
5. Redirect to dashboard
6. All todos still visible (persisted in database)

---

## Step 7: Verify Technical Requirements

### 7.1 Check TypeScript

```bash
npx tsc --noEmit
```

**Expected Output**:
```
(No errors - silent success)
```

If errors appear, fix type issues before continuing.

### 7.2 Run Linter

```bash
npm run lint
```

**Expected Output**:
```
✔ No ESLint warnings or errors
```

### 7.3 Test Build

```bash
npm run build
```

**Expected Output**:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    1.2 kB         95 kB
├ ○ /login                               1.1 kB         94 kB
└ ○ /signup                              1.1 kB         94 kB

○  (Static)  automatically rendered as static HTML
```

**What This Does**:
- Compiles TypeScript
- Bundles JavaScript
- Optimizes assets
- Verifies no build errors

### 7.4 Run Production Build (Optional)

```bash
npm run build
npm run start
```

Navigate to http://localhost:3000 and repeat verification steps.

---

## Troubleshooting

### Issue: Database Connection Error

**Error**: `Can't reach database server at file:./dev.db`

**Solution**:
```bash
npx prisma migrate dev --name init
```

Re-run migrations to create database file.

---

### Issue: NextAuth Session Error

**Error**: `NEXTAUTH_SECRET not set`

**Solution**:
1. Check `.env.local` exists
2. Verify `NEXTAUTH_SECRET` is set
3. Restart dev server (`Ctrl+C`, then `npm run dev`)

---

### Issue: Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:

**Option 1**: Stop existing process on port 3000

**Option 2**: Use different port
```bash
PORT=3001 npm run dev
```

Update `NEXTAUTH_URL` in `.env.local`:
```env
NEXTAUTH_URL="http://localhost:3001"
```

---

### Issue: shadcn/ui Components Not Found

**Error**: `Cannot find module '@/components/ui/button'`

**Solution**:
```bash
npx shadcn@latest add button
```

Re-add missing components.

---

### Issue: TypeScript Errors

**Error**: Various type errors

**Solution**:
```bash
npm install --save-dev @types/node @types/react @types/react-dom
npx prisma generate
```

Regenerate Prisma types and restart TypeScript server in VS Code (Cmd+Shift+P → "Restart TS Server").

---

## Development Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check without emitting files |
| `npx prisma studio` | Open database GUI (http://localhost:5555) |
| `npx prisma migrate dev` | Create and apply new migration |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma db seed` | Seed database with test data |
| `npx prisma db reset` | Reset database (delete all data, re-run migrations) |

---

## Project Structure Overview

```
todo-app/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group (excluded from URL)
│   │   ├── login/
│   │   │   └── page.tsx      # Login page
│   │   └── signup/
│   │       └── page.tsx      # Signup page
│   ├── actions/              # Server Actions
│   │   ├── auth.ts           # signUp action
│   │   └── todos.ts          # Todo CRUD actions
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts  # NextAuth API route
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Dashboard (protected)
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx     # Login form component
│   │   └── SignupForm.tsx    # Signup form component
│   ├── todos/
│   │   ├── TodoList.tsx      # Todo list container
│   │   ├── TodoItem.tsx      # Individual todo item
│   │   ├── CreateTodoForm.tsx # Create todo form
│   │   ├── EditTodoModal.tsx  # Edit todo modal
│   │   └── DeleteConfirmDialog.tsx # Delete confirmation
│   └── layout/
│       ├── Header.tsx        # App header
│       └── Navbar.tsx        # Navigation bar
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client instance
│   └── validations.ts        # Zod schemas
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration history
│   └── dev.db                # SQLite database file
├── public/                   # Static assets
├── .env.local                # Environment variables (not in git)
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## Next Steps

Now that your application is running:

1. **Review Implementation Plan**: Read `specs/phase2-fullstack-web/plan.md`
2. **Generate Tasks**: Run `/sp.tasks` to break down implementation into tasks
3. **Start Implementation**: Run `/sp.implement` to begin coding
4. **Test Thoroughly**: Verify all acceptance criteria from `spec.md`

---

## Success Criteria Checklist

After completing quickstart, you should have:

- [x] Node.js 18+ installed
- [x] Project dependencies installed (`npm install`)
- [x] Environment variables configured (`.env.local`)
- [x] shadcn/ui initialized and components added
- [x] Prisma client generated
- [x] Database created and migrated
- [x] Development server running (`npm run dev`)
- [x] Application accessible at http://localhost:3000
- [x] User signup working
- [x] User login working
- [x] Todo CRUD operations working
- [x] Session persistence working
- [x] TypeScript compiling without errors
- [x] Build succeeding without errors

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **NextAuth.js Documentation**: https://next-auth.js.org/
- **shadcn/ui Documentation**: https://ui.shadcn.com/
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs

---

**Quickstart Status**: ✅ Complete
**Estimated Time**: 15-20 minutes (first-time setup)
