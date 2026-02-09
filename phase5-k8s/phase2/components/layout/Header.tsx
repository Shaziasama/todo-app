'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Sparkles, CheckCircle2 } from 'lucide-react'

interface HeaderProps {
  userEmail: string
}

export default function Header({ userEmail }: HeaderProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    })
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 shadow-lg">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">My Awesome Todos</h1>
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-sm text-white/90 font-medium">{userEmail}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  )
}
