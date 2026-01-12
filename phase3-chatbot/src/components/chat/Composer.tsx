"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles } from "lucide-react";

interface ComposerProps {
  onSubmit: (content: string) => Promise<void> | void;
  disabled?: boolean;
}

export function Composer({ onSubmit, disabled = false }: ComposerProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const canSend = content.trim() && !isSubmitting && !disabled;

  return (
    <div className="relative">
      <div className="luxury-card p-4 rounded-2xl border border-white/20">
        <div className="relative">
          <Textarea
            placeholder="Ask your AI assistant... (Ctrl+Enter to send)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting || disabled}
            className="min-h-12 max-h-32 resize-none bg-white/5 border border-sky-400/30 text-white placeholder-sky-400/50 focus:border-gold focus:ring-gold focus:drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
            rows={1}
          />

          {/* Floating Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={`absolute bottom-3 right-3 rounded-full p-3 transition-all duration-300 ${
              canSend
                ? "bg-gradient-to-br from-gold to-amber-500 border border-gold/60 text-navy shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-110 cursor-pointer"
                : "bg-sky-500/10 border border-sky-400/20 text-sky-400/40 cursor-not-allowed"
            }`}
            title={canSend ? "Send message (Ctrl+Enter)" : "Type a message to send"}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : canSend ? (
              <Send className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Helpful text */}
      <p className="text-xs text-sky-400/50 mt-2 text-center">
        {canSend ? "✨ Ready to assist" : "💭 Type to get started"}
      </p>
    </div>
  );
}
