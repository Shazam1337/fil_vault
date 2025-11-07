'use client'

import { motion } from 'framer-motion'
import { Coins, Shield, LayoutDashboard } from 'lucide-react'

const features = [
  {
    icon: Coins,
    title: 'Microtransaction Ready',
    description: 'Each wallet supports embedded 402 payments for per-action monetization.',
    color: 'from-402-green to-402-teal',
  },
  {
    icon: Shield,
    title: 'On-Chain Privacy',
    description: 'Transactions are routed through isolated channels — no cross-trace links.',
    color: 'from-402-purple to-solana-purple',
  },
  {
    icon: LayoutDashboard,
    title: 'Unified Dashboard',
    description: 'Track all 402-linked wallets and rewards in one interface (coming soon).',
    color: 'from-solana-purple to-402-purple',
  },
]

export default function IntegrationLayer() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-402-purple to-402-green bg-clip-text text-transparent font-space-grotesk">
            Built for the 402 Protocol
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamless integration with the 402 ecosystem for microtransactions and privacy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="gradient-border group hover:scale-105 transition-all duration-300"
              >
                <div className="bg-card/50 rounded-xl p-8 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:glow-primary transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-402-green text-sm">
                    <span className="w-2 h-2 bg-402-green rounded-full animate-pulse" />
                    <span>402-compatible ✅</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

