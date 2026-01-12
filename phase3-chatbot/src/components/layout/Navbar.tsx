"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth"; // Import Session type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bot, LogOut } from "lucide-react";

export function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 bg-navy/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
          <Bot className="h-8 w-8 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
          <span className="text-2xl font-bold">
            AI <span className="text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">TodoChat</span>
          </span>
        </Link>
        <div className="flex-1 flex justify-end">
          {session?.user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-gold/50 transition-all duration-300 hover:border-gold hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-blue to-gold text-navy font-semibold">{session.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg border border-white/20 bg-navy/80 p-2 shadow-lg backdrop-blur-md text-sky-blue" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-sky-blue/70">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400 rounded-md flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
