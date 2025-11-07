'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Sparkles, Key, ExternalLink } from 'lucide-react'
import dynamic from 'next/dynamic'

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false })

interface FeedItem {
  id: string
  wallet: string
  action: string
  icon: typeof CheckCircle2
  timestamp: Date
}

export default function LiveNetworkFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const actions = [
    { text: 'generated via wallet402', icon: CheckCircle2, color: 'text-402-green' },
    { text: 'connected to 402 stream', icon: Sparkles, color: 'text-402-purple' },
    { text: 'exported private key', icon: Key, color: 'text-solana-teal' },
  ]

  useEffect(() => {
    const generateItem = (): FeedItem => {
      const action = actions[Math.floor(Math.random() * actions.length)]
      const wallet = `wallet_${Math.random().toString(36).substring(2, 7)}...${Math.random().toString(36).substring(2, 5)}`
      
      return {
        id: Math.random().toString(36),
        wallet,
        action: action.text,
        icon: action.icon,
        timestamp: new Date(),
      }
    }

    // Initial items
    const initialItems = Array.from({ length: 5 }, generateItem)
    setFeedItems(initialItems)

    // Add new items every 3-5 seconds
    const interval = setInterval(() => {
      setFeedItems(prev => {
        const newItem = generateItem()
        return [newItem, ...prev].slice(0, 10)
      })
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [])

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
            Live Network Feed
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time activity from the 402 network
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 border border-402-purple/20">
            <div className="space-y-3">
              <AnimatePresence>
                {feedItems.map((item, index) => {
                  const Icon = item.icon
                  const actionConfig = actions.find(a => a.text === item.action)
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-card/30 hover:bg-card/50 transition-colors cursor-pointer group"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Icon className={`w-5 h-5 ${actionConfig?.color || 'text-402-green'}`} />
                        <div className="flex-1">
                          <span className="font-mono text-sm">{item.wallet}</span>
                          <span className="text-muted-foreground ml-2">→ {item.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                      {hoveredItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-4 bg-card border border-402-purple/30 rounded-lg p-4 shadow-xl z-10"
                        >
                          <QRCodeSVG value={item.wallet} size={128} />
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <ExternalLink className="w-3 h-3" />
                            <span>View on Solscan</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

