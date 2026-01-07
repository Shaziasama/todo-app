"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { toast } from "sonner";
import { runChatTurn } from "@/app/actions/chat";
import type { ChatMessage } from "@/lib/messages";
import { LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

interface ChatShellProps {
  userId: string;
  userEmail: string;
  initialMessages: ChatMessage[];
}

export function ChatShell({
  userId,
  userEmail,
  initialMessages,
}: ChatShellProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [messages]);

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      setIsLoading(true);

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Call server action
      const result = await runChatTurn({
        userId,
        userMessage: content.trim(),
        conversationHistory: messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
      });

      if (!result.success) {
        toast.error(result.error || "Failed to process message");
        return;
      }

      // Add assistant and any tool messages
      if (result.messages) {
        setMessages((prev) => [...prev, ...result.messages]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("An error occurred while processing your message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#0f172a]">
      {/* Premium Navbar */}
      <nav className="glass-panel-dark border-b border-sky-500/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
            <h1 className="text-xl font-bold gold-text">AI TodoChat</h1>
          </div>
          <div className="text-sm text-sky-200/80">{userEmail}</div>
          <button
            onClick={() => signOut()}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/30 to-sky-400/30 glass-panel-dark flex items-center justify-center mb-6 neon-glow animate-bounce">
                  <Sparkles className="w-12 h-12 text-amber-300" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent">
                Hey, {userEmail?.split("@")[0]}! 👋
              </h2>
              <p className="text-sky-200/70 mb-6 max-w-md">
                Your Premium AI Todo Assistant is ready. Manage your tasks naturally through conversation.
              </p>
              <div className="glass-panel p-6 max-w-md">
                <p className="text-sm text-sky-200/60 mb-4">Try saying:</p>
                <ul className="space-y-2 text-left">
                  <li className="text-sm text-sky-100">💡 "Add buy groceries to my list"</li>
                  <li className="text-sm text-sky-100">📋 "Show me all my tasks"</li>
                  <li className="text-sm text-sky-100">✅ "Mark laundry as complete"</li>
                  <li className="text-sm text-sky-100">🗑️ "Delete the dentist appointment"</li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="animate-in fade-in slide-in-from-bottom-4">
                  <MessageBubble message={message} />
                </div>
              ))}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Premium Input Footer */}
      <div className="glass-panel-dark border-t border-sky-500/10 backdrop-blur-xl px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Composer onSubmit={handleSubmit} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
