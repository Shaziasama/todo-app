"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { Todo } from "@prisma/client";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  todos: Todo[];
  userId: string;
}

export function AuthenticatedLayout({ children, todos, userId }: AuthenticatedLayoutProps) {
  const [sidebarTodos, setSidebarTodos] = useState<Todo[]>(todos);
  const pathname = usePathname();

  // Update todos when they change (e.g., after adding/deleting via chat)
  useEffect(() => {
    setSidebarTodos(todos);
  }, [todos]);

  return (
    <div className="flex min-h-screen">
      <CollapsibleSidebar
        todos={sidebarTodos}
        userId={userId}
      />
      <main className={`flex-1 transition-all duration-300 pt-16 ${pathname === '/' || pathname === '/chat' ? 'md:ml-80' : 'md:ml-20'}`}>
        {children}
      </main>
    </div>
  );
}