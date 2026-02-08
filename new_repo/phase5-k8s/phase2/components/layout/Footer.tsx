'use client'

import { Heart, Sparkles } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t-4 border-purple-200 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Main Copyright */}
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <p className="text-lg font-bold">
              Made with <Heart className="inline h-5 w-5 text-red-300 fill-red-300 animate-pulse" /> by Shazia Zohaib
            </p>
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>

          {/* Copyright Text */}
          <p className="text-white/90 font-medium text-center">
            © {currentYear} Shazia Zohaib. All rights reserved.
          </p>

          {/* Tagline */}
          <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
            <p className="text-white font-semibold text-sm">
              ✨ Organizing Life, One Todo at a Time! ✨
            </p>
          </div>

          {/* Decorative Line */}
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
        </div>
      </div>
    </footer>
  )
}
