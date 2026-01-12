"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot } from "lucide-react";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] p-4 text-sky-blue">
      {/* Welcome Message */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
          Welcome to AI TodoChat
        </h1>
        <p className="text-lg text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">
          Your Luxury AI Todo Assistant
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md space-y-6 luxury-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sky-blue mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="luxury-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sky-blue mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="luxury-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full luxury-btn"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-sky-blue">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-gold hover:underline hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}