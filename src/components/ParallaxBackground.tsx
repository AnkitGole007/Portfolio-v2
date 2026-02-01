import { useEffect, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedFactor: number
  opacity: number
  color: 'purple' | 'pink' | 'blue'
}

const colorMap = {
  purple: 'rgba(124, 58, 237, 0.15)',
  pink: 'rgba(236, 72, 153, 0.12)',
  blue: 'rgba(59, 130, 246, 0.1)'
}

const colorMapDark = {
  purple: 'rgba(139, 92, 246, 0.25)',
  pink: 'rgba(244, 114, 182, 0.2)',
  blue: 'rgba(96, 165, 250, 0.18)'
}

export function ParallaxBackground() {
  const [windowHeight, setWindowHeight] = useState(0)
  const { scrollY } = useScroll()

  useEffect(() => {
    setWindowHeight(window.innerHeight)
    const handleResize = () => setWindowHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 400, // Spread across more vertical space
      size: Math.random() * 150 + 80,
      speedFactor: 0.1 + Math.random() * 0.4, // Different parallax speeds
      opacity: 0.3 + Math.random() * 0.4,
      color: (['purple', 'pink', 'blue'] as const)[Math.floor(Math.random() * 3)]
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <ParallaxParticle
          key={particle.id}
          particle={particle}
          scrollY={scrollY}
          windowHeight={windowHeight}
        />
      ))}
    </div>
  )
}

function ParallaxParticle({
  particle,
  scrollY,
  windowHeight
}: {
  particle: Particle
  scrollY: ReturnType<typeof useScroll>['scrollY']
  windowHeight: number
}) {
  // Each particle moves at different speed based on speedFactor
  const y = useTransform(
    scrollY,
    [0, windowHeight * 5],
    [particle.y, particle.y - 800 * particle.speedFactor]
  )

  const x = useTransform(
    scrollY,
    [0, windowHeight * 5],
    [0, (particle.speedFactor - 0.25) * 100]
  )

  return (
    <motion.div
      className="absolute rounded-full blur-3xl"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: particle.size,
        height: particle.size,
        y,
        x,
        opacity: particle.opacity
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle, var(--particle-color) 0%, transparent 70%)`
        }}
      >
        <style>{`
          .dark & { --particle-color: ${colorMapDark[particle.color]}; }
          :not(.dark) & { --particle-color: ${colorMap[particle.color]}; }
        `}</style>
      </div>
      {/* Fallback using CSS class */}
      <div
        className={`absolute inset-0 rounded-full dark:bg-gradient-radial-${particle.color}`}
        style={{
          background: `radial-gradient(circle, ${colorMapDark[particle.color]} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  )
}
