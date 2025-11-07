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
      // Check if wallet is installed
      const provider = walletType === 'phantom' 
        ? (window as any).solana 
        : (window as any).solflare

      if (!provider) {
        alert(`${walletType === 'phantom' ? 'Phantom' : 'Solflare'} wallet not found. Please install it first.`)
        return
      }

      // Connect to wallet
      const response = await provider.connect()
      setConnectedWallet(walletType)
      setIsWalletMenuOpen(false)
      console.log('Connected:', response.publicKey.toString())
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
          <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center glow-primary">
            <img 
              src="/logo.png" 
              alt="wallet402 logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground font-space-grotesk tracking-brand">wallet402</h1>
            <p className="text-xs text-muted-foreground tracking-tight">Private Gateway of the 402 Economy</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-402-green rounded-full animate-pulse" />
            <span>Online: {onlineUsers} users</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Connect Wallet Button */}
            <div className="relative">
              {connectedWallet ? (
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-lg bg-402-green/20 border border-402-green/30 text-402-green text-sm font-semibold">
                    {connectedWallet === 'phantom' ? 'Phantom' : 'Solflare'} Connected
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
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-402-purple to-402-green rounded-lg font-semibold text-white hover:scale-105 transition-all glow-primary"
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
                        className="absolute right-0 mt-2 w-48 glass-effect rounded-lg border border-402-purple/30 p-2 shadow-xl"
                      >
                        <button
                          onClick={() => connectWallet('phantom')}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <div className="font-semibold tracking-tight">Phantom</div>
                          <div className="text-xs text-muted-foreground tracking-tight">Most popular</div>
                        </button>
                        <button
                          onClick={() => connectWallet('solflare')}
                          className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary/10 transition-colors mt-2"
                        >
                          <div className="font-semibold tracking-tight">Solflare</div>
                          <div className="text-xs text-muted-foreground tracking-tight">Secure & fast</div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* X Button */}
            <a
              href="https://x.com/wallet402"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-primary/10 transition-colors group"
              title="Follow @wallet402 on X"
              aria-label="Follow wallet402 on X (Twitter)"
            >
              <svg className="w-10 h-10 text-foreground group-hover:text-402-purple transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
