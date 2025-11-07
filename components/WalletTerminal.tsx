'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, Copy, Check } from 'lucide-react'

interface TerminalLine {
  text: string
  type: 'command' | 'output' | 'success' | 'error'
}

export default function WalletTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const generateWallet = () => {
    setIsGenerating(true)
    setLines([])
    setWalletAddress(null)

    const steps: Array<{ text: string; type: TerminalLine['type']; delay: number }> = [
      { text: '> Generating private key...', type: 'command', delay: 500 },
      { text: '> Encrypting...', type: 'command', delay: 1000 },
      { text: '> 402 protocol handshake...', type: 'command', delay: 1500 },
      { text: 'OK', type: 'success', delay: 2000 },
      { text: '> Wallet created:', type: 'command', delay: 2500 },
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, { text: step.text, type: step.type }])
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            const address = `4Kzz${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 5)}9Qa`
            setWalletAddress(address)
            setLines(prev => [...prev, { text: `> ${address} ✅`, type: 'success' }])
            setIsGenerating(false)
          }, 500)
        }
      }, step.delay)
    })
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-space-grotesk">
            Wallet Simulation Terminal
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience real-time wallet generation
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 border border-402-purple/20">
            <div className="flex items-center gap-2 mb-4">
              <TerminalIcon className="w-5 h-5 text-402-green" />
              <span className="text-sm font-mono text-muted-foreground">wallet402 terminal</span>
            </div>
            
            <div
              ref={terminalRef}
              className="bg-402-dark rounded-lg p-6 font-mono text-sm h-64 overflow-y-auto mb-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              <AnimatePresence>
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-2 ${
                      line.type === 'success' ? 'text-402-green' :
                      line.type === 'error' ? 'text-red-400' :
                      line.type === 'output' ? 'text-muted-foreground' :
                      'text-foreground'
                    }`}
                  >
                    {line.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isGenerating && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block"
                >
                  ▋
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={generateWallet}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-402-purple to-402-green rounded-lg font-semibold text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Wallet'}
              </button>

              {walletAddress && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Address:</span>
                  <code className="text-sm bg-card/50 px-3 py-2 rounded">{walletAddress}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-402-green" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`https://solscan.io/account/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-402-purple hover:underline"
                  >
                    View on Solscan →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

