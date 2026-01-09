"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { toast } from "sonner";
import { runChatTurn } from "@/app/actions/chat";
import type { ChatMessage } from "@/lib/messages";
import { Sparkles } from "lucide-react";

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
    <div className="flex h-full flex-col overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-gold/30 to-sky-blue/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-12 h-12 text-gold" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-sky-blue to-gold bg-clip-text text-transparent">
                Hey, {userEmail?.split("@")[0]}! 👋
              </h2>
              <p className="text-sky-blue/70 mb-6 max-w-md">
                Your Premium AI Todo Assistant is ready. Manage your tasks naturally through conversation.
              </p>
              <div className="p-6 max-w-md" style={{background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)'}}>
                <p className="text-sm text-sky-blue/60 mb-4">Try saying:</p>
                <ul className="space-y-2 text-left">
                  <li className="text-sm text-sky-blue">💡 "Add buy groceries to my list"</li>
                  <li className="text-sm text-sky-blue">📋 "Show me all my tasks"</li>
                  <li className="text-sm text-sky-blue">✅ "Mark laundry as complete"</li>
                  <li className="text-sm text-sky-blue">🗑️ "Delete the dentist appointment"</li>
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
      <div className="border-t border-sky-blue/20 px-4 py-4" style={{background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)'}}>
        <div className="max-w-4xl mx-auto">
          <Composer onSubmit={handleSubmit} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
