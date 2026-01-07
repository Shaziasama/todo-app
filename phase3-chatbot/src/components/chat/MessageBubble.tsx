"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { ChatMessage } from "@/lib/messages";
import { Sparkles, Zap } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isTool = message.role === "tool";

  const formatTime = (date: Date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, "HH:mm");
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Premium Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-sky-500/50">
        <AvatarFallback className={`text-xs font-bold ${
          isUser ? "bg-sky-500/20 text-sky-300" : "bg-amber-500/20 text-amber-300"
        }`}>
          {isUser ? "YOU" : isAssistant ? "AI" : "⚙️"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={`flex flex-col gap-2 max-w-2xl ${isUser ? "items-end" : "items-start"}`}>
        {/* Badge for non-user messages */}
        {!isUser && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky-500/10 border border-sky-400/30">
            {isAssistant && <Sparkles className="w-3 h-3 text-amber-400" />}
            {isTool && <Zap className="w-3 h-3 text-sky-400" />}
            <span className="text-xs font-semibold neon-text">
              {message.role === "assistant" ? "Assistant" : "Tool"}
            </span>
          </div>
        )}

        {/* Premium Bubble */}
        <div
          className={`group px-4 py-3 rounded-2xl backdrop-blur-md transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-sky-500/30 to-sky-600/20 border border-sky-400/50 rounded-br-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]"
              : isTool
              ? "bg-gradient-to-br from-sky-500/10 to-emerald-500/10 border border-sky-400/20 rounded-bl-lg"
              : "bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/40 rounded-bl-lg shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
          }`}
        >
          {/* Handle JSON tool results */}
          {isTool && typeof message.metadata?.result === "object" ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-sky-300 uppercase tracking-wider">
                ✓ Tool Executed
              </p>
              <pre className="text-xs overflow-auto bg-black/40 text-sky-100 p-3 rounded-lg border border-sky-400/20 font-mono">
                {JSON.stringify(message.metadata.result, null, 2)}
              </pre>
            </div>
          ) : (
            <p className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
              isUser ? "text-sky-50" : isAssistant ? "text-amber-50" : "text-sky-100"
            }`}>
              {message.content}
            </p>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-sky-400/50 group-hover:text-sky-400 transition-colors px-2">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
