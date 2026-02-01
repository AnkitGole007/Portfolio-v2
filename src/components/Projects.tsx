import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProjectCard, type Project } from './ProjectCard'

const projects: Project[] = [
  {
    id: 1,
    title: 'PayPal Credit Risk LLM',
    description: 'Fine-tuned Phi-4-mini using LoRA adapters with CALM-style tabular-to-text prompts and threshold calibration on anonymized PayPal signals.',
    tags: ['LoRA', 'Phi-4', 'Azure ML'],
    highlight: '0.85 F1 | 0.835 MCC | 0.743 KS',
    gradient: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700'
  },
  {
    id: 2,
    title: 'Cascading Entity Matcher',
    description: '4-tier cascading matcher using lexical rules, SBERT + Logistic Regression, Llama 3.1 8B chain-of-thought prompting with calibrated thresholds.',
    tags: ['SBERT', 'Llama 3.1', 'Gradio'],
    highlight: '87.4% accuracy at 93% lower cost',
    gradient: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600',
    link: '#'
  },
  {
    id: 3,
    title: 'AI Agent Platform',
    description: 'Built scalable natural language AI agents using NeuralSeek\'s no-code generative AI platform for enterprise applications.',
    tags: ['NeuralSeek', 'LangChain', 'RAG'],
    highlight: 'Enterprise-grade AI solutions',
    gradient: 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500'
  }
]

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(1) // Start with middle card
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  const handleCardClick = (index: number) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }

  return (
    <section id="projects" className="py-24 px-4 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
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

        {/* 3D Carousel */}
        <div className="relative h-[450px] flex items-center justify-center">
          {/* Navigation Buttons */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Cards Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: '1000px' }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => handleCardClick(index)}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  activeIndex={activeIndex}
                  totalCards={projects.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setActiveIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-8 bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
