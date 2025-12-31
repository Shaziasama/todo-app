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
      <Card className={optimisticCompleted ? 'opacity-60' : ''}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={optimisticCompleted}
              onCheckedChange={handleToggle}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${optimisticCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm mt-1 ${optimisticCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                  {todo.description}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
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
