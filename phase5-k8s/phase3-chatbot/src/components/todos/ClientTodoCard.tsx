"use client";

import type { Todo } from "@prisma/client";
import { Check, X, Pencil, Trash2, Calendar } from "lucide-react";
import { toggleComplete, deleteTodo } from "@/app/actions/tools";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export function ClientTodoCard({ todo }: { todo: Todo }) {
  const { data: session } = useSession();

  const handleToggleComplete = async () => {
    try {
      const result = await toggleComplete(session?.user?.id!, { id: todo.id });
      if (result.success) {
        toast.success(`Task marked as ${todo.completed ? 'incomplete' : 'complete'}!`);
        // Note: Revalidation happens in the server action
      } else {
        toast.error(result.error || "Failed to update task");
      }
    } catch (error) {
      toast.error("An error occurred while updating the task");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const result = await deleteTodo(session?.user?.id!, { id: todo.id });
        if (result.success) {
          toast.success("Task deleted successfully!");
          // Note: Revalidation happens in the server action
        } else {
          toast.error(result.error || "Failed to delete task");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the task");
      }
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/20 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/20">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            className="mt-1 h-5 w-5 rounded border-sky-blue/50 bg-sky-blue/20 accent-gold focus:ring-sky-blue focus:ring-offset-navy"
          />
          <div>
            <h3 className={`font-bold text-lg ${todo.completed ? 'line-through text-sky-blue/50' : 'text-gold'} drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="mt-2 text-sm text-white/90">{todo.description}</p>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            todo.completed ? "bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.4)]" : "bg-gradient-to-r from-rose-500/30 to-rose-600/30 text-rose-300 drop-shadow-[0_0_5px_rgba(244,63,94,0.4)]"
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

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-400/80 transition-colors duration-200 hover:bg-rose-500/20 hover:text-rose-300 hover:drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
        <button className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-sky-blue/80 transition-colors duration-200 hover:bg-sky-blue/20 hover:text-sky-blue hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
}