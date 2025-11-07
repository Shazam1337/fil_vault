'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Lock } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Secure Generation',
    description: 'Entropy-level key creation using Solana-grade security.',
  },
  {
    icon: Eye,
    title: 'Privacy First',
    description: '402-compatible stealth routing for anonymous actions.',
  },
  {
    icon: Lock,
    title: 'Full Control',
    description: 'You own the keys. wallet402 just builds the layer.',
  },
]

export default function Features() {
  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
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
                <div className="bg-card/50 rounded-xl p-6 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-402-purple/20 to-402-green/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-all">
                    <Icon className="w-7 h-7 text-402-purple" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 font-space-grotesk tracking-brand">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed tracking-tight">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-402-green text-sm">
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

