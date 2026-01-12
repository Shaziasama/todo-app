
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ClientTodoCard } from "@/components/todos/ClientTodoCard";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation"; // Keep redirect as it's used elsewhere
import { unstable_noStore as noStore } from "next/cache";

export default async function TodosPage() {
  const session = await getServerSession(authOptions);

  // Middleware handles redirection, so session should always be present here for authenticated users.
  // This check is mainly for type safety if used outside a protected route context.
  if (!session) {
    redirect("/login");
  }

  // Ensure fresh data is fetched without caching
  noStore();

  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">Your Todos</h1>
        <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 font-bold text-navy transition-all duration-300 hover:from-sky-400 hover:to-cyan-400 hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-navy">
          <Plus className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          Add Todo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {todos.map((todo) => (
          <ClientTodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

