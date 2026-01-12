
import type { Todo } from "@prisma/client";
import { Check, X, Pencil, Trash2, Calendar } from "lucide-react";

export function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-5 w-5 rounded border-sky-blue/30 bg-sky-blue/20"></div>
          <div>
            <h3 className={`font-bold text-lg ${todo.completed ? 'line-through text-sky-blue/50' : 'text-gold'} drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="mt-2 text-sm text-sky-blue/80">{todo.description}</p>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            todo.completed ? "bg-green-500/20 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]" : "bg-red-500/20 text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]"
          }`}>
          {todo.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {todo.completed ? "Completed" : "Pending"}
        </div>
      </div>

      {/* Date and Time Information */}
      {todo.createdAt && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-sky-blue/60">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 opacity-70" />
            <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
