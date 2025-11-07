'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'
import NetworkVisualization from './NetworkVisualization'

const Wallet3D = dynamic(() => import('./Wallet3D'), { ssr: false })

interface HeroProps {
  walletCount: number
}

export default function Hero({ walletCount }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16 pb-8">
      <NetworkVisualization />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <Wallet3D />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-balance font-space-grotesk text-premium"
            style={{ letterSpacing: '0.02em' }}
          >
            <span className="text-white text-glow text-shadow-depth">
              Private Wallet Generation
            </span>
            <br />
            <span className="text-gradient-402">
              for the 402 Network
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed text-shadow-depth"
            style={{ letterSpacing: '0.01em' }}
          >
            Generate secure Solana wallets designed for 402 microtransactions and anonymity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-402-green font-semibold drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                <div className="w-2 h-2 bg-402-green rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span>Connected to: 402 Mainnet (Live)</span>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="w-4 h-4 text-402-purple drop-shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
                <span>Wallets Generated: {walletCount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

