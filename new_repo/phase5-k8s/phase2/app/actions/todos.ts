'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createTodoSchema, updateTodoSchema, todoIdSchema } from '@/lib/validations'

export async function createTodo(title: string, description?: string): Promise<{
  success: boolean
  error?: string
  todo?: any
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const result = createTodoSchema.safeParse({ title, description })
    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    const todo = await prisma.todo.create({
      data: {
        title: result.data.title,
        description: result.data.description || null,
        userId: session.user.id,
      }
    })

    revalidatePath('/')
    return { success: true, todo }
  } catch (error) {
    console.error('Create todo error:', error)
    return { success: false, error: 'Unable to create todo. Please try again.' }
  }
}

export async function updateTodo(id: string, data: {
  title?: string
  description?: string
}): Promise<{
  success: boolean
  error?: string
  todo?: any
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate ID
    const idResult = todoIdSchema.safeParse(id)
    if (!idResult.success) {
      return { success: false, error: 'Invalid todo ID' }
    }

    // Validate update data
    const dataResult = updateTodoSchema.safeParse(data)
    if (!dataResult.success) {
      return { success: false, error: dataResult.error.errors[0].message }
    }

    // Check ownership
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo || todo.userId !== session.user.id) {
      return { success: false, error: 'Todo not found' }
    }

    // Update todo
    const updated = await prisma.todo.update({
      where: { id },
      data: {
        title: dataResult.data.title?.trim(),
        description: dataResult.data.description?.trim() || null,
      }
    })

    revalidatePath('/')
    return { success: true, todo: updated }
  } catch (error) {
    console.error('Update todo error:', error)
    return { success: false, error: 'Unable to update todo. Please try again.' }
  }
}

export async function toggleTodoComplete(id: string): Promise<{
  success: boolean
  error?: string
  completed?: boolean
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate ID
    const idResult = todoIdSchema.safeParse(id)
    if (!idResult.success) {
      return { success: false, error: 'Invalid todo ID' }
    }

    // Check ownership
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo || todo.userId !== session.user.id) {
      return { success: false, error: 'Todo not found' }
    }

    // Toggle completed
    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed }
    })

    revalidatePath('/')
    return { success: true, completed: updated.completed }
  } catch (error) {
    console.error('Toggle todo error:', error)
    return { success: false, error: 'Unable to update todo. Please try again.' }
  }
}

export async function deleteTodo(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate ID
    const idResult = todoIdSchema.safeParse(id)
    if (!idResult.success) {
      return { success: false, error: 'Invalid todo ID' }
    }

    // Check ownership
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo || todo.userId !== session.user.id) {
      return { success: false, error: 'Todo not found' }
    }

    // Delete todo
    await prisma.todo.delete({ where: { id } })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete todo error:', error)
    return { success: false, error: 'Unable to delete todo. Please try again.' }
  }
}
