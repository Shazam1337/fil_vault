'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'
import NetworkVisualization from './NetworkVisualization'

interface HeroProps {
  walletCount: number
}

export default function Hero({ walletCount }: HeroProps) {
  // Конфигурация для 7 хаотично летающих логотипов FIL
  const flyingLogos = [
    { 
      size: 40, 
      startX: -200, 
      startY: -100, 
      pathX: [-200, -150, -180, -200],
      pathY: [-100, -150, -80, -100],
      duration: 8, 
      delay: 0, 
      rotate: [0, 360] 
    },
    { 
      size: 60, 
      startX: 250, 
      startY: -150, 
      pathX: [250, 300, 280, 250],
      pathY: [-150, -120, -180, -150],
      duration: 10, 
      delay: 1, 
      rotate: [0, -360] 
    },
    { 
      size: 35, 
      startX: -300, 
      startY: 100, 
      pathX: [-300, -250, -280, -300],
      pathY: [100, 80, 120, 100],
      duration: 12, 
      delay: 0.5, 
      rotate: [0, 180, -180, 0] 
    },
    { 
      size: 50, 
      startX: 280, 
      startY: 80, 
      pathX: [280, 320, 300, 280],
      pathY: [80, 100, 60, 80],
      duration: 9, 
      delay: 1.5, 
      rotate: [0, -180, 180, 0] 
    },
    { 
      size: 45, 
      startX: -180, 
      startY: 200, 
      pathX: [-180, -130, -160, -180],
      pathY: [200, 180, 220, 200],
      duration: 11, 
      delay: 0.8, 
      rotate: [0, 360] 
    },
    { 
      size: 55, 
      startX: 220, 
      startY: -80, 
      pathX: [220, 270, 250, 220],
      pathY: [-80, -50, -110, -80],
      duration: 7, 
      delay: 2, 
      rotate: [0, -360] 
    },
    { 
      size: 38, 
      startX: -250, 
      startY: -50, 
      pathX: [-250, -200, -230, -250],
      pathY: [-50, -20, -80, -50],
      duration: 13, 
      delay: 1.2, 
      rotate: [0, 180, -180, 0] 
    },
  ]

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16 pb-8">
      <NetworkVisualization />
      
      {/* Хаотично летающие логотипы FIL */}
      {flyingLogos.map((logo, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: logo.delay }}
          className="absolute pointer-events-none hidden md:block"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: `${logo.startX}px`,
            marginTop: `${logo.startY}px`,
          }}
        >
          <motion.div
            animate={{
              x: logo.pathX,
              y: logo.pathY,
              rotate: logo.rotate,
            }}
            transition={{
              duration: logo.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: logo.delay,
            }}
            className="relative"
            style={{
              width: `${logo.size}px`,
              height: `${logo.size}px`,
            }}
          >
            <Image
              src="/fil.png"
              alt="FIL"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(0, 144, 255, 0.6))',
                opacity: 0.7,
              }}
            />
          </motion.div>
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4 text-balance font-space-grotesk text-premium"
            style={{ letterSpacing: '0.02em' }}
          >
            <span className="text-white text-glow text-shadow-depth">
              Decentralized Vault
            </span>
            <br />
            <span className="text-gradient-fil">
              for Digital Assets
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed text-shadow-depth"
            style={{ letterSpacing: '0.01em' }}
          >
            Built on Filecoin Network. Your files don't live in the cloud. They live on Filecoin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-6"
          >
            <a 
              href="#storage-terminal"
              className="px-8 py-4 bg-gradient-to-r from-fil-blue to-fil-cyan rounded-lg font-semibold text-white text-lg hover:scale-105 transition-all glow-primary vault-glow inline-block"
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById('storage-terminal')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
            >
              Enter the Vault
            </a>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-fil-cyan font-semibold drop-shadow-[0_0_6px_rgba(0,246,255,0.6)]">
                <div className="w-2 h-2 bg-fil-cyan rounded-full animate-pulse shadow-[0_0_8px_rgba(0,246,255,0.8)]" />
                <span>Connected to: Filecoin Mainnet (Live)</span>
              </div>
              <div className="flex items-center gap-2 text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="w-4 h-4 text-fil-blue drop-shadow-[0_0_6px_rgba(0,144,255,0.6)]" />
                <span>Storage Nodes: {walletCount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

