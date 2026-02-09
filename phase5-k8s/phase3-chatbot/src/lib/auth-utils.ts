"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export async function authenticate(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: result.error };
    }

    // Successful sign in - redirect to home
    redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred." };
    }
  }
}