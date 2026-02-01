import { useState, useEffect } from 'react'

interface UseRoleTypingProps {
  roles: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function useRoleTyping({
  roles,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000
}: UseRoleTypingProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentRole, setCurrentRole] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const role = roles[currentRole]

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText.length < role.length) {
        // Typing
        setDisplayText(role.slice(0, displayText.length + 1))
      } else if (!isDeleting && displayText.length === role.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration)
      } else if (isDeleting && displayText.length > 0) {
        // Deleting
        setDisplayText(displayText.slice(0, -1))
      } else if (isDeleting && displayText.length === 0) {
        // Move to next role
        setIsDeleting(false)
        setCurrentRole((prev) => (prev + 1) % roles.length)
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole, roles, typingSpeed, deletingSpeed, pauseDuration])

  return { displayText, currentRole }
}
