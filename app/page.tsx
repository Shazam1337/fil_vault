'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import LiveNetworkFeed from '@/components/LiveNetworkFeed'
import Features from '@/components/Features'
import Analytics from '@/components/Analytics'
import WalletTerminal from '@/components/WalletTerminal'
import Header from '@/components/Header'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [walletCount, setWalletCount] = useState(14092)
  const [is402Mode, setIs402Mode] = useState(false)

  useEffect(() => {
    // Simulate wallet count increment
    const interval = setInterval(() => {
      setWalletCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className={`min-h-screen bg-background transition-colors duration-300 ${is402Mode ? '402-mode' : ''}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="network-grid absolute inset-0 opacity-15" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-402-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-402-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Header />
      
      <div className="relative z-10">
        <Hero walletCount={walletCount} />
        <WalletTerminal />
        <LiveNetworkFeed />
        <Features />
        <Analytics />
      </div>
      
      <ThemeToggle is402Mode={is402Mode} setIs402Mode={setIs402Mode} />
    </main>
  )
}

