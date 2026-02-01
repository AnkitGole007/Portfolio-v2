import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface Particle {
  id: number
  x: number
  initialY: number
  size: number
  speedFactor: number
  color: string
  opacity: number
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
    // Generate particles on mount - more visible, less blurred
    const colors = [
      'rgba(139, 92, 246, 1)',    // Purple - solid
      'rgba(168, 85, 247, 1)',    // Violet - solid
      'rgba(236, 72, 153, 1)',    // Pink - solid
      'rgba(59, 130, 246, 1)',    // Blue - solid
      'rgba(192, 132, 252, 1)',   // Light purple - solid
    ]

    const generatedParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      initialY: Math.random() * 100,
      size: 80 + Math.random() * 150, // Smaller, more defined particles
      speedFactor: 0.3 + Math.random() * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.15 + Math.random() * 0.25 // Variable opacity
    }))

    setParticles(generatedParticles)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Subtle gradient at top */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 60%)'
        }}
      />

      {particles.map((particle) => (
        <ParallaxParticle
          key={particle.id}
          particle={particle}
          scrollProgress={smoothProgress}
        />
      ))}

      {/* Subtle gradient at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)'
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
  // Each particle moves at different speed
  const yMovement = useTransform(
    scrollProgress,
    [0, 1],
    [0, -500 * particle.speedFactor]
  )

  // Slight horizontal movement for organic feel
  const xMovement = useTransform(
    scrollProgress,
    [0, 1],
    [0, (particle.speedFactor - 0.5) * 80]
  )

  // Scale slightly as you scroll for depth
  const scale = useTransform(
    scrollProgress,
    [0, 0.5, 1],
    [1, 1 + particle.speedFactor * 0.15, 1]
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
        opacity: particle.opacity,
        filter: 'blur(40px)', // Less blur for more visibility
        y: yMovement,
        x: xMovement,
        scale
      }}
    />
  )
}
