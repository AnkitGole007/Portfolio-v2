'use client';

import SectionLayout from '@/components/SectionLayout';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Github,
  Linkedin,
  Sparkles,
  Languages
} from 'lucide-react';

const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio-v2' : '';

const personalInfo = [
  { icon: <MapPin size={16} />, label: 'Location', value: 'Worcester, MA' },
  { icon: <Mail size={16} />, label: 'Email', value: 'ankit17.gole@gmail.com' },
  { icon: <Phone size={16} />, label: 'Phone', value: '+1 (774) 525-2916' },
];

const socialLinks = [
  { icon: <Github size={20} />, label: 'GitHub', href: 'https://github.com/AnkitGole007' },
  { icon: <Linkedin size={20} />, label: 'LinkedIn', href: 'https://linkedin.com/in/ankit-gole' },
];

const languages = [
  { name: 'English', level: 'Full Professional', color: '#0a84ff' },
  { name: 'Hindi', level: 'Full Professional', color: '#5e5ce6' },
  { name: 'Marathi', level: 'Full Professional', color: '#bf5af2' },
];

const expertise = [
  {
    title: 'LLM Fine-tuning',
    description: 'LoRA/QLoRA adapters, PEFT methods, and threshold calibration for domain-specific tasks',
    gradient: 'from-[#0a84ff] to-[#5e5ce6]',
  },
  {
    title: 'RAG Systems',
    description: 'Vector databases, hybrid search, re-ranking, and grounding with evaluation harnesses',
    gradient: 'from-[#5e5ce6] to-[#bf5af2]',
  },
  {
    title: 'Agentic AI',
    description: 'Multi-agent orchestration with LangChain, tool use, and controllable autonomous systems',
    gradient: 'from-[#bf5af2] to-[#ff375f]',
  },
  {
    title: 'Generative Models',
    description: 'Diffusion models, GANs, and image generation with production optimization',
    gradient: 'from-[#ff375f] to-[#ff9500]',
  },
];

export default function AboutPage() {
  return (
    <SectionLayout title="About Me" subtitle="The human behind the algorithms">
      <div className="space-y-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-futuristic p-8 md:p-10"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative flex-shrink-0"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] rounded-3xl blur-2xl opacity-30 animate-pulse-glow" />
              <div className="relative w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/10">
                <Image
                  src={`${basePath}/profile.jpeg`}
                  alt="Ankit Gole"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Ankit Gole</h2>
              <p className="text-lg font-medium gradient-text-accent mb-4">
                Agentic AI Engineer & Researcher
              </p>
              <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
                Specializing in LLM fine-tuning, retrieval systems, and evaluation for
                commerce signals and user behavior modeling. I build reproducible AI
                prototypes on Azure and HPC infrastructure with calibrated metrics,
                audit-ready artifacts, and deployment-focused testing.
              </p>

              {/* Personal Info */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                {personalInfo.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
                  >
                    <span className="text-[#0a84ff]">{item.icon}</span>
                    <span className="text-white/70">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-3 justify-center lg:justify-start">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl glass neon-border
                             text-white/70 hover:text-white transition-colors"
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-futuristic p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#0a84ff]/20 to-[#5e5ce6]/20">
              <GraduationCap size={24} className="text-[#0a84ff]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Education</h3>
              <p className="text-white/40 text-sm">Academic Background</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-medium text-white">
                    Worcester Polytechnic Institute
                  </h4>
                  <p className="text-[#0a84ff]">Masters in Artificial Intelligence</p>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar size={14} />
                  <span>2024 - 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm mb-4">
                <span className="px-3 py-1 rounded-full bg-[#30d158]/20 text-[#30d158] font-medium">
                  GPA: 3.88/4.0
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['LLMs', 'Generative AI', 'Deep Learning', 'NLP', 'MLOps'].map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10
                             text-white/60 text-xs"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-medium text-white">
                    PES Modern College of Engineering
                  </h4>
                  <p className="text-[#5e5ce6]">Bachelor of Engineering - IT</p>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar size={14} />
                  <span>2018 - 2022</span>
                </div>
              </div>
              <p className="text-white/50 text-sm">
                Foundation in computer science, algorithms, and software development
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Languages size={18} className="text-[#0a84ff]" />
              <h4 className="text-white font-medium">Languages</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-white text-sm">{lang.name}</span>
                  <span className="text-white/40 text-xs">({lang.level})</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* What I Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Sparkles size={20} className="text-[#0a84ff]" />
            <h3 className="text-2xl font-semibold text-white">Core Expertise</h3>
            <Sparkles size={20} className="text-[#5e5ce6]" />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {expertise.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/5
                         hover:border-white/10 transition-all duration-300"
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${item.gradient} opacity-50`} />

                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#0a84ff] transition-colors">
                  {item.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionLayout>
  );
}
