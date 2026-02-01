import { useState, useEffect, useCallback } from 'react'

interface UseTypingAnimationProps {
  text: string
  typingSpeed?: number
  isActive?: boolean
  onComplete?: () => void
}

export function useTypingAnimation({
  text,
  typingSpeed = 50,
  isActive = true,
  onComplete
}: UseTypingAnimationProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const reset = useCallback(() => {
    setDisplayText('')
    setIsComplete(false)
  }, [])

  useEffect(() => {
    if (!isActive) {
      reset()
      return
    }

    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, typingSpeed + Math.random() * 30) // Add slight randomness for natural feel

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      onComplete?.()
    }
  }, [displayText, text, typingSpeed, isActive, isComplete, onComplete, reset])

  return { displayText, isComplete, reset }
}
