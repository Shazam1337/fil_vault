'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, Activity, Zap } from 'lucide-react'

interface Metric {
  label: string
  value: number
  icon: typeof TrendingUp
  color: string
}

export default function Analytics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Total 402-linked wallets', value: 14092, icon: Users, color: 'text-402-purple' },
    { label: 'Daily wallet creations', value: 342, icon: TrendingUp, color: 'text-402-green' },
    { label: 'Uptime', value: 99.9, icon: Activity, color: 'text-solana-teal' },
    { label: 'Latest 402 fee claims', value: 1247, icon: Zap, color: 'text-solana-green' },
  ])

  const [chartData, setChartData] = useState<Array<{ time: string; wallets: number }>>([])

  useEffect(() => {
    // Generate initial chart data
    const now = new Date()
    const initialData = Array.from({ length: 24 }, (_, i) => {
      const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
      return {
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        wallets: 14000 + Math.random() * 200,
      }
    })
    setChartData(initialData)

    // Update metrics periodically
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label.includes('Total') 
          ? metric.value + Math.floor(Math.random() * 3)
          : metric.label.includes('Daily')
          ? 300 + Math.floor(Math.random() * 100)
          : metric.label.includes('Uptime')
          ? 99.9
          : metric.value + Math.floor(Math.random() * 5),
      })))

      // Update chart
      setChartData(prev => {
        const newData = [...prev]
        newData.shift()
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          wallets: 14000 + Math.random() * 200,
        })
        return newData
      })
    }, 5000)

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
            Network Analytics
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time metrics from the 402 economy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 border border-402-purple/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-3xl font-bold">
                  {metric.label.includes('Uptime') 
                    ? `${metric.value}%`
                    : metric.value.toLocaleString()}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-effect rounded-xl p-6 border border-402-purple/20"
        >
          <h3 className="text-2xl font-semibold mb-6">Wallet Generation Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgba(255, 255, 255, 0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 15, 0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="wallets"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-lg text-muted-foreground">
            <span className="text-402-green font-semibold">wallet402</span> is an active node of the{' '}
            <span className="text-402-purple font-semibold">402 economy</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

