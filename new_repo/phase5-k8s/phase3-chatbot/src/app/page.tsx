
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Bot } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChatShell } from "@/components/chat/ChatShell";
import { getMessages } from "@/lib/messages";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is logged in, show dashboard with chat
  if (session) {
    const messages = await getMessages(session.user.id, 100);
    return (
      <div className="h-screen w-full">
        <ChatShell
          userId={session.user.id}
          userEmail={session.user.email}
          initialMessages={messages}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center gap-10 rounded-3xl border border-white/20 bg-white/10 p-12 shadow-2xl backdrop-blur-xl max-w-4xl w-full">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-sky-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]">
            Welcome to Your Smart Todo Assistant
          </h1>
          <p className="text-2xl text-white max-w-2xl mx-auto">
            Manage tasks naturally with AI
          </p>
        </div>

        <div className="relative">
          <Bot className="h-64 w-64 text-sky-blue drop-shadow-[0_0_25px_rgba(56,189,248,0.8)] animate-pulse-slow" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-blue to-gold opacity-30 blur-2xl"></div>
        </div>

        <Link
          href="/login"
          className="group flex items-center justify-center gap-3 rounded-2xl bg-sky-blue px-10 py-5 font-bold text-navy text-xl transition-all duration-300 hover:bg-sky-blue/90 hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] focus:outline-none focus:ring-2 focus:ring-sky-blue focus:ring-offset-2 focus:ring-offset-navy"
        >
          Get Started
        </Link>
      </div>

      <p className="mt-8 text-center text-sky-blue/70 max-w-2xl">
        If you don't have an account, create your account then start
      </p>
    </div>
  );
}

