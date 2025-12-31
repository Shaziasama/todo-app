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
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            🗑️ Delete Todo
          </DialogTitle>
          <DialogDescription className="text-red-600">
            Are you sure you want to delete this todo?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-2 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="font-bold text-lg text-red-700">{todo.title}</p>
          <p className="text-sm text-red-600 mt-2 font-medium">
            ⚠️ This action cannot be undone!
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-2 border-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
          >
            {loading ? '🗑️ Deleting...' : '🗑️ Delete Forever'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
