'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import TypingEffect from './TypingEffect';
import StatusBadge from './StatusBadge';

const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio-v2' : '';

const roles = [
  'Agentic AI Engineer',
  'LLM Researcher',
  'ML Engineer',
  'RAG Systems Builder',
  'Full-Stack AI Developer',
];

export default function ProfileHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center z-10 relative"
    >
      {/* Profile Image */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative inline-block mb-8"
      >
        {/* Animated rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-4 rounded-full border border-[#0a84ff]/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-6 rounded-full border border-[#5e5ce6]/20"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-8 rounded-full border border-[#bf5af2]/10"
        />

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] rounded-full blur-2xl opacity-40 animate-pulse-glow" />

        {/* Image container */}
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/20">
          <Image
            src={`${basePath}/profile.jpeg`}
            alt="Ankit Gole"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
      >
        <span className="gradient-text-animated">Ankit Gole</span>
      </motion.h1>

      {/* Typing Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="h-8 md:h-10 mb-4"
      >
        <TypingEffect
          texts={roles}
          className="text-xl md:text-2xl text-[#0a84ff] font-medium"
          typingSpeed={80}
          deletingSpeed={40}
          pauseTime={2500}
        />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white/50 text-sm md:text-base mb-2"
      >
        Masters in Artificial Intelligence @ WPI
      </motion.p>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-white/30 text-sm max-w-md mx-auto mb-4"
      >
        Building intelligent systems with LLMs, RAG, and Diffusion Models
      </motion.p>

      {/* Status Badge */}
      <StatusBadge status="available" />

      {/* Command palette hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex items-center justify-center gap-2 text-white/20 text-xs"
      >
        <span>Press</span>
        <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">⌘K</kbd>
        <span>to navigate</span>
      </motion.div>
    </motion.div>
  );
}
