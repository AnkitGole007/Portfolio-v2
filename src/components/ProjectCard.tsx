import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  highlight?: string
  gradient: string
  link?: string
}

interface ProjectCardProps {
  project: Project
  index: number
  activeIndex: number
  totalCards: number
}

export function ProjectCard({ project, index, activeIndex, totalCards }: ProjectCardProps) {
  // Calculate position relative to active card
  const position = index - activeIndex
  const isActive = position === 0
  const isLeft = position < 0

  // Calculate transforms for 3D effect
  const getTransform = () => {
    if (isActive) {
      return {
        x: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10
      }
    }

    const absPosition = Math.abs(position)
    const xOffset = isLeft ? -280 : 280
    const yOffset = absPosition * 20
    const rotateY = isLeft ? 25 : -25
    const scale = Math.max(0.7, 1 - absPosition * 0.15)
    const opacity = Math.max(0.4, 1 - absPosition * 0.3)
    const zIndex = totalCards - absPosition

    return {
      x: xOffset * Math.min(absPosition, 2),
      y: yOffset,
      z: -100 * absPosition,
      rotateY: rotateY,
      scale,
      opacity,
      zIndex
    }
  }

  const transform = getTransform()

  return (
    <motion.div
      className="absolute w-80 h-96 cursor-pointer"
      style={{
        zIndex: transform.zIndex,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      animate={{
        x: transform.x,
        y: transform.y,
        rotateY: transform.rotateY,
        scale: transform.scale,
        opacity: transform.opacity
      }}
      transition={{
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1]
      }}
      whileHover={isActive ? { scale: 1.05 } : {}}
    >
      <div
        className={`w-full h-full rounded-3xl p-6 flex flex-col justify-between shadow-2xl ${project.gradient}`}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="mt-auto">
          <h3 className="text-2xl font-display font-bold text-white mb-3">
            {project.title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {project.highlight && (
            <p className="text-white font-medium text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {project.highlight}
            </p>
          )}

          {project.link && isActive && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              View Project
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
