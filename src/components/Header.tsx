'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Moon, RefreshCw } from 'lucide-react'
import { useBalance } from '@/hooks/useApi'

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const taglines = [
    'Your tireless shadow for browser automation',
    "Nizhal means ‘shadow’ — let it work the web for you",
    'Let your shadow handle clicks, forms and data while you focus',
  ]
  const [taglineIndex, setTaglineIndex] = useState(0)
  const { data: balance, loading: balanceLoading, refreshBalance } = useBalance()
  // Removed global search (Cmd/Ctrl+K) per request

  useEffect(() => {
    const id = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % taglines.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  // No-op (search removed)

  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-white/40 animate-fade-in-up">
            <Moon className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-extrabold gradient-text animate-gradient-shift">
                Nizhal
              </h1>
              <Sparkles className="w-4 h-4 text-indigo-500/80" />
            </div>
            <p key={taglineIndex} className="text-xs text-gray-600 animate-fade-in-up">
              {taglines[taglineIndex]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshBalance}
            className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
            title="Refresh balance"
          >
            <span className="text-xs font-semibold">Credits: {balance?.balance ?? 0}</span>
            <RefreshCw className={`w-3.5 h-3.5 ${balanceLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  )
}