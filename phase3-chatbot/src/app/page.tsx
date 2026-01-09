
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Bot, MessageSquare, CheckSquare, Settings } from "lucide-react"; // Import more icons
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Since middleware protects this route, session should always exist here
  const userName = session?.user?.name || session?.user?.email || "User";

  const recentTodos = await prisma.todo.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex flex-col space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-lg backdrop-blur-md">
        <div className="space-y-4 text-white">
          <h1 className="text-4xl font-bold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">Welcome back, {userName}!</h1>
          <p className="max-w-lg text-sky-blue/80">
            Your AI assistant is ready to help you manage your tasks and elevate your productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/chat"
              className="group flex items-center justify-center gap-2 rounded-xl bg-sky-blue px-6 py-3 font-semibold text-navy transition-all duration-300 hover:bg-sky-blue/80 hover:drop-shadow-[0_0_8px_rgba(14,165,233,0.6)] focus:outline-none focus:ring-2 focus:ring-sky-blue focus:ring-offset-2 focus:ring-offset-navy"
            >
              <MessageSquare className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" /> Start Chatting
            </Link>
            <Link
              href="/todos"
              className="group flex items-center justify-center gap-2 rounded-xl border border-gold px-6 py-3 font-semibold text-gold transition-all duration-300 hover:bg-gold/10 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-navy"
            >
              <CheckSquare className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" /> View Todos
            </Link>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <Bot className="h-48 w-48 text-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse-slow" />
          <div className="absolute inset-0 rounded-full bg-gold opacity-10 blur-xl"></div> {/* Subtle glow effect */}
        </div>
      </div>

      {/* Recent Activity / Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Todos */}
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">Recent Todos</h2>
          {recentTodos.length > 0 ? (
            <div className="space-y-3">
              {recentTodos.map((todo) => (
                <div key={todo.id} className="rounded-lg border border-sky-blue/20 bg-white/5 p-4 transition-all duration-300 hover:border-gold/50 hover:shadow-xl">
                  <h3 className="font-bold text-gold">{todo.title}</h3>
                  <p className="text-sm text-sky-blue/70">{todo.description || "No description"}</p>
                  <p className="text-xs text-sky-blue/50 mt-1">
                    {todo.completed ? "Completed" : "Incomplete"} - {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sky-blue/70">No recent todos. Start by adding one in chat!</p>
          )}
          <Link href="/todos" className="text-gold hover:underline hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] flex items-center gap-1 mt-4">
            View All Todos <span className="text-xs">→</span>
          </Link>
        </div>

        {/* Quick Actions (Example) */}
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="group flex items-center gap-2 rounded-lg border border-sky-blue/20 bg-white/5 p-4 text-sky-blue transition-all duration-300 hover:border-sky-blue/50 hover:bg-sky-blue/10 hover:drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]">
              <MessageSquare className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" /> Quick Chat
            </button>
            <button className="group flex items-center gap-2 rounded-lg border border-sky-blue/20 bg-white/5 p-4 text-gold transition-all duration-300 hover:border-gold/50 hover:bg-gold/10 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
              <Settings className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" /> Settings
            </button>
          </div>
        </div>

        {/* More content can go here */}
        <div className="space-y-4 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">AI Insights</h2>
          <p className="text-sky-blue/70">"Your productivity increased by 15% last week!"</p>
          <Link href="/insights" className="text-gold hover:underline hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] flex items-center gap-1 mt-4">
            View Analytics <span className="text-xs">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

