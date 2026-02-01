'use client';

import SectionLayout from '@/components/SectionLayout';
import { motion } from 'framer-motion';
import {
  Github,
  Bot,
  Gamepad2,
  Image as ImageIcon,
  Brain,
  Search,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Resume & Job Tracker Automation',
    period: 'July 2025 - Present',
    icon: <Bot size={24} />,
    description: 'End-to-end agentic workflow for RAG-guided resume tailoring, cutting manual edits ~90% and lifting ATS alignment +35%.',
    highlights: [
      'Chrome MV3 extension + n8n + FastAPI + Qdrant + Ollama (Llama-3.1/Mistral)',
      '~95% field accuracy across LinkedIn/Indeed with ~80% automation coverage',
      '0.89 cosine JD-Resume relevance with recruiter-style critiques',
    ],
    tech: ['Chrome Extension', 'n8n', 'FastAPI', 'Qdrant', 'Ollama', 'RAG'],
    color: '#0a84ff',
    gradient: 'from-[#0a84ff] to-[#5e5ce6]',
  },
  {
    id: 2,
    title: 'MADWE: Multi-Agent Diffusion World Engine',
    period: 'Mar 2025 - Present',
    icon: <Gamepad2 size={24} />,
    description: '5-agent Unity-Python system with named-pipe IPC, PyTorch diffusion + LoRA, reducing level-design effort 65-75%.',
    highlights: [
      '1.9x training throughput with PyTorch AMP and torch.compile',
      '35% iteration time reduction via LoRA adapter extraction',
      'Production-minded: bounded tools, explicit handoffs, replayable traces',
    ],
    tech: ['Unity', 'PyTorch', 'Diffusion', 'LoRA', 'Multi-Agent'],
    github: 'https://github.com/AnkitGole007',
    color: '#5e5ce6',
    gradient: 'from-[#5e5ce6] to-[#bf5af2]',
  },
  {
    id: 3,
    title: 'Drag-A-GAN Paper Reimplementation',
    period: 'Feb 2025 - May 2025',
    icon: <ImageIcon size={24} />,
    description: 'Sub-pixel control on 20+ edits with point tracking and generator-feature loss, stabilized with AMP.',
    highlights: [
      '32% step time reduction through fused ops and larger microbatches',
      'Verified with Nsight Systems traces and PyTorch profiler',
      'Exported to ONNX with TensorRT engine benchmarks',
    ],
    tech: ['PyTorch', 'GAN', 'ONNX', 'TensorRT', 'CUDA'],
    github: 'https://github.com/AnkitGole007',
    color: '#bf5af2',
    gradient: 'from-[#bf5af2] to-[#ff375f]',
  },
  {
    id: 4,
    title: 'TumorLytix: Brain Tumor Detection',
    period: 'Sept 2024 - Dec 2024',
    icon: <Brain size={24} />,
    description: 'Unsupervised brain tumor detection using CycleGAN pseudo-pairs and conditional diffusion model refinement.',
    highlights: [
      '6-9 point Dice improvement validated across held-out slices',
      '~18-25% false positive reduction with 3.2x experiment turnaround',
      '22% VRAM improvement via gradient checkpointing',
    ],
    tech: ['CycleGAN', 'Diffusion', 'Medical Imaging', 'PyTorch'],
    github: 'https://github.com/AnkitGole007',
    color: '#30d158',
    gradient: 'from-[#30d158] to-[#0a84ff]',
  },
  {
    id: 5,
    title: 'Fake Review Bounty Hunter',
    period: 'Feb 2025 - May 2025',
    icon: <Search size={24} />,
    description: 'User behavior modeling + graph analytics for fraud detection using DistilBERT and Neo4j.',
    highlights: [
      '32.2% sentiment-rating mismatches detected across 5,000 reviews',
      '15.0% high-rated entities with low positive sentiment surfaced',
      'Prioritized risk nodes using semantic similarity',
    ],
    tech: ['Neo4j', 'DistilBERT', 'Graph Analytics', 'Fraud Detection'],
    github: 'https://github.com/AnkitGole007',
    color: '#ff375f',
    gradient: 'from-[#ff375f] to-[#ff9500]',
  },
];

export default function ProjectsPage() {
  return (
    <SectionLayout title="Projects" subtitle="Where ideas become commits">
      <div className="grid gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group card-futuristic p-8 hover:glow-soft transition-all duration-500"
          >
            {/* Gradient top border */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${project.gradient} opacity-60`} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: `${project.color}15` }}
                >
                  <span style={{ color: project.color }}>{project.icon}</span>
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:gradient-text-accent transition-all duration-300">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                    <Calendar size={14} />
                    <span>{project.period}</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass
                           text-white/60 hover:text-white transition-colors"
                >
                  <Github size={16} />
                  <span className="text-sm">View Code</span>
                  <ArrowUpRight size={14} />
                </motion.a>
              )}
            </div>

            {/* Description */}
            <p className="text-white/70 leading-relaxed mb-6 text-center md:text-left">
              {project.description}
            </p>

            {/* Highlights */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {project.highlights.map((highlight, hIdx) => (
                <div
                  key={hIdx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full mb-3"
                    style={{ backgroundColor: project.color }}
                  />
                  <p className="text-white/50 text-sm leading-relaxed">{highlight}</p>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="tech-tag px-4 py-1.5 rounded-full text-xs font-medium
                           border transition-all duration-300"
                  style={{
                    backgroundColor: `${project.color}08`,
                    borderColor: `${project.color}25`,
                    color: project.color,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
