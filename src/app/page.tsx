'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ExternalLink,
  Calendar,
  Building2,
  GraduationCap,
  Trophy,
  Award,
  Star,
  Zap,
  BadgeCheck,
  ArrowUpRight,
  Menu,
  X,
  MessageCircle,
  Send
} from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import GeminiChat from '@/components/GeminiChat';

const basePath = process.env.NODE_ENV === 'production' ? '/Portfolio-v2' : '';

// Navigation items
const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

// Typing animation hook
function useTypingAnimation(text: string, speed: number = 50, startDelay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
}

// Count animation hook
function useCountAnimation(end: number, duration: number = 2000, inView: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, inView]);

  return count;
}

// Section wrapper with viewport animation
function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`min-h-screen py-20 px-4 md:px-8 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
}

// Data
const roles = ['Agentic AI Engineer', 'LLM Researcher', 'ML Engineer', 'RAG Systems Builder'];

const experiences = [
  {
    company: 'PayPal',
    role: 'Applied LLM Researcher',
    subtitle: 'Global Credit Risk GQP (WPI)',
    period: 'Aug 2025 - Dec 2025',
    location: 'Worcester, MA',
    highlights: [
      'Achieved 0.85 F1, 0.835 MCC, 0.743 KS by fine-tuning Phi-4-mini with LoRA adapters',
      'Delivered 20x training efficiency by matching ML benchmark using 1/5 training slices',
      'Validated semantic robustness with feature-order A/B tests, accuracy near 0.947',
    ],
    color: '#0a84ff',
  },
  {
    company: 'Worcester Polytechnic Institute',
    role: 'AI Researcher',
    period: 'Aug 2025 - Present',
    location: 'Worcester, MA',
    highlights: [
      'Achieved 87.4% matching accuracy at 93% lower review cost with 4-tier cascading matcher',
      'Improved F1-per-cost by 11.9x by routing high-confidence pairs to low-cost matching',
      'Reduced deployment time 6x with Gradio dashboard for real-time budget tracking',
    ],
    color: '#5e5ce6',
  },
  {
    company: 'NeuralSeek',
    role: 'AI Intern (Agent Builder)',
    period: 'Aug 2025 - Sept 2025',
    location: 'Remote',
    highlights: [
      'Built scalable natural language AI agents using no-code generative AI platform',
      'Designed and deployed original AI agents with competitive platform analyses',
    ],
    color: '#bf5af2',
  },
  {
    company: 'Atos IT Solutions',
    role: 'System Engineer',
    period: 'Jul 2022 - Jul 2024',
    location: 'Pune, India',
    highlights: [
      'Progressed from DWP Trainee to System Engineer over 2+ years',
      'Worked on enterprise IT solutions and digital workplace services',
    ],
    color: '#ff375f',
  },
];

const projects = [
  {
    title: 'AI Resume & Job Tracker Automation',
    description: 'End-to-end agentic workflow for RAG-guided resume tailoring with ~95% field accuracy.',
    tech: ['Chrome Extension', 'n8n', 'FastAPI', 'Qdrant', 'Ollama', 'RAG'],
    color: '#0a84ff',
    github: 'https://github.com/AnkitGole007',
  },
  {
    title: 'MADWE: Multi-Agent Diffusion World Engine',
    description: '5-agent Unity-Python system with PyTorch diffusion + LoRA, reducing level-design effort 65-75%.',
    tech: ['Unity', 'PyTorch', 'Diffusion', 'LoRA', 'Multi-Agent'],
    color: '#5e5ce6',
    github: 'https://github.com/AnkitGole007',
  },
  {
    title: 'TumorLytix: Brain Tumor Detection',
    description: 'Unsupervised brain tumor detection using CycleGAN and conditional diffusion model refinement.',
    tech: ['CycleGAN', 'Diffusion', 'Medical Imaging', 'PyTorch'],
    color: '#bf5af2',
    github: 'https://github.com/AnkitGole007',
  },
  {
    title: 'Fake Review Bounty Hunter',
    description: 'User behavior modeling + graph analytics for fraud detection using DistilBERT and Neo4j.',
    tech: ['Neo4j', 'DistilBERT', 'Graph Analytics', 'Fraud Detection'],
    color: '#30d158',
    github: 'https://github.com/AnkitGole007',
  },
];

const skillCategories = [
  {
    title: 'Generative AI & LLMs',
    skills: ['PyTorch', 'Hugging Face', 'LLMs', 'RAG', 'LoRA/QLoRA', 'Diffusion Models', 'Prompt Engineering'],
    color: '#0a84ff',
    proficiency: 95,
  },
  {
    title: 'RAG & Agents',
    skills: ['LangChain', 'LlamaIndex', 'Qdrant', 'FAISS', 'Multi-Agent Systems', 'Hybrid Search'],
    color: '#5e5ce6',
    proficiency: 90,
  },
  {
    title: 'Cloud & MLOps',
    skills: ['Azure ML', 'Docker', 'Kubernetes', 'Terraform', 'MLflow', 'GitHub Actions'],
    color: '#bf5af2',
    proficiency: 85,
  },
  {
    title: 'Development',
    skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'Neo4j', 'PostgreSQL'],
    color: '#30d158',
    proficiency: 88,
  },
];

const achievements = [
  { title: 'Data Science GQP MVP Award', org: 'PayPal', icon: Trophy, color: '#ffd700' },
  { title: '3rd Best Data Science GQP Team', org: 'WPI', icon: Award, color: '#0a84ff' },
  { title: '3.88/4.0 GPA', org: 'Masters in AI at WPI', icon: Star, color: '#5e5ce6' },
];

const certifications = [
  'Microsoft AI Classroom Series',
  'Supervised Learning Essential Training',
  'Communicating with Confidence',
];

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Cycle through roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach((section, index) => {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(navItems[index].id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[200] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #0a84ff 0%, #5e5ce6 50%, #bf5af2 100%)',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 px-2 py-2 rounded-full glass-strong">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-[#0a84ff] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-3 rounded-full glass-strong"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 w-48 p-2 rounded-2xl glass-strong md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-[#0a84ff] text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative">
        <AmbientBackground />

        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center z-10"
          >
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] rounded-full blur-2xl opacity-40 animate-pulse" />
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-white/20">
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
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-white via-[#0a84ff] to-[#bf5af2] bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
                Ankit Gole
              </span>
            </motion.h1>

            {/* Typing Role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="h-8 mb-4"
            >
              <span className="text-xl md:text-2xl text-[#0a84ff] font-medium">
                {roles[roleIndex]}
                <span className="animate-pulse">|</span>
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/50 mb-4"
            >
              Masters in Artificial Intelligence @ WPI
            </motion.p>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#30d158]/10 border border-[#30d158]/30 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30d158]" />
              </span>
              <span className="text-[#30d158] text-sm font-medium">Open to Opportunities</span>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center mb-12"
            >
              <a
                href="https://github.com/AnkitGole007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-all group"
              >
                <Github size={20} />
                <span className="font-medium">GitHub</span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://linkedin.com/in/ankit-gole"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0077b5] hover:bg-[#0077b5]/80 transition-all group"
              >
                <Linkedin size={20} />
                <span className="font-medium">LinkedIn</span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white/30"
              >
                <ChevronDown size={32} />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <Section id="about">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">About Me</span>
          </h2>
          <p className="text-white/40 text-center mb-12">The human behind the algorithms</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Who I Am</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Agentic AI Engineer specializing in LLM fine-tuning, retrieval systems, and evaluation
                for commerce signals and user behavior modeling. I build reproducible AI prototypes on
                Azure and HPC infrastructure with calibrated metrics and deployment-focused testing.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
                  <MapPin size={16} className="text-[#0a84ff]" />
                  <span className="text-white/70">Worcester, MA</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm">
                  <Mail size={16} className="text-[#0a84ff]" />
                  <span className="text-white/70">ankit17.gole@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Education</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap size={20} className="text-[#0a84ff]" />
                    <span className="font-medium text-white">Worcester Polytechnic Institute</span>
                  </div>
                  <p className="text-[#0a84ff] text-sm">Masters in Artificial Intelligence</p>
                  <p className="text-white/50 text-sm">2024 - 2026 | GPA: 3.88/4.0</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap size={20} className="text-[#5e5ce6]" />
                    <span className="font-medium text-white">PES Modern College of Engineering</span>
                  </div>
                  <p className="text-[#5e5ce6] text-sm">Bachelor of Engineering - IT</p>
                  <p className="text-white/50 text-sm">2018 - 2022</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Experience Section */}
        <Section id="experience">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">Experience</span>
          </h2>
          <p className="text-white/40 text-center mb-12">From intern to AI whisperer</p>

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl p-8 hover:glow-soft transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${exp.color}20` }}
                    >
                      <Building2 size={24} style={{ color: exp.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{exp.company}</h3>
                      <p className="font-medium" style={{ color: exp.color }}>{exp.role}</p>
                      {exp.subtitle && <p className="text-white/40 text-sm">{exp.subtitle}</p>}
                    </div>
                  </div>
                  <div className="text-white/50 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-white/60 text-sm">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: exp.color }}
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">Projects</span>
          </h2>
          <p className="text-white/40 text-center mb-12">Where ideas become commits</p>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-3xl p-8 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#0a84ff] transition-colors">
                    {project.title}
                  </h3>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Github size={20} className="text-white/50" />
                  </a>
                </div>
                <p className="text-white/60 text-sm mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${project.color}15`,
                        color: project.color,
                        border: `1px solid ${project.color}30`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Skills Section */}
        <Section id="skills">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">Skills</span>
          </h2>
          <p className="text-white/40 text-center mb-12">My neural network stack</p>

          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category, idx) => {
              const ref = useRef(null);
              const isInView = useInView(ref, { once: true });
              const count = useCountAnimation(category.proficiency, 2000, isInView);

              return (
                <motion.div
                  key={category.title}
                  ref={ref}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-3xl p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                    <span className="text-3xl font-bold" style={{ color: category.color }}>
                      {count}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 mb-6 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${category.proficiency}%` } : {}}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm"
                        style={{
                          backgroundColor: `${category.color}15`,
                          color: category.color,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Achievements Section */}
        <Section id="achievements">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">Achievements</span>
          </h2>
          <p className="text-white/40 text-center mb-12">Milestones along the journey</p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="glass rounded-3xl p-8 text-center"
                >
                  <div
                    className="inline-flex p-4 rounded-2xl mb-4"
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <Icon size={32} style={{ color: achievement.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{achievement.title}</h3>
                  <p className="text-white/50 text-sm">{achievement.org}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="glass rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BadgeCheck size={24} className="text-[#0a84ff]" />
              <h3 className="text-xl font-semibold text-white">Certifications</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" className="pb-32">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text-animated">Get in Touch</span>
          </h2>
          <p className="text-white/40 text-center mb-12">Let's build something amazing together</p>

          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-3xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <a
                  href="mailto:ankit17.gole@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-[#0a84ff]/20">
                    <Mail size={24} className="text-[#0a84ff]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white group-hover:text-[#0a84ff] transition-colors">
                      ankit17.gole@gmail.com
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+17745252916"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-[#30d158]/20">
                    <Phone size={24} className="text-[#30d158]" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Phone</p>
                    <p className="text-white group-hover:text-[#30d158] transition-colors">
                      +1 (774) 525-2916
                    </p>
                  </div>
                </a>
              </div>

              <div className="flex gap-4 justify-center">
                <a
                  href="https://github.com/AnkitGole007"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl glass hover:bg-white/10 transition-colors"
                >
                  <Github size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/ankit-gole"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl glass hover:bg-white/10 transition-colors"
                >
                  <Linkedin size={24} />
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <footer className="py-8 text-center text-white/30 text-sm">
          <p>Built with Next.js, Tailwind CSS & Framer Motion</p>
          <p className="mt-2">© 2026 Ankit Gole. All rights reserved.</p>
        </footer>
      </main>

      {/* Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass-strong p-4 rounded-full
                   hover:glow-accent transition-all duration-300 group"
      >
        <MessageCircle size={24} className="text-[#0a84ff] group-hover:text-white transition-colors" />
      </motion.button>

      {/* Chat */}
      <GeminiChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}
