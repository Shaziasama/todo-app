# Phase II: Full-Stack Web Todo Application

A modern, secure, multi-user todo application built with Next.js 14+, TypeScript, Prisma, and NextAuth.js.

## Features

- 🔐 **Secure Authentication**: Email/password login with bcrypt hashing
- ✅ **Full CRUD Operations**: Create, read, update, delete, and toggle todos
- 👤 **Multi-User Support**: Each user has their own private todo list
- 🎨 **Modern UI**: Responsive design with shadcn/ui components and Tailwind CSS
- 🔄 **Real-time Updates**: Optimistic UI updates for instant feedback
- 📱 **Mobile-Friendly**: Works seamlessly on mobile, tablet, and desktop
- 🔒 **Protected Routes**: Automatic redirection to login for unauthenticated users

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v4 with Credentials Provider
- **Styling**: Tailwind CSS v3+ with shadcn/ui components
- **Password Hashing**: bcrypt
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ or 20+
- npm 9+

## Quick Start

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and generate a secret:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add a random NEXTAUTH_SECRET (generate one with `openssl rand -base64 32`):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

This will create a SQLite database at `prisma/dev.db` with the User and Todo tables.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to the login page
3. Click "Sign up" to create a new account
4. Enter your email and a strong password (min 8 chars, uppercase, lowercase, number, special character)
5. You'll be automatically logged in and redirected to the dashboard

### Managing Todos

- **Create**: Click "Add Todo" button, enter title and optional description
- **Toggle Complete**: Click the checkbox to mark todos as complete/incomplete
- **Edit**: Click the pencil icon to edit title and description
- **Delete**: Click the trash icon and confirm deletion
- **Logout**: Click "Logout" button in the header

### Data Persistence

- All todos are stored in the SQLite database (`prisma/dev.db`)
- Sessions persist for 7 days
- Each user can only see and manage their own todos

## Project Structure

```
web/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth route group (excluded from URL)
│   │   ├── login/            # Login page
│   │   └── signup/           # Signup page
│   ├── actions/              # Server Actions
│   │   ├── auth.ts           # signUp action
│   │   └── todos.ts          # Todo CRUD actions
│   ├── api/auth/[...nextauth]/  # NextAuth API route
│   ├── layout.tsx            # Root layout with toast provider
│   ├── page.tsx              # Dashboard (protected)
│   └── globals.css           # Global Tailwind styles
│
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── sonner.tsx        # Toast notifications
│   ├── auth/
│   │   ├── LoginForm.tsx     # Login form component
│   │   └── SignupForm.tsx    # Signup form component
│   ├── todos/
│   │   ├── TodoList.tsx      # Todo list container
│   │   ├── TodoItem.tsx      # Individual todo item
│   │   ├── CreateTodoForm.tsx    # Create todo form
│   │   ├── EditTodoModal.tsx     # Edit todo modal
│   │   └── DeleteConfirmDialog.tsx # Delete confirmation
│   └── layout/
│       └── Header.tsx        # App header with logout
│
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client singleton
│   ├── validations.ts        # Zod validation schemas
│   └── utils.ts              # Utility functions
│
├── prisma/
│   ├── schema.prisma         # Database schema (User, Todo)
│   ├── migrations/           # Migration history
│   └── dev.db                # SQLite database file
│
├── .env.local                # Environment variables (not in git)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma generate` - Regenerate Prisma Client
- `npx prisma db reset` - Reset database (delete all data, re-run migrations)

## Database Schema

### User Model

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  todos        Todo[]
}
```

### Todo Model

```prisma
model Todo {
  id          String   @id @default(uuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT sessions with httpOnly cookies
- ✅ CSRF protection via NextAuth
- ✅ SQL injection prevention via Prisma parameterized queries
- ✅ XSS protection via React auto-escaping
- ✅ Authorization checks on every mutation (users can only access their own todos)
- ✅ Input validation with Zod schemas

## Validation Rules

### Email

- Valid email format (RFC 5322)
- Max 255 characters
- Must be unique

### Password

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

### Todo Title

- Required
- 1-200 characters
- Whitespace trimmed

### Todo Description

- Optional
- Max 1000 characters
- Whitespace trimmed

## Troubleshooting

### Database Connection Error

If you see `Can't reach database server`, run:

```bash
npx prisma migrate dev --name init
```

### NextAuth Session Error

If you see `NEXTAUTH_SECRET not set`:

1. Check `.env.local` exists
2. Verify `NEXTAUTH_SECRET` is set to a random string
3. Restart dev server (`Ctrl+C`, then `npm run dev`)

### Port Already in Use

If port 3000 is taken:

```bash
PORT=3001 npm run dev
```

Update `NEXTAUTH_URL` in `.env.local` to `http://localhost:3001`

### TypeScript Errors

```bash
npm install --save-dev @types/node @types/react @types/react-dom
npx prisma generate
```

Restart TypeScript server in VS Code (Cmd+Shift+P → "Restart TS Server")

## Testing

### Manual Testing Checklist

1. ✅ **Signup Flow**
   - Navigate to `/signup`
   - Create account with valid credentials
   - Verify auto-login and redirect to `/`

2. ✅ **Login Flow**
   - Log out
   - Navigate to `/login`
   - Log in with correct credentials
   - Verify redirect to `/`

3. ✅ **Create Todo**
   - Click "Add Todo"
   - Enter title and description
   - Verify todo appears in list

4. ✅ **Toggle Completion**
   - Click checkbox
   - Verify styling changes (strikethrough, faded)
   - Refresh page
   - Verify state persists

5. ✅ **Edit Todo**
   - Click edit icon
   - Modify title/description
   - Save changes
   - Verify updates appear

6. ✅ **Delete Todo**
   - Click delete icon
   - Confirm deletion
   - Verify todo removed

7. ✅ **Protected Routes**
   - Log out
   - Try accessing `/` (dashboard)
   - Verify redirect to `/login`

8. ✅ **Error Handling**
   - Try duplicate email signup → error displayed
   - Try wrong password login → error displayed
   - Try empty todo title → validation error

## Production Build

To build for production:

```bash
npm run build
npm run start
```

**Note**: For production deployment, migrate from SQLite to PostgreSQL or MySQL.

## License

This project is part of the Evolution of Todo multi-phase project.

## Support

For issues or questions, refer to the project documentation in `/specs/phase2-fullstack-web/`.
