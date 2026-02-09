"use server";

import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: State | undefined,
  formData: FormData
): Promise<State> {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  // Prepare data
  const { email, password } = validatedFields.data;

  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      // Delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        message: "Invalid credentials.",
      };
    }

    // Compare password with hashed password
    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
      // Delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        message: "Invalid credentials.",
      };
    }

    // Return success message to handle redirect on client side
    return { message: "Login successful" };
  } catch (error) {
    return {
      message: "Something went wrong.",
    };
  }
}