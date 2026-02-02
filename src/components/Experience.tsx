import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ExperienceItem {
  id: number
  title: string
  company: string
  period: string
  highlights: string[]
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    title: 'AI Researcher',
    company: 'Worcester Polytechnic Institute',
    period: 'Aug 2025 - Present',
    highlights: [
      'Built 4-tier cascading matcher achieving 87.4% accuracy at 93% lower cost',
      'Delivered Gradio dashboard reducing deployment time by 6x'
    ]
  },
  {
    id: 2,
    title: 'Applied LLM Researcher',
    company: 'PayPal',
    period: 'Aug 2025 - Dec 2025',
    highlights: [
      'Fine-tuned Phi-4-mini achieving 0.85 F1, 0.835 MCC, 0.743 KS',
      'Delivered 20x training-data efficiency matching ML benchmark performance'
    ]
  },
  {
    id: 3,
    title: 'AI Intern (Agent Builder)',
    company: 'NeuralSeek',
    period: 'Aug 2025 - Sep 2025',
    highlights: [
      'Built scalable AI agents using no-code generative AI platform',
      'Completed advanced certifications in AI agent architectures'
    ]
  },
  {
    id: 4,
    title: 'Graduate Assistant - Cryptocurrencies',
    company: 'Worcester Polytechnic Institute',
    period: 'Apr 2025 - Dec 2025',
    highlights: [
      'Assisted labs on CBDCs using Hyperledger Fabric & Docker',
      'Mentored teams on token architectures and compliance'
    ]
  },
  {
    id: 5,
    title: 'Graduate Assistant - Financial Analytics',
    company: 'Worcester Polytechnic Institute',
    period: 'Jan 2025 - Mar 2025',
    highlights: [
      'Reviewed projects on portfolio theory and risk forecasting',
      'Debugged code demonstrating risk metrics impact'
    ]
  },
  {
    id: 6,
    title: 'System Engineer',
    company: 'Atos IT Solutions',
    period: 'Aug 2023 - Jul 2024',
    highlights: [
      'Managed enterprise IT infrastructure and digital workplace',
      'Implemented automation workflows for IT operations'
    ]
  },
  {
    id: 7,
    title: 'Associate Engineer',
    company: 'Atos IT Solutions',
    period: 'Nov 2022 - Aug 2023',
    highlights: [
      'Developed IT solutions for enterprise clients',
      'Participated in digital workplace transformation'
    ]
  },
  {
    id: 8,
    title: 'Digital Workplace Trainee',
    company: 'Atos IT Solutions',
    period: 'Jul 2022 - Dec 2022',
    highlights: [
      'Completed training in digital workplace technologies',
      'Collaborated with senior engineers on client projects'
    ]
  },
  {
    id: 9,
    title: 'Web Developer Intern',
    company: 'Larsen & Toubro Defence',
    period: 'Aug 2020 - Nov 2020',
    highlights: [
      'Developed and optimized company portal elements',
      'Built Defence Newsletter website as UI/UX developer'
    ]
  }
]

export function Experience() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % experiences.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % experiences.length)
  }

  // Get visible cards (current + next 2)
  const getVisibleCards = () => {
    const cards = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % experiences.length
      cards.push({ ...experiences[index], position: i })
    }
    return cards
  }

  return (
    <section id="experience" className="py-12 px-4 bg-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-center">
          {/* Left Side - Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Large Quote Mark */}
            <div className="text-[120px] leading-none text-primary/20 font-serif absolute -top-8 -left-4">
              "
            </div>

            <div className="relative z-10 pl-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                Experience
              </h2>
              <p className="text-xl text-muted-foreground">
                What I've Done
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3 mt-8 pl-4">
              <motion.button
                onClick={handlePrev}
                className="p-3 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous experience"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="p-3 rounded-full bg-card border border-border hover:bg-primary/10 hover:border-primary transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next experience"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Sliding Cards */}
          <div
            ref={containerRef}
            className="relative h-[280px] overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center">
              <AnimatePresence mode="popLayout">
                {getVisibleCards().map((exp, idx) => (
                  <motion.div
                    key={`${exp.id}-${currentIndex}`}
                    className="absolute"
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{
                      x: `${idx * 340}px`,
                      opacity: idx === 0 ? 1 : idx === 1 ? 0.8 : 0.5,
                      scale: idx === 0 ? 1 : idx === 1 ? 0.95 : 0.9
                    }}
                    exit={{ x: '-100%', opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 20
                    }}
                    style={{ width: '320px' }}
                  >
                    <ExperienceCard experience={exp} isActive={idx === 0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Fade gradient on right */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false)
                setCurrentIndex(index)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to experience ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience, isActive }: { experience: ExperienceItem; isActive: boolean }) {
  return (
    <div
      className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border transition-all h-[240px] flex flex-col ${
        isActive ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg text-foreground leading-tight mb-1">
          {experience.title}
        </h3>
        <p className="text-primary text-sm font-medium">
          {experience.company}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {experience.period}
        </p>
      </div>

      {/* Highlights */}
      <ul className="space-y-2 flex-1">
        {experience.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <span className="line-clamp-2">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
