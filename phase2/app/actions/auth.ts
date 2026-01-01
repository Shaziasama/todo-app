'use server'

import { hash } from 'bcryptjs'
import { signIn } from 'next-auth/react'
import { prisma } from '@/lib/db'
import { signupSchema } from '@/lib/validations'

export async function signUp(email: string, password: string): Promise<{
  success: boolean
  error?: string
  user?: { id: string; email: string }
}> {
  try {
    // Validate input
    const result = signupSchema.safeParse({ email, password })
    if (!result.success) {
      return { success: false, error: result.error.errors[0].message }
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: result.data.email }
    })

    if (existing) {
      return { success: false, error: 'An account with this email already exists' }
    }

    // Hash password
    const passwordHash = await hash(result.data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        passwordHash,
      }
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
      }
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Unable to create account. Please try again.' }
  }
}
