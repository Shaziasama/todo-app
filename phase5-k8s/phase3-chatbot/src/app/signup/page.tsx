"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // Call your API endpoint to register the user
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Signing you in...");

        // Automatically sign in the user after successful signup
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          setError("Account created but failed to sign in. Please try logging in manually.");
        } else {
          // Redirect to dashboard on successful login after signup
          router.push("/");
          router.refresh();
        }
      } else {
        setError(data.message || "Something went wrong during signup.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
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
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-sky-blue mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="luxury-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
          <button
            type="submit"
            className="w-full luxury-btn"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-sky-blue">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gold hover:underline hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}