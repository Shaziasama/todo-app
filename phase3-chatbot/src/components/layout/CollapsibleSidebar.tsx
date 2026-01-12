"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Plus, Menu, X } from "lucide-react";
import { ClientTodoCard } from "../todos/ClientTodoCard";
import { addTodo } from "@/app/actions/tools";
import { toast } from "sonner";
import { Todo } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CollapsibleSidebar({ todos, userId }: { todos: Todo[], userId: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // State for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Toggle sidebar collapse on desktop
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Toggle sidebar visibility on mobile
  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await addTodo(userId, {
        title,
        description,
      });

      if (result.success) {
        toast.success("Task added successfully!");
        // Reset form
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");

        // Note: Revalidation happens in the server action
      } else {
        toast.error(result.error || "Failed to add task");
      }
    } catch (error) {
      toast.error("An error occurred while adding the task");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-navy/80 backdrop-blur-lg border border-white/20 text-sky-blue"
        onClick={toggleMobile}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-in-out bg-navy/80 backdrop-blur-lg border-r border-white/20 overflow-hidden
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64 md:w-80'}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Navigation Links */}
          <nav className="mb-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                    pathname === "/" || pathname === "/chat"
                      ? "bg-sky-blue/30 text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.6)]"
                      : "text-sky-blue/80 hover:bg-sky-blue/20 hover:text-white hover:drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]"
                  }`}
                >
                  <Menu className="h-5 w-5 text-gold drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" />
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/todos"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                    pathname === "/todos"
                      ? "bg-sky-blue/30 text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.6)]"
                      : "text-sky-blue/80 hover:bg-sky-blue/20 hover:text-white hover:drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]"
                  }`}
                >
                  <Plus className="h-5 w-5 text-gold drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" />
                  Todos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Header with collapse button */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && <h2 className="text-xl font-bold text-white">Tasks</h2>}
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg bg-white/10 text-sky-blue hover:bg-white/20 transition-colors"
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>

          {/* Add Task Form */}
          {!isCollapsed && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Task</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-sky-blue mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-sky-blue mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-sky-blue mb-1">
                      <Calendar className="inline mr-1" size={16} /> Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min="2026-01-01"
                      max="2026-12-31"
                      className="w-full rounded-lg border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-sky-blue mb-1">
                      <Clock className="inline mr-1" size={16} /> Time
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full rounded-lg border border-sky-blue/30 bg-white/5 p-2 text-white shadow-sm outline-none transition-all duration-300 focus:border-sky-blue focus:ring-1 focus:ring-sky-blue focus:drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-sky-blue py-3 font-bold text-navy transition-all duration-300 hover:bg-sky-blue/90 hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.8)] focus:outline-none focus:ring-2 focus:ring-sky-blue focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50"
                >
                  Add Task
                </button>
              </form>
            </div>
          )}

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {!isCollapsed ? "Your Tasks" : ""}
            </h3>
            <div className="space-y-3">
              {todos.length > 0 ? (
                todos.map((todo) => (
                  <div key={todo.id} className={!isCollapsed ? "" : "hidden"}>
                    <ClientTodoCard todo={todo} />
                  </div>
                ))
              ) : (
                <p className="text-sky-blue/70 text-sm">
                  {!isCollapsed ? "No tasks yet. Add one above!" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobile}
        ></div>
      )}
    </>
  );
}