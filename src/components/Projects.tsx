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

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projects.length)
    }, 4000)

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
    if (index !== activeIndex) {
      setIsAutoPlaying(false)
      setActiveIndex(index)
    }
  }

  return (
    <section id="projects" className="py-32 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
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
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Navigation Buttons */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-0 md:left-4 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="absolute right-0 md:right-4 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Cards Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: '1200px' }}
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
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* Project Counter */}
        <div className="text-center mt-4 text-sm text-muted-foreground">
          {activeIndex + 1} / {projects.length}
        </div>
      </div>
    </section>
  )
}
