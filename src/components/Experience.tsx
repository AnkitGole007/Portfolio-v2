import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin } from 'lucide-react'

interface ExperienceItem {
  id: number
  title: string
  company: string
  companyUrl?: string
  location: string
  startDate: string
  endDate: string
  highlights: string[]
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    title: 'AI Researcher',
    company: 'Worcester Polytechnic Institute',
    location: 'Worcester, MA',
    startDate: 'Aug 2025',
    endDate: 'Present',
    color: 'blue',
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
    companyUrl: 'https://paypal.com',
    location: 'Worcester, MA',
    startDate: 'Aug 2025',
    endDate: 'Dec 2025',
    color: 'purple',
    highlights: [
      'Improved decision quality with 0.85 F1, 0.835 MCC, 0.743 KS by fine-tuning Phi-4-mini using LoRA adapters and CALM-style tabular-to-text prompts',
      'Delivered 20x training-data efficiency by matching ML benchmark performance using 1/5 training slices',
      'Validated semantic robustness with feature-order A/B tests, holding accuracy near 0.947 and F1 near 0.85 under shuffled attributes',
      'Implemented AES-GCM encrypted transfer workflow with restricted directories and one-time token handling'
    ]
  },
  {
    id: 3,
    title: 'AI Intern (AI Agent Builder)',
    company: 'NeuralSeek',
    companyUrl: 'https://neuralseek.com',
    location: 'Remote',
    startDate: 'Aug 2025',
    endDate: 'Sep 2025',
    color: 'green',
    highlights: [
      'Built scalable natural language AI agents using NeuralSeek\'s no-code generative AI platform',
      'Completed advanced certifications in AI agent architectures',
      'Designed and deployed original AI agents for enterprise applications',
      'Conducted competitive analyses of AI platforms and collaborated with team to solve real-world problems'
    ]
  },
  {
    id: 4,
    title: 'Graduate Assistant - FIN 530 Cryptocurrencies',
    company: 'Worcester Polytechnic Institute',
    location: 'Worcester, MA',
    startDate: 'Apr 2025',
    endDate: 'Dec 2025',
    color: 'orange',
    highlights: [
      'Assisted with labs on regulated stablecoins and CBDCs using Hyperledger Fabric, Docker, Python, and GitHub',
      'Mentored student teams on token architectures and compliance processes',
      'Graded quizzes, midterms, and project reports on stablecoins, tokenization, and quantum-safe payments',
      'Supported teams with smart contract logic, system design, documentation, and presentation skills'
    ]
  },
  {
    id: 5,
    title: 'Graduate Assistant - FIN 540 Financial Analytics',
    company: 'Worcester Polytechnic Institute',
    location: 'Worcester, MA',
    startDate: 'Jan 2025',
    endDate: 'Mar 2025',
    color: 'pink',
    highlights: [
      'Reviewed homework and projects on portfolio theory, risk and return, forecasting using Python and Excel',
      'Debugged student code and spreadsheets, demonstrating how changes affect risk metrics and investment decisions',
      'Contributed to refining grading rubrics and feedback templates by analyzing frequent errors'
    ]
  },
  {
    id: 6,
    title: 'System Engineer',
    company: 'Atos IT Solutions',
    companyUrl: 'https://atos.net',
    location: 'Pune, India',
    startDate: 'Aug 2023',
    endDate: 'Jul 2024',
    color: 'blue',
    highlights: [
      'Managed enterprise IT infrastructure and digital workplace solutions',
      'Implemented automation workflows to streamline IT operations',
      'Collaborated with cross-functional teams on system integration projects',
      'Provided technical support and troubleshooting for complex system issues'
    ]
  },
  {
    id: 7,
    title: 'Associate Engineer',
    company: 'Atos IT Solutions',
    companyUrl: 'https://atos.net',
    location: 'Pune, India',
    startDate: 'Nov 2022',
    endDate: 'Aug 2023',
    color: 'purple',
    highlights: [
      'Developed and maintained IT solutions for enterprise clients',
      'Participated in digital workplace transformation initiatives',
      'Assisted in deploying and configuring enterprise software systems'
    ]
  },
  {
    id: 8,
    title: 'Digital Workplace Trainee',
    company: 'Atos IT Solutions',
    companyUrl: 'https://atos.net',
    location: 'Pune, India',
    startDate: 'Jul 2022',
    endDate: 'Dec 2022',
    color: 'green',
    highlights: [
      'Completed comprehensive training in digital workplace technologies',
      'Gained hands-on experience with enterprise IT systems and processes',
      'Collaborated with senior engineers on client projects'
    ]
  },
  {
    id: 9,
    title: 'Web Developer Intern',
    company: 'Larsen & Toubro Defence',
    companyUrl: 'https://www.larsentoubro.com',
    location: 'Pune, India',
    startDate: 'Aug 2020',
    endDate: 'Nov 2020',
    color: 'orange',
    highlights: [
      'Worked as a web development intern to add elements to the company portal',
      'Made updates in Company Portal and optimized element functionality',
      'Worked on Defence Newsletter website as UI/UX developer'
    ]
  }
]

const colorStyles = {
  blue: {
    border: 'border-l-blue-500',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    dot: 'bg-blue-500'
  },
  purple: {
    border: 'border-l-purple-500',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    dot: 'bg-purple-500'
  },
  green: {
    border: 'border-l-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    dot: 'bg-emerald-500'
  },
  orange: {
    border: 'border-l-orange-500',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    dot: 'bg-orange-500'
  },
  pink: {
    border: 'border-l-pink-500',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    dot: 'bg-pink-500'
  }
}

export function Experience() {
  return (
    <section id="experience" className="py-24 px-4 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Experience
          </h2>
          <p className="text-muted-foreground">
            What I've done
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          {/* Experience Cards */}
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <ExperienceCard experience={exp} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience }: { experience: ExperienceItem }) {
  const styles = colorStyles[experience.color]

  return (
    <div
      className={`relative bg-card/50 backdrop-blur-sm rounded-xl border border-border ${styles.border} border-l-4 p-6 hover:bg-card/70 transition-colors`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className={`w-4 h-4 ${styles.text}`} />
            <h3 className="font-display font-semibold text-lg text-foreground">
              {experience.title}
            </h3>
          </div>
          {experience.companyUrl ? (
            <a
              href={experience.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.text} hover:underline text-sm font-medium`}
            >
              {experience.company}
            </a>
          ) : (
            <span className={`${styles.text} text-sm font-medium`}>
              {experience.company}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{experience.startDate} — {experience.endDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{experience.location}</span>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <ul className="space-y-2">
        {experience.highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
            <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mt-2 flex-shrink-0`} />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
