'use client'

import { useEffect, useRef } from 'react'

export default function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: Array<{ x: number; y: number; vx: number; vy: number; pulse: number }> = []
    const nodeCount = 30

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        const glow = Math.sin(node.pulse) * 0.5 + 0.5
        const size = 3 + glow * 2

        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 
          ? `rgba(139, 92, 246, ${0.3 + glow * 0.4})` 
          : `rgba(16, 185, 129, ${0.3 + glow * 0.4})`
        ctx.fill()

        nodes.slice(i + 1).forEach(other => {
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - dist / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-20"
    />
  )
}

