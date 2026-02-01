import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface Particle {
  id: number
  x: number
  initialY: number
  size: number
  speedFactor: number
  color: string
  blur: number
}

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [particles, setParticles] = useState<Particle[]>([])

  const { scrollYProgress } = useScroll()

  // Smooth spring animation for scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Generate particles on mount
    const colors = [
      'rgba(139, 92, 246, 0.4)',   // Purple
      'rgba(168, 85, 247, 0.35)',  // Violet
      'rgba(236, 72, 153, 0.3)',   // Pink
      'rgba(59, 130, 246, 0.35)',  // Blue
      'rgba(192, 132, 252, 0.3)',  // Light purple
    ]

    const generatedParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      initialY: Math.random() * 100,
      size: 150 + Math.random() * 250,
      speedFactor: 0.3 + Math.random() * 0.7, // Different parallax speeds
      color: colors[Math.floor(Math.random() * colors.length)],
      blur: 60 + Math.random() * 40
    }))

    setParticles(generatedParticles)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Base gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)'
        }}
      />

      {particles.map((particle) => (
        <ParallaxParticle
          key={particle.id}
          particle={particle}
          scrollProgress={smoothProgress}
        />
      ))}

      {/* Bottom gradient for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}
      />
    </div>
  )
}

function ParallaxParticle({
  particle,
  scrollProgress
}: {
  particle: Particle
  scrollProgress: ReturnType<typeof useSpring>
}) {
  // Each particle moves at different speed - some move more, some less
  // This creates the parallax depth effect
  const yMovement = useTransform(
    scrollProgress,
    [0, 1],
    [0, -600 * particle.speedFactor]
  )

  // Slight horizontal movement for organic feel
  const xMovement = useTransform(
    scrollProgress,
    [0, 1],
    [0, (particle.speedFactor - 0.5) * 100]
  )

  // Scale slightly as you scroll for depth
  const scale = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [1, 1 + particle.speedFactor * 0.1, 1]
  )

  // Opacity changes for atmospheric effect
  const opacity = useTransform(
    scrollProgress,
    [0, 0.3, 0.7, 1],
    [1, 0.8, 0.9, 0.7]
  )

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${particle.x}%`,
        top: `${particle.initialY}%`,
        width: particle.size,
        height: particle.size,
        background: `radial-gradient(circle at 30% 30%, ${particle.color}, transparent 70%)`,
        filter: `blur(${particle.blur}px)`,
        y: yMovement,
        x: xMovement,
        scale,
        opacity
      }}
    />
  )
}
