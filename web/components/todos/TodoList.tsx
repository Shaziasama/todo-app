'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TodoItem from './TodoItem'
import CreateTodoForm from './CreateTodoForm'

interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
}

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
  const [createOpen, setCreateOpen] = useState(false)

  if (todos.length === 0 && !createOpen) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          No todos yet. Create your first todo!
        </p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
        {createOpen && (
          <div className="mt-6">
            <CreateTodoForm onClose={() => setCreateOpen(false)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Todos</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Todo
        </Button>
      </div>

      {createOpen && (
        <CreateTodoForm onClose={() => setCreateOpen(false)} />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}
