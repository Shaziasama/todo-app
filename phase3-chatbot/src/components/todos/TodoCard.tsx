
import type { Todo } from "@prisma/client";
import { Check, X, Pencil, Trash2 } from "lucide-react"; // Added Pencil and Trash2 for potential future edit/delete actions

export function TodoCard({ todo }: { todo: Todo }) {
  return (
    <div className="relative rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">{todo.title}</h3>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            todo.completed ? "bg-green-500/20 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]" : "bg-red-500/20 text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]"
          }`}>
          {todo.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {todo.completed ? "Completed" : "Pending"}
        </div>
      </div>
      {todo.description && (
        <p className="mt-2 text-sm text-sky-blue/70">{todo.description}</p>
      )}
      <p className="mt-4 text-xs text-sky-blue/50">Created: {new Date(todo.createdAt).toLocaleDateString()}</p>

      {/* Placeholder for future Edit/Delete actions */}
      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button className="text-sky-blue/70 hover:text-sky-blue hover:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]">
          <Pencil className="h-4 w-4" />
        </button>
        <button className="text-red-400/70 hover:text-red-400 hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
