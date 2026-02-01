'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Star, Zap } from 'lucide-react';

const highlights = [
  {
    icon: <Trophy size={16} />,
    title: 'GQP MVP Award',
    description: 'Data Science MVP - PayPal',
    color: '#ffd700',
  },
  {
    icon: <Award size={16} />,
    title: '3rd Best GQP Team',
    description: 'Data Science Fall 2025',
    color: '#0a84ff',
  },
  {
    icon: <Star size={16} />,
    title: '3.88 GPA',
    description: 'Masters in AI at WPI',
    color: '#5e5ce6',
  },
  {
    icon: <Zap size={16} />,
    title: '0.85 F1 Score',
    description: 'PayPal Risk Decisioning',
    color: '#30d158',
  },
];

export default function LinkedInHighlights() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      <div className="glass rounded-xl p-3 space-y-2.5 max-w-[180px]">
        <h3 className="text-white/60 text-[10px] font-medium uppercase tracking-wider mb-3">
          Highlights
        </h3>
        {highlights.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + idx * 0.1 }}
            className="flex items-center gap-2 group cursor-default"
          >
            <div
              className="p-1.5 rounded-md transition-all duration-300 group-hover:scale-110 shrink-0"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{item.title}</p>
              <p className="text-white/50 text-[10px] truncate">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
