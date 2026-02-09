import { z } from 'zod'

// Auth validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(255, 'Email must be 255 characters or less')
  .trim()
  .toLowerCase()

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Todo validation schemas
export const todoTitleSchema = z
  .string()
  .min(1, 'Todo title is required')
  .max(200, 'Title must be 200 characters or less')
  .trim()

export const todoDescriptionSchema = z
  .string()
  .max(1000, 'Description must be 1000 characters or less')
  .trim()
  .optional()
  .nullable()

export const createTodoSchema = z.object({
  title: todoTitleSchema,
  description: todoDescriptionSchema,
})

export const updateTodoSchema = z.object({
  title: todoTitleSchema.optional(),
  description: todoDescriptionSchema,
})

export const todoIdSchema = z.string().uuid('Invalid todo ID')
