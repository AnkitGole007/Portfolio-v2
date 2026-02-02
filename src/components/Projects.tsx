import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  highlight?: string
  gradient: string
  link?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'PayPal Credit Risk LLM',
    description: 'Fine-tuned Phi-4-mini using LoRA adapters with CALM-style tabular-to-text prompts and threshold calibration on anonymized PayPal signals.',
    tags: ['LoRA', 'Phi-4', 'Azure ML'],
    highlight: '0.85 F1 | 0.835 MCC | 0.743 KS',
    gradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700'
  },
  {
    id: 2,
    title: 'Cascading Entity Matcher',
    description: '4-tier cascading matcher using lexical rules, SBERT + Logistic Regression, Llama 3.1 8B chain-of-thought prompting with calibrated thresholds.',
    tags: ['SBERT', 'Llama 3.1', 'Gradio'],
    highlight: '87.4% accuracy | 93% cost reduction',
    gradient: 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600',
    link: '#'
  },
  {
    id: 3,
    title: 'ML Benchmark Framework',
    description: 'Benchmarked Random Forest, SVM, and XGBoost across 10-seed stability tests on 692,922 record corpus with 216 attributes for production readiness.',
    tags: ['XGBoost', 'PySpark', 'MLflow'],
    highlight: '20x training-data efficiency',
    gradient: 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600'
  },
  {
    id: 4,
    title: 'Real-time Audit Dashboard',
    description: 'Gradio dashboard with real-time budget tracking, explainable routing, audit-ready JSON export, and prioritized human review queue.',
    tags: ['Gradio', 'FastAPI', 'Python'],
    highlight: '6x faster deployment',
    gradient: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500'
  },
  {
    id: 5,
    title: 'AI Agent Platform',
    description: 'Built scalable natural language AI agents using NeuralSeek\'s no-code generative AI platform for enterprise applications.',
    tags: ['NeuralSeek', 'LangChain', 'RAG'],
    highlight: 'Enterprise-grade AI solutions',
    gradient: 'bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600'
  },
  {
    id: 6,
    title: 'Secure Data Pipeline',
    description: 'AES-GCM encrypted transfer workflow with restricted directories, one-time token handling, and schema validation for confidential data.',
    tags: ['AES-GCM', 'PySpark', 'Docker'],
    highlight: '20% data quality improvement',
    gradient: 'bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500'
  }
]

// Calculate card positions for 3-card prominent display
function calculateCardTransform(index: number, activeIndex: number, totalItems: number) {
  const diff = index - activeIndex
  const normalizedDiff = ((diff % totalItems) + totalItems) % totalItems
  const adjustedDiff = normalizedDiff > totalItems / 2 ? normalizedDiff - totalItems : normalizedDiff

  // Position: -1 = left, 0 = center, 1 = right, others = back
  const position = adjustedDiff

  let x = 0
  let z = 0
  let rotateY = 0
  let scale = 0.6
  let opacity = 0.3
  let zIndex = 0

  if (position === 0) {
    // Center card - front and prominent
    x = 0
    z = 0
    rotateY = 0
    scale = 1
    opacity = 1
    zIndex = 100
  } else if (position === -1) {
    // Left card - visible and angled
    x = -320
    z = -100
    rotateY = 35
    scale = 0.85
    opacity = 1
    zIndex = 80
  } else if (position === 1) {
    // Right card - visible and angled
    x = 320
    z = -100
    rotateY = -35
    scale = 0.85
    opacity = 1
    zIndex = 80
  } else if (position === -2) {
    // Far left - partially visible
    x = -500
    z = -250
    rotateY = 50
    scale = 0.65
    opacity = 0.5
    zIndex = 40
  } else if (position === 2) {
    // Far right - partially visible
    x = 500
    z = -250
    rotateY = -50
    scale = 0.65
    opacity = 0.5
    zIndex = 40
  } else {
    // Back cards - hidden behind
    x = position < 0 ? -400 : 400
    z = -400
    rotateY = position < 0 ? 60 : -60
    scale = 0.5
    opacity = 0
    zIndex = 0
  }

  return { x, z, rotateY, scale, opacity, zIndex }
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const totalItems = projects.length

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalItems])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % totalItems)
  }

  // Memoize card transforms to prevent unnecessary recalculations
  const cardTransforms = useMemo(() => {
    return projects.map((_, index) => calculateCardTransform(index, activeIndex, totalItems))
  }, [activeIndex, totalItems])

  return (
    <section id="projects" className="py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Featured Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Production-ready AI systems with measurable impact
          </p>
        </motion.div>

        {/* 3D Carousel Container */}
        <div
          className="relative h-[520px] flex items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {projects.map((project, index) => {
              const transform = cardTransforms[index]
              const isActive = index === activeIndex
              const isVisible = transform.opacity > 0

              if (!isVisible) return null

              return (
                <motion.div
                  key={project.id}
                  className="absolute cursor-pointer"
                  initial={false}
                  animate={{
                    x: transform.x,
                    z: transform.z,
                    rotateY: transform.rotateY,
                    scale: transform.scale,
                    opacity: transform.opacity
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 20,
                    mass: 0.8
                  }}
                  style={{
                    zIndex: transform.zIndex,
                    transformStyle: 'preserve-3d',
                    width: '300px',
                    height: '400px'
                  }}
                  onClick={() => {
                    if (!isActive) {
                      setIsAutoPlaying(false)
                      setActiveIndex(index)
                    }
                  }}
                  whileHover={isActive ? { scale: 1.05 } : { scale: transform.scale * 1.02 }}
                >
                  <div
                    className={`w-full h-full rounded-3xl p-5 flex flex-col ${project.gradient}`}
                    style={{
                      boxShadow: isActive
                        ? '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)'
                        : '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
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
                      <h3 className="text-lg font-display font-bold text-white mb-2 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-3">
                        {project.description}
                      </p>

                      {project.highlight && (
                        <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          {project.highlight}
                        </p>
                      )}

                      {project.link && isActive && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold hover:bg-white/30 transition-colors border border-white/20"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            onClick={handlePrev}
            className="p-4 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="p-4 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </motion.button>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setActiveIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
