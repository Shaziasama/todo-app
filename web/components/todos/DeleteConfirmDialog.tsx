'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deleteTodo } from '@/app/actions/todos'

interface Todo {
  id: string
  title: string
}

interface DeleteConfirmDialogProps {
  todo: Todo
  open: boolean
  onClose: () => void
}

export default function DeleteConfirmDialog({ todo, open, onClose }: DeleteConfirmDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const result = await deleteTodo(todo.id)

      if (result.success) {
        toast.success('Todo deleted!')
        onClose()
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete todo')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="font-semibold">{todo.title}</p>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
