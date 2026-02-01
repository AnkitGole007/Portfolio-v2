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
  const position = index - activeIndex
  const isActive = position === 0
  const isLeft = position < 0

  const getTransform = () => {
    if (isActive) {
      return {
        x: 0,
        y: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10
      }
    }

    const absPosition = Math.abs(position)
    const xOffset = isLeft ? -320 : 320
    const rotateY = isLeft ? 35 : -35
    const scale = Math.max(0.75, 1 - absPosition * 0.12)
    const opacity = Math.max(0.5, 1 - absPosition * 0.25)
    const zIndex = totalCards - absPosition

    return {
      x: xOffset * Math.min(absPosition, 2),
      y: absPosition * 15,
      rotateY,
      scale,
      opacity,
      zIndex
    }
  }

  const transform = getTransform()

  return (
    <motion.div
      className="absolute w-[320px] h-[420px] cursor-pointer"
      style={{
        zIndex: transform.zIndex,
        transformStyle: 'preserve-3d'
      }}
      animate={{
        x: transform.x,
        y: transform.y,
        rotateY: transform.rotateY,
        scale: transform.scale,
        opacity: transform.opacity
      }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1]
      }}
      whileHover={isActive ? { scale: 1.02, y: -5 } : {}}
    >
      <div
        className={`w-full h-full rounded-3xl p-6 flex flex-col shadow-2xl ${project.gradient}`}
        style={{
          boxShadow: isActive
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="mt-auto pt-4">
          <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-white/85 text-sm leading-relaxed mb-4">
            {project.description}
          </p>

          {project.highlight && (
            <p className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {project.highlight}
            </p>
          )}

          {project.link && isActive && (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold hover:bg-white/30 transition-colors border border-white/20"
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
