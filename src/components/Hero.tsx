import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react'
import { useRoleTyping } from '@/hooks'

const roles = [
  'Agentic AI Engineer',
  'LLM Fine-Tuning Specialist',
  'ML Engineer',
  'Applied LLM Researcher'
]

const socialLinks = [
  { icon: Github, href: 'https://github.com/AnkitGole007', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/ankit-gole', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:ankit17.gole@gmail.com', label: 'Email' }
]

export function Hero() {
  const { displayText } = useRoleTyping({ roles })

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-primary font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold mb-6 glow-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">Ankit Gole</span>
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-muted-foreground mb-8 h-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span>{displayText}</span>
            <span className="typing-cursor text-primary">|</span>
          </motion.div>

          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto mb-4 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Specializing in LLM fine-tuning, retrieval systems, and evaluation for commerce signals and user behavior modeling.
          </motion.p>

          <motion.p
            className="text-primary/80 max-w-2xl mx-auto mb-10 text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            MS in Artificial Intelligence @ WPI (GPA: 3.88) | Applied LLM Researcher @ PayPal GQP
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-secondary/80 backdrop-blur-sm border border-border hover:bg-primary/20 hover:border-primary transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-foreground" />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.a
            href="#skills"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Explore My Skills
            <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  )
}
