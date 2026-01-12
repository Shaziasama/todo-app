"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { ChatMessage } from "@/lib/messages";
import { Sparkles, Zap } from "lucide-react";
import { ClientTodoCard } from "@/components/todos/ClientTodoCard";
import type { Todo } from "@prisma/client";

interface MessageBubbleProps {
  message: ChatMessage;
}

function isTodoList(result: unknown): result is Todo[] {
    return Array.isArray(result) && result.every(item => typeof item === 'object' && item !== null && 'id' in item && 'title' in item && 'completed' in item);
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isTool = message.role === "tool";

  const formatTime = (date: Date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "HH:mm");
  };

  const renderContent = () => {
    // If it's a tool message and contains a list of todos in metadata.result
    if (isTool && message.metadata && isTodoList(message.metadata.result)) {
      const todos = message.metadata.result;
      return (
        <div className="space-y-4">
            <p className="text-sky-blue/80">Here are your todos:</p>
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {todos.map((todo) => (
                    <ClientTodoCard key={todo.id} todo={todo} />
                ))}
            </div>
        </div>
      );
    }

    // Original tool message rendering for other tool results
    if (isTool && typeof message.metadata?.result === "object") {
      return (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
            ✓ Tool Executed
          </p>
          <pre className="text-xs overflow-auto bg-white/5 text-sky-100 p-3 rounded-lg border border-white/20 font-mono">
            {JSON.stringify(message.metadata.result, null, 2)}
          </pre>
        </div>
      );
    }

    return (
        <p className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
            isUser ? "text-white" : isAssistant ? "text-white" : "text-sky-100"
        }`}>
            {message.content}
        </p>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Premium Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-sky-blue/50">
        <AvatarFallback className={`text-xs font-bold ${
          isUser ? "bg-gradient-to-br from-sky-blue/30 to-sky-blue/20 text-sky-blue/80" : "bg-gradient-to-br from-gold/30 to-yellow-500/20 text-gold/80"
        }`}>
          {isUser ? "YOU" : isAssistant ? "AI" : "⚙️"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-2xl ${isUser ? "items-end" : "items-start"}`}>
        {/* Badge for non-user messages */}
        {!isUser && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-white/20 bg-white/10 text-sky-blue/80 text-xs font-semibold">
            {isAssistant && <Sparkles className="w-3 h-3 text-gold drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" />}
            {isTool && <Zap className="w-3 h-3 text-sky-blue drop-shadow-[0_0_3px_rgba(14,165,233,0.5)]" />}
            <span>
              {message.role === "assistant" ? "Assistant" : "Tool"}
            </span>
          </div>
        )}

        {/* Premium Bubble */}
        <div
          className={`group px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-sky-blue/20 to-sky-blue/10 border border-sky-blue/30 rounded-br-lg shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
              : isTool
              ? "bg-gradient-to-br from-sky-blue/10 to-emerald-500/10 border border-sky-blue/20 rounded-bl-lg"
              : "bg-gradient-to-br from-gold/20 to-yellow-500/10 border border-gold/30 rounded-bl-lg shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
          }`}
        >
          {renderContent()}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-sky-blue/50 group-hover:text-sky-blue transition-colors px-2">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
