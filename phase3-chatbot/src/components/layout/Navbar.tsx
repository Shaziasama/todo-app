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
import { Bot, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button component

export function Navbar({ session }: { session: Session | null }) {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(14,165,233,0.4)]">
          <Bot className="h-6 w-6 text-sky-blue drop-shadow-[0_0_5px_rgba(14,165,233,0.8)]" />
          AI Todo<span className="text-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]">Chat</span>
        </Link>
        <div className="flex-1 flex justify-end">
          {session?.user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-gold/50 transition-all duration-300 hover:border-gold hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback className="bg-sky-blue text-navy font-semibold">{session.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg border border-white/20 bg-white/10 p-2 shadow-lg backdrop-blur-md text-sky-blue" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user.name}</p>
                      <p className="text-xs leading-none text-sky-blue/70">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-sky-blue/20 hover:text-white rounded-md">
                    <User className="mr-2 h-4 w-4 text-gold" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-sky-blue/20 hover:text-white rounded-md">
                    <Settings className="mr-2 h-4 w-4 text-gold" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer transition-colors duration-200 hover:bg-red-500/20 hover:text-red-400 rounded-md">
                    <LogOut className="mr-2 h-4 w-4 text-red-400" />
                    <span>Log out</span>
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
