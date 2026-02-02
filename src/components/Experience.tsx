import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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
      'Achieved 87.4% matching accuracy at 93% lower review cost by building a 4-tier cascading matcher using lexical rules, SBERT + Logistic Regression, Llama 3.1 8B chain-of-thought prompting',
      'Improved F1-per-cost by 11.9x by routing 65% high-confidence pairs to low-cost matching with Platt scaling and temperature scaling for confidence calibration',
      'Improved upstream data quality by 20% by enforcing schema checks, null scans, normalization UDFs, and blocking rules',
      'Reduced deployment time 6x by delivering a Gradio dashboard with real-time budget tracking and audit-ready JSON export'
    ]
  },
  {
    id: 2,
    title: 'Applied LLM Researcher',
    company: 'PayPal',
    period: 'Aug 2025 - Dec 2025',
    highlights: [
      'Improved decision quality with 0.85 F1, 0.835 MCC, 0.743 KS by fine-tuning Phi-4-mini using LoRA adapters and CALM-style tabular-to-text prompts',
      'Delivered 20x training-data efficiency by matching ML benchmark performance using 1/5 training slices',
      'Validated semantic robustness with feature-order A/B tests, holding accuracy near 0.947 and F1 near 0.85 under shuffled attributes',
      'Implemented AES-GCM encrypted transfer workflow with restricted directories and one-time token handling'
    ]
  },
  {
    id: 3,
    title: 'AI Intern (Agent Builder)',
    company: 'NeuralSeek',
    period: 'Aug 2025 - Sep 2025',
    highlights: [
      'Built scalable natural language AI agents using NeuralSeek\'s no-code generative AI platform',
      'Completed advanced certifications in AI agent architectures',
      'Designed and deployed original AI agents for enterprise applications',
      'Conducted competitive analyses of AI platforms and collaborated with team to solve real-world problems'
    ]
  },
  {
    id: 4,
    title: 'Graduate Assistant - Financial Analytics',
    company: 'Worcester Polytechnic Institute',
    period: 'Jan 2025 - Mar 2025',
    highlights: [
      'Reviewed homework and projects on portfolio theory, risk and return, forecasting using Python and Excel',
      'Debugged student code and spreadsheets, demonstrating how changes affect risk metrics and investment decisions',
      'Contributed to refining grading rubrics and feedback templates by analyzing frequent errors'
    ]
  },
  {
    id: 5,
    title: 'Graduate Assistant - Cryptocurrencies',
    company: 'Worcester Polytechnic Institute',
    period: 'Apr 2025 - Dec 2025',
    highlights: [
      'Assisted with labs on regulated stablecoins and CBDCs using Hyperledger Fabric, Docker, Python, and GitHub',
      'Mentored student teams on token architectures and compliance processes',
      'Graded quizzes, midterms, and project reports on stablecoins, tokenization, and quantum-safe payments',
      'Supported teams with smart contract logic, system design, documentation, and presentation skills'
    ]
  },
  {
    id: 6,
    title: 'Systems Engineer',
    company: 'Atos IT Solutions',
    period: 'Jul 2022 - Jul 2024',
    highlights: [
      'Managed enterprise IT infrastructure and digital workplace solutions for global clients',
      'Implemented automation workflows to streamline IT operations and reduce manual intervention',
      'Collaborated with cross-functional teams on system integration projects',
      'Provided technical support and troubleshooting for complex system issues'
    ]
  },
  {
    id: 7,
    title: 'Web Developer Intern',
    company: 'Larsen & Toubro Defence',
    period: 'Aug 2020 - Nov 2020',
    highlights: [
      'Worked as a web development intern to add elements to the company portal',
      'Made updates in Company Portal and optimized element functionality',
      'Worked on Defence Newsletter website as UI/UX developer'
    ]
  }
]

export function Experience() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)
  const totalItems = experiences.length

  // Auto-scroll
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, totalItems])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % totalItems)
  }

  return (
    <section id="experience" className="py-12 px-4 bg-secondary/20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Same style as other sections */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Career Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Experience
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building AI systems and solutions across research and industry
          </p>
        </motion.div>

        {/* Smooth Slider Carousel */}
        <div className="relative">
          {/* Cards Container */}
          <div className="overflow-hidden" ref={sliderRef}>
            <motion.div
              className="flex gap-6"
              animate={{
                x: `-${currentIndex * (400 + 24)}px`
              }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 20,
                mass: 1
              }}
            >
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  className="flex-shrink-0"
                  style={{ width: '400px' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ExperienceCard
                    experience={exp}
                    isActive={index === currentIndex}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Fade gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <motion.button
            onClick={handlePrev}
            className="p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous experience"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {experiences.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to experience ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            className="p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-secondary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next experience"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </motion.button>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience, isActive }: { experience: ExperienceItem; isActive: boolean }) {
  return (
    <div
      className={`bg-card/80 backdrop-blur-sm rounded-2xl p-6 border transition-all h-full min-h-[320px] ${
        isActive ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'
      }`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display font-semibold text-xl text-foreground leading-tight mb-1">
          {experience.title}
        </h3>
        <p className="text-primary text-sm font-medium">
          {experience.company}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {experience.period}
        </p>
      </div>

      {/* Highlights - Full text, no truncation */}
      <ul className="space-y-3">
        {experience.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
