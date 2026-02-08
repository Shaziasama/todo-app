"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, CheckSquare, Bot } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/todos", label: "Todos", icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/20 bg-white/10 p-4 flex flex-col backdrop-blur-md">
      <div className="flex items-center gap-2 p-4 mb-4">
        <Bot className="h-8 w-8 text-sky-blue drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]" />
        <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">
          AI Todo<span className="text-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">Chat</span>
        </h1>
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300 hover:bg-sky-blue/20 hover:text-white hover:drop-shadow-[0_0_5px_rgba(14,165,233,0.4)] ${
              pathname === link.href ? "bg-sky-blue/30 text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.6)]" : "text-sky-blue/80"
            }`}
          >
            <link.icon className="h-5 w-5 text-gold drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
