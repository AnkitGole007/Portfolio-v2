import { motion } from 'framer-motion'
import { Github, Linkedin, ArrowDown } from 'lucide-react'
import { useRoleTyping } from '@/hooks'

const roles = [
  'Agentic AI Engineer',
  'LLM Fine-Tuning Specialist',
  'ML Engineer',
  'Applied LLM Researcher'
]

export function Hero() {
  const { displayText } = useRoleTyping({ roles })

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Floating background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/10 blur-xl"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-1/3 w-4 h-4 rounded-full bg-primary/40"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-primary/5 blur-lg"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-32 right-1/3 w-16 h-16 rounded-full bg-primary/10 blur-md"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Hi, I'm <span className="gradient-text">Ankit Gole</span>
            </motion.h1>

            <motion.div
              className="text-lg md:text-xl text-muted-foreground mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span>I am an</span>
              <span className="text-primary font-medium">{displayText}</span>
              <span className="typing-cursor text-primary">|</span>
            </motion.div>

            <motion.p
              className="text-muted-foreground max-w-xl mb-8 text-base leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              I design, build, and deploy intelligent AI systems that bridge research and real-world application. From self-healing LLM pipelines to complete workflow automation, I create scalable solutions that solve operational problems.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.a>

              <motion.a
                href="https://github.com/AnkitGole007"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary/80 border border-border text-foreground font-medium hover:bg-secondary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
                GitHub
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/ankit-gole"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-foreground font-medium hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right - Profile Photo */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full border-2 border-primary/30"
                style={{ margin: '-20px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner decorative ring */}
              <motion.div
                className="absolute inset-0 w-[300px] h-[300px] md:w-[360px] md:h-[360px] rounded-full border border-primary/20"
                style={{ margin: '-10px' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />

              {/* Small decorative dots on ring */}
              <motion.div
                className="absolute top-0 right-1/4 w-2 h-2 rounded-full bg-primary/60"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/4 right-0 w-3 h-3 rounded-full border border-primary/40"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Profile image container */}
              <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl shadow-primary/20">
                <img
                  src={`${import.meta.env.BASE_URL}profile.jpeg`}
                  alt="Ankit Gole"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>

              {/* Initials badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg md:text-xl shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                AG
              </motion.div>
            </div>
          </motion.div>
        </div>
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
