'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ListTodo, Sparkles } from 'lucide-react'
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
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-xl animate-float">
            <ListTodo className="h-16 w-16 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Your Todo List is Empty! 🎯
        </h2>
        <p className="text-lg text-purple-600 mb-6 font-medium">
          Let's add your first task and start being productive!
        </p>
        <Button
          onClick={() => setCreateOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Your First Todo
        </Button>
        {createOpen && (
          <div className="mt-8 max-w-2xl mx-auto">
            <CreateTodoForm onClose={() => setCreateOpen(false)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
            <ListTodo className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Tasks
            </h2>
            <p className="text-sm text-purple-600 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'} total
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Todo
        </Button>
      </div>

      {createOpen && (
        <div className="max-w-2xl mx-auto">
          <CreateTodoForm onClose={() => setCreateOpen(false)} />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
}
