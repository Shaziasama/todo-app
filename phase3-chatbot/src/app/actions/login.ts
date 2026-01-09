"use server";

import { signIn } from "next-auth/react";
import { z } from "zod";
import { AuthError } from "next-auth";
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
    // Attempt to sign in with credentials
    // Note: We can't use signIn from next-auth/react in a server action
    // Instead, we'll throw a redirect error that can be caught by the client
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect
    });

    if (signInResult?.error) {
      return {
        message: "Invalid credentials.",
      };
    }

    // Return success message to handle redirect on client side
    return { message: "Login successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials.",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}