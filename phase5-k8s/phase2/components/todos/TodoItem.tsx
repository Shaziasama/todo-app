'use client'

import { useState, useOptimistic } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import { toggleTodoComplete } from '@/app/actions/todos'
import { toast } from 'sonner'
import EditTodoModal from './EditTodoModal'
import DeleteConfirmDialog from './DeleteConfirmDialog'

interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    todo.completed,
    (state) => !state
  )
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleToggle = async () => {
    setOptimisticCompleted(!todo.completed)
    const result = await toggleTodoComplete(todo.id)
    if (!result.success) {
      toast.error(result.error || 'Failed to update todo')
    }
  }

  return (
    <>
      <Card className={`transition-all duration-300 hover:shadow-2xl border-2 ${
        optimisticCompleted
          ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 opacity-75'
          : 'border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 hover:scale-105'
      }`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={optimisticCompleted}
              onCheckedChange={handleToggle}
              className="mt-1 h-5 w-5 border-2 border-purple-400 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg ${
                optimisticCompleted
                  ? 'line-through text-gray-500'
                  : 'bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm mt-2 ${
                  optimisticCompleted
                    ? 'line-through text-gray-400'
                    : 'text-purple-600'
                }`}>
                  {todo.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                className="hover:bg-blue-100 hover:text-blue-600 transition-all"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                className="hover:bg-red-100 hover:text-red-600 transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTodoModal
        todo={todo}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <DeleteConfirmDialog
        todo={todo}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  )
}
