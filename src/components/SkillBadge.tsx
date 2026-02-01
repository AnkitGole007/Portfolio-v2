import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTypingAnimation, useCountAnimation, useIntersectionObserver } from '@/hooks'

interface SkillBadgeProps {
  name: string
  proficiency: number
  delay?: number
  color?: 'purple' | 'orange' | 'blue'
}

const colorMap = {
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-400 to-red-500',
  blue: 'from-blue-500 to-cyan-400'
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
    // Reset and replay animation
    resetTyping()
    resetCount()
    setIsAnimating(true)
    setAnimationKey(prev => prev + 1)
    setTimeout(() => setIsAnimating(false), 100)
  }, [resetTyping, resetCount])

  return (
    <motion.div
      ref={ref}
      key={animationKey}
      onClick={handleClick}
      className="skill-badge cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r ${colorMap[color]} text-white font-medium text-sm shadow-lg`}>
        <span className="min-w-0">
          {displayText}
          {!typingComplete && <span className="typing-cursor">|</span>}
        </span>
        <span className="flex-shrink-0 bg-white/20 px-2 py-0.5 rounded text-xs font-bold">
          {count}%
        </span>
      </div>
    </motion.div>
  )
}
