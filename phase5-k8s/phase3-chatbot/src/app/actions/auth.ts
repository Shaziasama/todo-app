"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ActionResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function signUp(prevState: ActionResponse | undefined, formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
      },
    });

    // Since we can't directly sign in from a server action,
    // we'll return success and let the client handle the redirect
    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}