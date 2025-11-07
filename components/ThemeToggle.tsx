'use client'

import { useState } from 'react'
import { Moon, Sun, Zap } from 'lucide-react'

interface ThemeToggleProps {
  is402Mode: boolean
  setIs402Mode: (value: boolean) => void
}

export default function ThemeToggle({ is402Mode, setIs402Mode }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-3 rounded-full bg-card/80 backdrop-blur-sm border border-402-purple/30 hover:bg-primary/10 transition-all glow-primary"
        title="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      <button
        onClick={() => setIs402Mode(!is402Mode)}
        className={`p-3 rounded-full backdrop-blur-sm border transition-all ${
          is402Mode
            ? 'bg-402-green/20 border-402-green/50 glow-accent'
            : 'bg-card/80 border-402-purple/30 hover:bg-primary/10'
        }`}
        title="402 Mode"
      >
        <Zap className={`w-5 h-5 ${is402Mode ? 'text-402-green' : ''}`} />
      </button>
    </div>
  )
}


