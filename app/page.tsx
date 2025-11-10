'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import LiveNetworkFeed from '@/components/LiveNetworkFeed'
import Features from '@/components/Features'
import Analytics from '@/components/Analytics'
import WalletTerminal from '@/components/WalletTerminal'
import Header from '@/components/Header'

export default function Home() {
  const [nodeCount, setNodeCount] = useState(14092)

  useEffect(() => {
    // Simulate node count increment
    const interval = setInterval(() => {
      setNodeCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="network-grid absolute inset-0 opacity-15" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-fil-blue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fil-cyan/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Header />
      
      <div className="relative z-10">
        <Hero walletCount={nodeCount} />
        <WalletTerminal />
        <LiveNetworkFeed />
        <Features />
        <Analytics />
      </div>
    </main>
  )
}

