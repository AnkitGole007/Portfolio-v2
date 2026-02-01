'use client';

import SectionLayout from '@/components/SectionLayout';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  MapPin,
  ChevronRight,
  GraduationCap,
  Briefcase
} from 'lucide-react';

const experiences = [
  {
    id: 1,
    company: 'PayPal',
    role: 'Applied LLM Researcher',
    subtitle: 'Global Credit Risk GQP (WPI)',
    period: 'Aug 2025 - Dec 2025',
    location: 'Worcester, MA',
    highlights: [
      'Improved decision quality with 0.85 F1, 0.835 MCC, 0.743 KS by fine-tuning Phi-4-mini using LoRA adapters',
      'Delivered 20x training-data efficiency by matching ML benchmark using 1/5 training slices',
      'Validated semantic robustness with feature-order A/B tests, holding accuracy near 0.947',
      'Implemented AES-GCM encrypted transfer workflow with restricted directories',
      'Benchmarked Random Forest, SVM, and XGBoost across 10-seed stability tests on 692,922 records',
    ],
    color: '#0a84ff',
    gradient: 'from-[#0a84ff] to-[#5e5ce6]',
  },
  {
    id: 2,
    company: 'Worcester Polytechnic Institute',
    role: 'AI Researcher',
    period: 'Aug 2025 - Present',
    location: 'Worcester, MA',
    highlights: [
      'Achieved 87.4% matching accuracy at 93% lower review cost with 4-tier cascading matcher',
      'Improved F1-per-cost by 11.9x by routing 65% high-confidence pairs to low-cost matching',
      'Improved upstream data quality by 20% with schema checks, normalization UDFs, and blocking rules',
      'Reduced deployment time 6x with Gradio dashboard featuring real-time budget tracking',
    ],
    color: '#5e5ce6',
    gradient: 'from-[#5e5ce6] to-[#bf5af2]',
  },
  {
    id: 3,
    company: 'Worcester Polytechnic Institute',
    role: 'Graduate Assistant - FIN 530',
    subtitle: 'Cryptocurrencies and Financial Markets',
    period: 'Apr 2025 - Dec 2025',
    location: 'Worcester, MA',
    highlights: [
      'Assisted with labs on regulated stablecoins and CBDCs using Hyperledger Fabric, Docker, Python',
      'Graded quizzes, midterms, and project reports on tokenization and quantum-safe payments',
      'Mentored student teams on smart contract logic, system design, and documentation',
    ],
    color: '#30d158',
    gradient: 'from-[#30d158] to-[#0a84ff]',
  },
  {
    id: 4,
    company: 'Worcester Polytechnic Institute',
    role: 'Graduate Assistant - FIN 540',
    subtitle: 'Financial Analytics',
    period: 'Jan 2025 - Mar 2025',
    location: 'Worcester, MA',
    highlights: [
      'Reviewed homework and projects on portfolio theory, risk/return, and regression using Python',
      'Debugged student code showing how inputs affect risk metrics and investment decisions',
      'Contributed to refining grading rubrics by analyzing frequent errors',
    ],
    color: '#ffd60a',
    gradient: 'from-[#ffd60a] to-[#ff9500]',
  },
  {
    id: 5,
    company: 'NeuralSeek',
    role: 'AI Intern (Agent Builder)',
    period: 'Aug 2025 - Sept 2025',
    location: 'Remote',
    highlights: [
      'Built scalable natural language AI agents using NeuralSeek\'s no-code platform',
      'Designed and deployed original AI agents with competitive analyses',
      'Gained hands-on experience with cutting-edge AI agent architectures',
    ],
    color: '#bf5af2',
    gradient: 'from-[#bf5af2] to-[#ff375f]',
  },
  {
    id: 6,
    company: 'Atos IT Solutions',
    role: 'System Engineer',
    period: 'Jul 2022 - Jul 2024',
    location: 'Pune, India',
    highlights: [
      'Progressed from DWP Trainee to System Engineer over 2+ years',
      'Worked on enterprise IT solutions and services',
    ],
    color: '#ff375f',
    gradient: 'from-[#ff375f] to-[#ff9500]',
    subRoles: [
      { role: 'Associate Engineer', period: 'Nov 2022 - Aug 2023' },
      { role: 'DWP Trainee', period: 'Jul 2022 - Dec 2022' },
    ],
  },
  {
    id: 7,
    company: 'Larsen & Toubro',
    role: 'Web Developer Intern',
    period: 'Aug 2020 - Nov 2020',
    location: 'Pune, India',
    highlights: [
      'Developed and updated Company Portal at L&T Defence',
      'Worked on Defence Newsletter website as UI/UX developer',
    ],
    color: '#ff9500',
    gradient: 'from-[#ff9500] to-[#ffd60a]',
  },
];

export default function ExperiencePage() {
  return (
    <SectionLayout title="Experience" subtitle="From intern to AI whisperer">
      <div className="relative">
        {/* Timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#0a84ff] via-[#5e5ce6] to-[#bf5af2] hidden lg:block" />

        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative lg:pl-20"
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                className="absolute left-4 top-10 hidden lg:flex items-center justify-center"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${exp.color}20` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: exp.color }}
                  />
                </div>
              </motion.div>

              {/* Card */}
              <div className="card-futuristic p-8 hover:glow-soft transition-all duration-500">
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${exp.gradient} opacity-50`} />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-xl hidden md:flex"
                      style={{ backgroundColor: `${exp.color}15` }}
                    >
                      <Building2 size={24} style={{ color: exp.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{exp.company}</h3>
                      <p className="text-lg font-medium" style={{ color: exp.color }}>{exp.role}</p>
                      {exp.subtitle && (
                        <p className="text-white/40 text-sm mt-1">{exp.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm md:text-right">
                    <div className="flex items-center gap-2 text-white/50 md:justify-end">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 md:justify-end">
                      <MapPin size={14} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-3 mb-4">
                  {exp.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-3">
                      <ChevronRight
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: exp.color }}
                      />
                      <p className="text-white/60 text-sm leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>

                {/* Sub-roles */}
                {exp.subRoles && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-white/30 text-xs mb-3 uppercase tracking-wider">Previous Roles</p>
                    <div className="flex flex-wrap gap-3">
                      {exp.subRoles.map((sub, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1.5 rounded-full bg-white/5 text-white/50 text-xs"
                        >
                          {sub.role} • {sub.period}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
