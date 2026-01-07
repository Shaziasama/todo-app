"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, Lock, Mail, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/chat");
      } else {
        toast.error(result?.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Premium Card */}
        <div className="glass-panel p-8 space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-sky-400 rounded-lg blur opacity-50"></div>
                <div className="relative bg-black px-4 py-2 rounded-lg">
                  <Sparkles className="w-6 h-6 mx-auto text-amber-400" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              AI TodoChat
            </h1>
            <p className="text-sky-300/70 text-sm">
              Premium AI-Powered Task Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-sky-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                Email Address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-black/30 border-sky-400/30 text-sky-50 placeholder-sky-400/40 focus:border-sky-400/60 focus:ring-sky-400/30"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-sky-200 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="bg-black/30 border-sky-400/30 text-sky-50 placeholder-sky-400/40 focus:border-sky-400/60 focus:ring-sky-400/30"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-sky-500/20 text-sky-400/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500/40 to-sky-500/40 border border-amber-400/60 text-amber-50 hover:from-amber-500/60 hover:to-sky-500/60 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Enter Chatbot
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sky-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a] text-sky-400/60">Demo Access</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="glass-panel-dark p-4 rounded-xl border border-sky-400/20 space-y-2 text-center">
            <p className="text-xs text-sky-300/70 uppercase tracking-widest font-semibold">Test Account</p>
            <div className="space-y-1">
              <p className="text-sm font-mono text-sky-100">user@example.com</p>
              <p className="text-sm font-mono text-sky-100">password</p>
            </div>
            <p className="text-xs text-sky-400/50 mt-3">
              ✨ Full access to all features
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-sky-400/40">
            Powered by LocalAI • Phase III Beta
          </p>
        </div>
      </div>
    </div>
  );
}
