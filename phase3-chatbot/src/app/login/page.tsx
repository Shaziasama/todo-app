"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Redirect to dashboard on successful login
        router.push("/");
        router.refresh(); // Refresh to update the UI
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy p-4 text-sky-blue">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]">
          Welcome to AI TodoChat
        </h1>
        <p className="text-xl text-sky-blue drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">
          Your Luxury AI Todo Assistant
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md space-y-6 rounded-lg border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sky-blue">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sky-blue">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-sky-blue py-2 font-semibold text-navy transition-all duration-300 hover:bg-sky-blue/80 hover:drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] focus:outline-none focus:ring-2 focus:ring-sky-blue focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-sky-blue">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-white underline hover:text-sky-blue">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}