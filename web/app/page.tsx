import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Header from '@/components/layout/Header'
import TodoList from '@/components/todos/TodoList'

async function getTodos(userId: string) {
  return await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const todos = await getTodos(session.user.id)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userEmail={session.user.email || ''} />
      <main className="container mx-auto px-4 py-8">
        <TodoList todos={todos} />
      </main>
    </div>
  )
}
