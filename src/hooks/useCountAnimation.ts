import { useState, useEffect, useCallback } from 'react'
import { easeOutExpo } from '@/lib/utils'

interface UseCountAnimationProps {
  end: number
  duration?: number
  isActive?: boolean
}

export function useCountAnimation({
  end,
  duration = 2000,
  isActive = true
}: UseCountAnimationProps) {
  const [count, setCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const reset = useCallback(() => {
    setCount(0)
    setIsComplete(false)
  }, [])

  useEffect(() => {
    if (!isActive) {
      reset()
      return
    }

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easedProgress = easeOutExpo(progress)
      const currentCount = Math.round(easedProgress * end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsComplete(true)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isActive, reset])

  return { count, isComplete, reset }
}
