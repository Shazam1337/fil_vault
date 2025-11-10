'use client'

import { useState, useEffect } from 'react'
import { X, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const [onlineUsers, setOnlineUsers] = useState(102)
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

  useEffect(() => {
    // Simulate online users count
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const connectWallet = async (walletType: 'phantom' | 'solflare') => {
    try {
      // Filecoin wallet connection (placeholder for actual Filecoin wallet integration)
      // In production, this would connect to Filecoin wallet providers
      setConnectedWallet(walletType)
      setIsWalletMenuOpen(false)
      console.log('Connected to Filecoin network')
    } catch (error) {
      console.error('Connection error:', error)
      alert('Failed to connect wallet')
    }
  }

  const disconnectWallet = () => {
    setConnectedWallet(null)
  }

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="FilVault logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-space-grotesk tracking-brand">FILvault</h1>
            <p className="text-xs text-muted-foreground tracking-tight">Decentralized Storage on Filecoin</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-fil-cyan rounded-full animate-pulse" />
            <span>Network: {onlineUsers} nodes</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Connect Wallet Button */}
            <div className="relative">
              {connectedWallet ? (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-fil-cyan/20 border border-fil-cyan/30 text-fil-cyan text-sm font-semibold">
                    Filecoin Wallet Connected
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Disconnect wallet"
                  >
                    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fil-blue to-fil-cyan rounded-lg font-semibold text-white hover:scale-105 transition-all glow-primary"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>

                  <AnimatePresence>
                    {isWalletMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-fil-blue/30 p-2 shadow-xl"
                      >
                        <button
                          onClick={() => connectWallet('phantom')}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <div className="font-semibold tracking-tight">Filecoin Wallet</div>
                          <div className="text-xs text-muted-foreground tracking-tight">Connect to network</div>
                        </button>
                        <button
                          onClick={() => connectWallet('solflare')}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors mt-2"
                        >
                          <div className="font-semibold tracking-tight">Ledger</div>
                          <div className="text-xs text-muted-foreground tracking-tight">Hardware wallet</div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* X Button */}
            <a
              href="https://x.com/FILvault_ink"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors group"
              title="Follow @FILvault_ink on X"
              aria-label="Follow FilVault on X (Twitter)"
            >
              <svg className="w-10 h-10 text-foreground group-hover:text-fil-blue transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
