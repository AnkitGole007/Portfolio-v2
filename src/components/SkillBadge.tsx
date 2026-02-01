import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTypingAnimation, useCountAnimation, useIntersectionObserver } from '@/hooks'

interface SkillBadgeProps {
  name: string
  proficiency: number
  delay?: number
  color?: 'purple' | 'orange' | 'blue'
}

const glassStyles = {
  purple: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(192, 132, 252, 0.15) 100%)',
    border: 'rgba(139, 92, 246, 0.4)',
    glow: 'rgba(139, 92, 246, 0.3)'
  },
  orange: {
    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.3) 0%, rgba(249, 115, 22, 0.2) 50%, rgba(234, 88, 12, 0.15) 100%)',
    border: 'rgba(251, 146, 60, 0.4)',
    glow: 'rgba(251, 146, 60, 0.3)'
  },
  blue: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(29, 78, 216, 0.15) 100%)',
    border: 'rgba(59, 130, 246, 0.4)',
    glow: 'rgba(59, 130, 246, 0.3)'
  }
}

export function SkillBadge({ name, proficiency, delay = 0, color = 'purple' }: SkillBadgeProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
    freezeOnceVisible: true
  })

  const [isAnimating, setIsAnimating] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const { displayText, isComplete: typingComplete, reset: resetTyping } = useTypingAnimation({
    text: name,
    typingSpeed: 60,
    isActive: isVisible || isAnimating
  })

  const { count, reset: resetCount } = useCountAnimation({
    end: proficiency,
    duration: 1500,
    isActive: (isVisible && typingComplete) || isAnimating
  })

  const handleClick = useCallback(() => {
    resetTyping()
    resetCount()
    setIsAnimating(true)
    setAnimationKey(prev => prev + 1)
    setTimeout(() => setIsAnimating(false), 100)
  }, [resetTyping, resetCount])

  const styles = glassStyles[color]

  return (
    <motion.div
      ref={ref}
      key={animationKey}
      onClick={handleClick}
      className="skill-badge cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl backdrop-blur-md border text-white font-medium text-sm shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        style={{
          background: styles.background,
          borderColor: styles.border,
          boxShadow: `0 4px 20px ${styles.glow}, inset 0 1px 1px rgba(255,255,255,0.1)`
        }}
      >
        {/* Glass shine effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, transparent 100%)'
          }}
        />

        <span className="relative flex-1 text-left whitespace-nowrap">
          {displayText}
          {!typingComplete && <span className="typing-cursor">|</span>}
        </span>
        <span
          className="relative flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-bold backdrop-blur-sm"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {count}%
        </span>
      </div>
    </motion.div>
  )
}
